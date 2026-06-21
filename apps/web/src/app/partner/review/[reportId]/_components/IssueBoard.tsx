"use client";

import type { ReviewIssue, ReviewIssueStatus } from "../_model/types";
import { IssueCard } from "./IssueCard";
import { IssueAddForm } from "./IssueAddForm";

export interface IssueBoardActions {
  setStatus: (id: string, status: ReviewIssueStatus) => void;
  editIssue: (id: string, patch: Partial<ReviewIssue>) => void;
  addIssue: (title: string, description: string, impactAmount: number | null) => void;
  removeIssue: (id: string) => void;
}

export interface IssueBoardProps {
  issues: ReviewIssue[];
  actions: IssueBoardActions;
}

export function IssueBoard({ issues, actions }: IssueBoardProps) {
  return (
    <section className="rounded-card-lg border border-line bg-card p-6">
      <h2 className="font-serif text-[17px] font-bold text-ink">
        쟁점별 검수 <span className="text-gold-ink">{issues.length}건</span>
      </h2>
      <p className="mt-1.5 text-[13px] leading-relaxed text-ink-3">
        AI 초안 판단을 검토해 인정·수정·제외와 의견을 남겨주세요. 빠진 쟁점은 직접 추가할 수 있어요.
      </p>

      <ol className="mt-4 space-y-3">
        {issues.map((issue, index) => (
          <IssueCard
            key={issue.id}
            issue={issue}
            index={index}
            onSetStatus={(status) => actions.setStatus(issue.id, status)}
            onPatch={(patch) => actions.editIssue(issue.id, patch)}
            onRemove={() => actions.removeIssue(issue.id)}
          />
        ))}
      </ol>

      <div className="mt-3">
        <IssueAddForm onAdd={actions.addIssue} />
      </div>
    </section>
  );
}
