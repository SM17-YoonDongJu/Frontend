"use client";

import { useMutation } from "@tanstack/react-query";
import { uploadFile } from "./upload-file";
import type { UploadPurpose } from "@/shared/model/upload.schema";

export function useUploadFile(purpose: UploadPurpose) {
  return useMutation({
    mutationFn: (file: File) => uploadFile(file, purpose),
  });
}
