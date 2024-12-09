"use client";
import "@therootnetwork/api-types";
import { ApiPromise } from "@polkadot/api";
import React from "react";
import { getChainApi } from "@/lib/trn/getChainApi";

interface ApiContextType {
  api: ApiPromise | undefined;
  isReady: boolean;
}

const ApiContext = React.createContext<ApiContextType>({
  api: undefined,
  isReady: false,
});

type IProps = {
  children: React.ReactNode;
};

export const ApiProvider: React.FC<IProps> = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isReady, setIsReady] = React.useState(false);
  const [api, setApi] = React.useState<ApiPromise | undefined>(undefined);

  React.useEffect(() => {
    const init = async () => {
      const api = await getChainApi(process.env.NEXT_PUBLIC_NETWORK);
      await api.isReady;
      setIsReady(true);
      setApi(api);
    };

    init();
  }, []);

  return (
    <ApiContext.Provider value={{ api, isReady }}>
      {children}
    </ApiContext.Provider>
  );
};

export default ApiContext;
