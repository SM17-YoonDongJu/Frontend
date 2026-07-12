"use client";

import { useMutation } from "@tanstack/react-query";
import { uploadFile } from "./upload-file";

export function useUploadFile() {
  return useMutation({
    mutationFn: (file: File) => uploadFile(file),
  });
}
