/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_TWITTER_HANDLE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module '/@react-refresh' {
  const RefreshRuntime: {
    injectIntoGlobalHook(target: Window): void;
  };

  export default RefreshRuntime;
}
