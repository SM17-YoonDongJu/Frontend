import type { UserType } from "./user";

const HOME_PATH_BY_USER_TYPE = {
  insured_person: "/customer/dashboard",
  adjuster: "/partner"
} as const;

export function homePathByUserType(userType: UserType): string {
  return HOME_PATH_BY_USER_TYPE[userType];
}
