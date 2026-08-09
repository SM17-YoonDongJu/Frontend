"use client";

import { useMutation } from "@tanstack/react-query";
import { uploadDocument } from "./upload-document";

/** 문서 업로드 뮤테이션(파일 1건). 재시도는 컴포넌트가 mutate 재호출로 처리. */
export function useUploadDocument() {
  return useMutation({ mutationFn: uploadDocument });
}
