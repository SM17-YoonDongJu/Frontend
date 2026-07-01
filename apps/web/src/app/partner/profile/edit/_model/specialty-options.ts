export const SPECIALTY_OPTIONS = [
  "후유장해",
  "교통사고",
  "실손 의료비",
  "암·진단비",
  "배상책임(대인)",
  "산재 연계",
] as const;

export const MAX_SPECIALTIES = 3;
export const HEADLINE_MAX = 40;
export const INTRODUCTION_MAX = 300;
export const AVATAR_MAX_BYTES = 5 * 1024 * 1024;
export const AVATAR_ACCEPT = ["image/jpeg", "image/png"] as const;
