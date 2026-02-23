export {};

declare global {
  interface Window {
    api: {
      toggleBackend: (action: "start" | "stop") => Promise<string>;
    };
  }
}