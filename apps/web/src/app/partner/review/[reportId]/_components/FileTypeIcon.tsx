import { FileText } from "@/shared/ui/icons/FileText";
import { ImageIcon } from "@/shared/ui/icons/ImageIcon";
import { isImageMime } from "../_model/mime";

export function FileTypeIcon({ mimeType }: { mimeType: string }) {
  return isImageMime(mimeType) ? (
    <ImageIcon className="size-[1.125rem]" />
  ) : (
    <FileText className="size-[1.125rem]" />
  );
}
