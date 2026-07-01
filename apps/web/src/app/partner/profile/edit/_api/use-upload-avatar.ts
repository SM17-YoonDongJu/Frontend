"use client";

import { useMutation } from "@tanstack/react-query";
import { uploadAvatar } from "./upload-avatar";

export function useUploadAvatar() {
  return useMutation({
    mutationFn: (file: File) => uploadAvatar(file),
  });
}
