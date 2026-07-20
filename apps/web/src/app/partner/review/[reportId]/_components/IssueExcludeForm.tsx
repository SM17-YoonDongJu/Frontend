"use client";

import { Input } from "@/shared/ui/Input";
import { Label } from "@/shared/ui/Label";
import type { ReviewIssue } from "../_model/types";
import type { DraftIssue } from "../_hooks/use-review-draft";

export interface IssueExcludeFormProps {
  issue: DraftIssue;
  onPatch: (patch: Partial<ReviewIssue>) => void;
}

export function IssueExcludeForm({ issue, onPatch }: IssueExcludeFormProps) {
  return (
    <div className="mt-3 rounded-card border border-terra-2 bg-terra-soft/40 p-4">
      <Label htmlFor={`exclude-reason-${issue.key}`}>제외 사유</Label>
      <Input
        id={`exclude-reason-${issue.key}`}
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
