"use client";

import { useEffect, useMemo, useReducer, useState } from "react";
import type {
  IssueReviewStatus,
  ReviewDetail,
  ReviewIssue,
  ReviewSubmit,
} from "../_model/types";

const DRAFT_PREFIX = "review-draft:";

/** 리스트 key·액션 타겟용 클라이언트 식별자. 서버 전송엔 issueId/reviewIssueId만 사용. */
export type DraftIssue = ReviewIssue & { key: string };

function draftKey(reportId: string): string {
  return `${DRAFT_PREFIX}${reportId}`;
}

function loadDraft(reportId: string): ReviewDraftState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(draftKey(reportId));
    return raw ? (JSON.parse(raw) as ReviewDraftState) : null;
  } catch {
    return null;
  }
}

/** 임시저장 드래프트 삭제(검수 완료·초기화 시). */
export function clearReviewDraft(reportId: string) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(draftKey(reportId));
  } catch {
    /* noop */
  }
}

export interface ReviewDraftState {
  issues: DraftIssue[];
  estimateMin: number | null;
  estimateMax: number | null;
  review: string;
}

type ReviewDraftAction =
  | { type: "INIT"; detail: ReviewDetail }
  | { type: "RESET"; detail: ReviewDetail }
  | { type: "RESTORE"; state: ReviewDraftState }
  | { type: "SET_STATUS"; key: string; status: IssueReviewStatus }
  | { type: "EDIT_ISSUE"; key: string; patch: Partial<ReviewIssue> }
  | { type: "ADD_ISSUE"; title: string; description: string; impactAmount: number | null }
  | { type: "REMOVE_ISSUE"; key: string }
  | { type: "SET_RANGE"; min: number | null; max: number | null }
  | { type: "SET_REVIEW"; review: string };

function fromDetail(detail: ReviewDetail): ReviewDraftState {
  return {
    issues: detail.issues.map((issue) => ({ ...issue, key: crypto.randomUUID() })),
    estimateMin: detail.adjusterEstimate?.min ?? null,
    estimateMax: detail.adjusterEstimate?.max ?? null,
    review: detail.review ?? "",
  };
}

function reducer(
  state: ReviewDraftState,
  action: ReviewDraftAction,
): ReviewDraftState {
  switch (action.type) {
    case "INIT":
    case "RESET":
      return fromDetail(action.detail);
    case "RESTORE":
      return action.state;
    case "SET_STATUS":
      return {
        ...state,
        issues: state.issues.map((issue) =>
          issue.key === action.key ? { ...issue, reviewStatus: action.status } : issue,
        ),
      };
    case "EDIT_ISSUE":
      return {
        ...state,
        issues: state.issues.map((issue) =>
          issue.key === action.key ? { ...issue, ...action.patch } : issue,
        ),
      };
    case "ADD_ISSUE":
      return {
        ...state,
        issues: [
          ...state.issues,
          {
            key: crypto.randomUUID(),
            issueId: null,
            reviewIssueId: null,
            aiTitle: null,
            aiDescription: null,
            aiStatus: null,
            tags: [],
            impactAmount: action.impactAmount,
            reviewStatus: "ADDED",
            adjusterOpinion: null,
            modifiedTitle: action.title,
            modifiedDescription: action.description,
            modifiedImpactAmount: action.impactAmount,
            modifiedReason: null,
            excludedReason: null,
          },
        ],
      };
    case "REMOVE_ISSUE":
      return {
        ...state,
        issues: state.issues.filter((issue) => issue.key !== action.key),
      };
    case "SET_RANGE":
      return { ...state, estimateMin: action.min, estimateMax: action.max };
    case "SET_REVIEW":
      return { ...state, review: action.review };
    default:
      return state;
  }
}

