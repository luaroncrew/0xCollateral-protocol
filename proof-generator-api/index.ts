import Fastify from 'fastify'
import { createVlayerClient } from "@vlayer/sdk";
import proverSpec from "./spec/KrakenProver.sol/KrakenProver";
import verifierSpec from "./spec/KrakenVerifier.sol/KrakenVerifier";

import {
    getConfig,
    createContext,
} from "@vlayer/sdk/config";


const PROVER_ADDRESS =  "0x9c1a5ba365216ec6b43ee4094b767522328c2a46"
const VERIFIER_ADDRESS =  "0x7e7d683860bd16436e145566151cf60b3a43a913"


const config = getConfig();
const { chain, ethClient, account, proverUrl, confirmations, notaryUrl } =
    createContext(config);

const vlayer = createVlayerClient({
    url: proverUrl,
    token: config.token,
});

const fastify = Fastify({ logger: true })

interface ProofRequestPayload {
    payment_intent: string
}


// a POST route to generate a web proof for a payment intent
// the route accepts "paymentIntent" in a body
fastify.post<{ Body: ProofRequestPayload }>('/generateProof', {
    schema: {
        body: {
            type: 'object',
            required: ['payment_intent'],
            properties: {
                payment_intent: { type: 'string' }
            }
        }
    }
}, async (request, reply) => {
    const { payment_intent } = request.body

    const urlToCall = `https://api.stripe.com/v1/payment_intents/${payment_intent}`
    const stripeToken = process.env.STRIPE_API_TOKEN
    const notaryUrl = process.env.NOTARY_URL

    console.log("⏳ Generating web proof...");

    const webProofResult =
        await Bun.$`vlayer web-proof-fetch --notary ${notaryUrl} --url ${urlToCall} --header "Authorization: Bearer ${stripeToken}"`;

    console.log("✅ Web proof generated successfully!");

    const webProof = webProofResult.stdout.toString();

    const hash = await vlayer.prove({
        address: PROVER_ADDRESS,
        functionName: "main",
        proverAbi: proverSpec.abi,
        args: [
            {
                webProofJson: webProof.toString()
            },
            payment_intent
        ],
        chainId: chain.id,
        gasLimit: config.gasLimit,
    });

    console.log(hash);

    const proovingResult = await vlayer.waitForProvingResult({ hash });
    console.log("✅ Proving result:", proovingResult);


    const gas = await ethClient.estimateContractGas({
        address: VERIFIER_ADDRESS,
        abi: verifierSpec.abi,
        functionName: "verify",
        args: proovingResult,
        account,
        blockTag: "pending",
    });

    console.log("Estimated gas for verification:", gas);

    const txHash = await ethClient.writeContract({
        address: VERIFIER_ADDRESS,
        abi: verifierSpec.abi,
        functionName: "verify",
        args: proovingResult,
        chain,
        account,
        gas,
    });

    console.log("⏳ Waiting for transaction receipt...");

    await ethClient.waitForTransactionReceipt({
        hash: txHash,
        confirmations,
        retryCount: 60,
        retryDelay: 1000,
    });

    console.log("✅ Verified!");

})


// a GET route to fetch collateralized amount for an address
fastify.get<{ Params: { address: string } }>(
    '/collateral/:address',
    async (request, reply
    ) => {
    const { address } = request.params;
    try {
        const amount = await ethClient.readContract({
            address: VERIFIER_ADDRESS,
            abi: verifierSpec.abi,
            functionName: 'getCollateralizedAmount',
            args: [address],
        });

        return { address, amount: amount.toString() };
    } catch (err) {
        request.log.error(err);
        reply.status(500).send({ error: 'Failed to fetch collateralized amount.' });
    }
});



// Start server
const start = async () => {
    try {
        await fastify.listen({ port: 3000, host: '0.0.0.0' })
        fastify.log.info(`Server running at http://localhost:3000`)
    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    }
}
start()
