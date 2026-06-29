import { API_BASE_URL } from "@/shared/api/config";
import { fetchJson } from "@/shared/api/fetch-json";
import { uploadAvatarResponseSchema } from "../_model/adjuster-profile.schema";
import type { UploadAvatarResponse } from "../_model/types";

export function uploadAvatar(file: File): Promise<UploadAvatarResponse> {
  const formData = new FormData();
  formData.append("file", file);

  return fetchJson(`${API_BASE_URL}/uploads`, uploadAvatarResponseSchema, {
    method: "POST",
    body: formData,
  });
}