export function toSubmitBody(
  state: ReviewDraftState,
  _options?: { complete?: boolean },
): ReviewSubmit {
  const body: ReviewSubmit = {
    review: state.review,
    issues: state.issues
      .filter((issue) => issue.reviewStatus !== null)
      .map((issue) => ({
        reviewStatus: issue.reviewStatus as IssueReviewStatus,
        reviewIssueId: issue.reviewIssueId ?? undefined,
        issueId: issue.issueId,
        title: issue.modifiedTitle ?? undefined,
        description: issue.modifiedDescription ?? undefined,
        impactAmount: issue.modifiedImpactAmount ?? issue.impactAmount ?? undefined,
        modifiedReason: issue.modifiedReason ?? undefined,
        excludedReason: issue.excludedReason ?? undefined,
        adjusterOpinion: issue.adjusterOpinion ?? undefined,
      })),
  };
  if (state.estimateMin !== null) body.estimateMinAmount = state.estimateMin;
  if (state.estimateMax !== null) body.estimateMaxAmount = state.estimateMax;
  return body;
}

export function useReviewDraft(detail: ReviewDetail) {
  const [state, dispatch] = useReducer(reducer, detail, fromDetail);

  // 첫 마운트 시 저장본 존재 여부(이 reportId 키 대조). 있으면 사용자가 결정할 때까지 대기.
  const [savedDraft] = useState(() => loadDraft(detail.reportId));
  const [resolved, setResolved] = useState(savedDraft === null);
  const draftPromptOpen = !resolved;

  // 결정 전에는 자동 저장 보류(저장본을 새 초안으로 덮어쓰지 않도록).
  useEffect(() => {
    if (draftPromptOpen) return;
    const timer = window.setTimeout(() => {
      try {
        window.localStorage.setItem(draftKey(detail.reportId), JSON.stringify(state));
      } catch {
        /* noop */
      }
    }, 500);
    return () => window.clearTimeout(timer);
  }, [state, detail.reportId, draftPromptOpen]);

  const draftPrompt = useMemo(
    () => ({
      open: draftPromptOpen,
      restore: () => {
        if (savedDraft) dispatch({ type: "RESTORE", state: savedDraft });
        setResolved(true);
      },
      discard: () => {
        clearReviewDraft(detail.reportId);
        setResolved(true);
      },
    }),
    [draftPromptOpen, savedDraft, detail.reportId],
  );

  const derived = useMemo(() => {
    const reviewed = state.issues.filter((i) => i.reviewStatus !== null).length;
    const total = state.issues.length;
    return {
      progress: { reviewed, total },
      counts: {
        accepted: state.issues.filter((i) => i.reviewStatus === "ACCEPTED").length,
        modified: state.issues.filter((i) => i.reviewStatus === "MODIFIED").length,
        excluded: state.issues.filter((i) => i.reviewStatus === "EXCLUDED").length,
      },
      reflectedIssueCount: reviewed,
      hasOpinion: state.review.trim().length > 0,
      allReviewed: total > 0 && reviewed === total,
    };
  }, [state.issues, state.review]);

  const actions = useMemo(
    () => ({
      setStatus: (key: string, status: IssueReviewStatus) =>
        dispatch({ type: "SET_STATUS", key, status }),
      editIssue: (key: string, patch: Partial<ReviewIssue>) =>
        dispatch({ type: "EDIT_ISSUE", key, patch }),
      addIssue: (title: string, description: string, impactAmount: number | null) =>
        dispatch({ type: "ADD_ISSUE", title, description, impactAmount }),
      removeIssue: (key: string) => dispatch({ type: "REMOVE_ISSUE", key }),
      setRange: (min: number | null, max: number | null) =>
        dispatch({ type: "SET_RANGE", min, max }),
      setReview: (review: string) => dispatch({ type: "SET_REVIEW", review }),
      reset: () => {
        clearReviewDraft(detail.reportId);
        dispatch({ type: "RESET", detail });
      },
    }),
    [detail],
  );

  return { state, derived, actions, toSubmitBody, draftPrompt };
}
