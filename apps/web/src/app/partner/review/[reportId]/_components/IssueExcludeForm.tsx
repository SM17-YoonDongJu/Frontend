"use client";

import { Input } from "@/shared/ui/Input";
import { Label } from "@/shared/ui/Label";
import type { ReviewIssue } from "../_model/types";

export interface IssueExcludeFormProps {
  issue: ReviewIssue;
  onPatch: (patch: Partial<ReviewIssue>) => void;
}

export function IssueExcludeForm({ issue, onPatch }: IssueExcludeFormProps) {
  return (
    <div className="mt-3 rounded-card border border-terra-2 bg-terra-soft/40 p-4">
      <Label htmlFor={`exclude-reason-${issue.id}`}>제외 사유</Label>
      <Input
        id={`exclude-reason-${issue.id}`}
        multiline
        rows={2}
        className="mt-1.5"
        placeholder="이 쟁점을 제외하는 이유를 적어주세요."
        value={issue.excludedReason ?? ""}
        onChange={(e) => onPatch({ excludedReason: e.target.value })}
      />
    </div>
  );
}
