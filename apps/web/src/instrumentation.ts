export async function register() {
  const mockingEnabled =
    process.env.NEXT_PUBLIC_API_MOCKING !== "disabled" &&
    (process.env.NEXT_PUBLIC_API_MOCKING === "enabled" ||
      process.env.NODE_ENV === "development");
  if (process.env.NEXT_RUNTIME === "nodejs" && mockingEnabled) {
    const { server } = await import("./shared/mocks/server");
    server.listen({ onUnhandledRequest: "bypass" });
  }
}
