import { isServer, QueryClient } from "@tanstack/react-query";

// App Router SSR 대응: 서버에서는 요청마다 새 클라이언트,
// 브라우저에서는 싱글톤을 재사용한다 (suspense 중복 생성 방지).
function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // 서버에서 prefetch 한 값이 클라이언트에서 즉시 refetch 되지 않도록 약간의 staleTime
        staleTime: 60 * 1000
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
