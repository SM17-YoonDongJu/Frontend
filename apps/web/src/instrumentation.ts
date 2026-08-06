import * as Sentry from "@sentry/nextjs";

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("../sentry.server.config");
  }
  if (process.env.NEXT_RUNTIME === "edge") {
    await import("../sentry.edge.config");
  }

  const mockingEnabled =
    process.env.NEXT_PUBLIC_API_MOCKING !== "disabled" &&
    (process.env.NEXT_PUBLIC_API_MOCKING === "enabled" ||
      process.env.NODE_ENV === "development");
  if (process.env.NEXT_RUNTIME === "nodejs" && mockingEnabled) {
    const { server } = await import("./shared/mocks/server");
    server.listen({ onUnhandledRequest: "bypass" });
  }
}

export const onRequestError = Sentry.captureRequestError;
