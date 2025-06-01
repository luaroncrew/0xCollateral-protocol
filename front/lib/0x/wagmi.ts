import { metaMask } from "wagmi/connectors";

import { mainnet, sepolia } from "viem/chains";

import { http, cookieStorage, createConfig, createStorage } from "wagmi";

export const getWagmiConfig = () => {
  return createConfig({
    ssr: true,
    chains: [mainnet, sepolia],
    connectors: [
      metaMask({
        dappMetadata: {
          name: "0xCollateral",
        },
      }),
    ],
    transports: {
      [mainnet.id]: http(),
      [sepolia.id]: http(),
    },
    storage: createStorage({
      storage: cookieStorage,
    }),
  });
};
