import { isServer, QueryClient } from "@tanstack/react-query";
import { isRetryableError } from "@/shared/api/error-codes";

const MAX_QUERY_RETRIES = 3;

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        retry: (failureCount, error) =>
          failureCount < MAX_QUERY_RETRIES && isRetryableError(error),
      }
    }
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

export function getQueryClient() {
  if (isServer) {
    return makeQueryClient();
  }
  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient();
  }
  return browserQueryClient;
}
