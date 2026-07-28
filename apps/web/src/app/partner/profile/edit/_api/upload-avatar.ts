import { uploadFile } from "@/shared/api/upload-file";
import type { UploadAvatarResponse } from "../_model/types";

/** 프로필 아바타 업로드(presigned URL 발급 → S3 직접 PUT). */
export function uploadAvatar(file: File): Promise<UploadAvatarResponse> {
  return uploadFile(file, "avatar");
}
