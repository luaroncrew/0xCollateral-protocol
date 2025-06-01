"use client";

import { FC } from "react";

import { WalletIcon } from "@web3icons/react";

import { Connector, CreateConnectorFn, useConnect } from "wagmi";

import { Button } from "@/components/ui/button";

export const WalletConnector: FC<{
  connector: Connector<CreateConnectorFn>;
}> = (props) => {
  const { connect } = useConnect();

  return (
    <Button
      variant="outline"
      onClick={() => {
        connect({
          connector: props.connector,
        });
      }}
      className="flex items-center gap-2"
    >
      {props.connector.name}
      <WalletIcon name={props.connector.name} size={24} variant="branded" />
    </Button>
  );
};
