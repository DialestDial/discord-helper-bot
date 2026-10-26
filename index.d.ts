declare global {
  namespace NodeJS {
    interface ProcessEnv {
      ownerid: string;
      helper_bot_token: string;
      proxyURL: string;
      proxy_token: string;
      useProxy: string;
    }
  }
}
export {};
