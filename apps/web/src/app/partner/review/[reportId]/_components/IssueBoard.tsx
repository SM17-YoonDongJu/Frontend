"use client";

import type { ReviewIssue, IssueReviewStatus } from "../_model/types";
import type { DraftIssue } from "../_hooks/use-review-draft";
import { IssueCard } from "./IssueCard";
import { IssueAddForm } from "./IssueAddForm";

export interface IssueBoardActions {
  setStatus: (key: string, status: IssueReviewStatus) => void;
  editIssue: (key: string, patch: Partial<ReviewIssue>) => void;
  addIssue: (title: string, description: string, impactAmount: number | null) => void;
  removeIssue: (key: string) => void;
}

export interface IssueBoardProps {
  issues: DraftIssue[];
  actions: IssueBoardActions;
}

export function IssueBoard({ issues, actions }: IssueBoardProps) {
  return (
    <section className="rounded-card-lg border border-line bg-card p-6">
      <h2 className="font-serif text-[1.0625rem] font-bold text-ink">
        쟁점별 검수 <span className="text-gold-ink">{issues.length}건</span>
      </h2>
      <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-ink-3">
        AI 초안 판단을 검토해 인정·수정·제외와 의견을 남겨주세요. 빠진 쟁점은 직접 추가할 수 있어요.
      </p>

      {issues.length === 0 ? (
        <p className="mt-4 rounded-card border border-dashed border-line-2 bg-paper-2 px-4 py-6 text-center text-[0.84375rem] text-ink-3">
          AI가 추출한 쟁점이 없습니다. 아래에서 검토할 쟁점을 직접 추가해 주세요.
        </p>
      ) : (
        <ol className="mt-4 space-y-3">
          {issues.map((issue, index) => (
            <IssueCard
              key={issue.key}
              issue={issue}
              index={index}
              onSetStatus={(status) => actions.setStatus(issue.key, status)}
              onPatch={(patch) => actions.editIssue(issue.key, patch)}
              onRemove={() => actions.removeIssue(issue.key)}
            />
          ))}
        </ol>
      )}

      <div className="mt-3">
        <IssueAddForm onAdd={actions.addIssue} />
      </div>
    </section>
  );
}
