"use client";

import { SegmentedControl } from "@/shared/ui/SegmentedControl";
import { ISSUE_STATUS_OPTIONS } from "../_model/status-meta";
import type { ReviewIssueStatus } from "../_model/types";

export interface IssueStatusControlProps {
  value: ReviewIssueStatus;
  onChange: (status: ReviewIssueStatus) => void;
}

export function IssueStatusControl({ value, onChange }: IssueStatusControlProps) {
  const selected = value === "PENDING" ? null : value;

  return (
    <SegmentedControl
      size="sm"
      aria-label="쟁점 검수 상태"
      options={ISSUE_STATUS_OPTIONS}
      value={selected}
      onChange={onChange}
    />
  );
}
