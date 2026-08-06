import { uploadFile } from "@/shared/api/upload-file";
import type { UploadResponse } from "@/shared/model/upload.schema";

/** 프로필 아바타 업로드(POST /uploads multipart). */
export function uploadAvatar(file: File): Promise<UploadResponse> {
  return uploadFile(file, "avatar");
}
