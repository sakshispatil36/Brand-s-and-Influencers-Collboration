/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_KEY: string;       // Example env variable
  readonly VITE_AUTH_DOMAIN: string;
  readonly VITE_PROJECT_ID: string;
  readonly VITE_STORAGE_BUCKET: string;
  readonly VITE_MESSAGING_SENDER_ID: string;
  readonly VITE_APP_ID: string;
  // add more if you have them
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
