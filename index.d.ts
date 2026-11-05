declare global {
  namespace NodeJS {
    interface ProcessEnv {
      ownerid: string;
      helper_bot_token: string;
      proxyURL: string;
      proxy_token: string;
      useProxy: string;
      aomcRawIp: string;
      aomcDioriteIp: string;
      aomcOliverIp: string;
      aomcSeed: string;
    }
  }
}
export {};
