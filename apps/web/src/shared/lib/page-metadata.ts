import type { Metadata } from "next";

const SITE_NAME = "바른보상";
const OG_IMAGE_PATH = "/opengraph-image";

type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
};

/**
 * 공개 페이지용 메타데이터 생성기.
 * 페이지가 openGraph를 직접 지정하면 루트 설정을 덮어써 공유 이미지까지 사라지므로,
 * 제목·설명·경로만 받아 이미지와 사이트명을 함께 채운다.
 */
export function createPageMetadata({ title, description, path }: PageMetadataInput): Metadata {
  const sharedTitle = `${title} | ${SITE_NAME}`;

  return {
    title,
    description,
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      title: sharedTitle,
      description,
      url: path,
      locale: "ko_KR",
      images: [OG_IMAGE_PATH]
    },
    twitter: {
      card: "summary_large_image",
      title: sharedTitle,
      description,
      images: [OG_IMAGE_PATH]
    }
  };
}
