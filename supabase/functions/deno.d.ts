/// <reference no-default-lib="true" />
/// <reference lib="deno.ns" />

declare namespace Deno {
  interface Env {
    get(key: string): string | undefined;
  }
  const env: Env;
} 