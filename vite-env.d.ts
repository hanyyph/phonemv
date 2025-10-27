// Fix: Manually defining vite's `import.meta.env` interface to resolve TypeScript errors
// related to environment variables and missing type definitions for 'vite/client'.

interface ImportMetaEnv {
  readonly VITE_API_KEY: string;
  // Add other environment variables here as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
