declare global {
  namespace NodeJS {
    interface ProcessEnv {
      ownerID: string;
      token: string;

      MEMORY_AVAILABLE: string;
      PWD: string;
      PORT: string;
      NODE_ENV: string;
      NODE_HOME: string;
      HOME: string;
      SHLVL: string;
      WEB_MEMORY: string;
      WEB_CONCURRENCY: string;
      PS1: string;
      PATH: string;
      DYNO: string;
      _: string;
    }
  }
}
export {};