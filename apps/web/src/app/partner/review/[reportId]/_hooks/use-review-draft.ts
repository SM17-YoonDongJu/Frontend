"use client";

import { useEffect, useMemo, useReducer } from "react";
import type {
  ReviewDetail,
  ReviewIssue,
  ReviewIssueStatus,
  ReviewSubmit,
} from "../_model/types";

const DRAFT_PREFIX = "review-draft:";

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
  issues: ReviewIssue[];
  confirmedMinAmount: number | null;
  confirmedMaxAmount: number | null;
  review: string;
}

type ReviewDraftAction =
  | { type: "INIT"; detail: ReviewDetail }
  | { type: "RESET"; detail: ReviewDetail }
  | { type: "SET_STATUS"; id: string; status: ReviewIssueStatus }
  | { type: "EDIT_ISSUE"; id: string; patch: Partial<ReviewIssue> }
  | { type: "ADD_ISSUE"; title: string; description: string; impactAmount: number | null }
  | { type: "REMOVE_ISSUE"; id: string }
  | { type: "SET_RANGE"; min: number | null; max: number | null }
  | { type: "SET_REVIEW"; review: string };

function fromDetail(detail: ReviewDetail): ReviewDraftState {
  return {
    issues: detail.reviewIssues.map((issue) => ({ ...issue })),
    confirmedMinAmount: null,
    confirmedMaxAmount: null,
    review: detail.reviewComment ?? "",
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
    case "SET_STATUS":
      return {
        ...state,
        issues: state.issues.map((issue) =>
          issue.id === action.id ? { ...issue, status: action.status } : issue,
        ),
      };
    case "EDIT_ISSUE":
      return {
        ...state,
        issues: state.issues.map((issue) =>
          issue.id === action.id ? { ...issue, ...action.patch } : issue,
        ),
      };
    case "ADD_ISSUE":
      return {
        ...state,
        issues: [
          ...state.issues,
          {
            id: crypto.randomUUID(),
            title: action.title,
            description: action.description,
            impactAmount: action.impactAmount,
            status: "ACCEPTED",
            modifiedReason: null,
            excludedReason: null,
            adjusterOpinion: null,
            tags: [],
            isNew: true,
          },
        ],
      };
    case "REMOVE_ISSUE":
      return {
        ...state,
        issues: state.issues.filter((issue) => issue.id !== action.id),
      };
    case "SET_RANGE":
      return { ...state, confirmedMinAmount: action.min, confirmedMaxAmount: action.max };
    case "SET_REVIEW":
      return { ...state, review: action.review };
    default:
      return state;
  }
}

export function toSubmitBody(
  state: ReviewDraftState,
  options?: { complete?: boolean },
): ReviewSubmit {
  return {
    reviewIssues: state.issues,
    review: state.review,
    confirmedMinAmount: state.confirmedMinAmount,
    confirmedMaxAmount: state.confirmedMaxAmount,
    ...(options?.complete ? { status: "AWAITING_ADOPTION" } : {}),
  };
}

function initState(detail: ReviewDetail): ReviewDraftState {
  return loadDraft(detail.reportId) ?? fromDetail(detail);
}

export function useReviewDraft(detail: ReviewDetail) {
  const [state, dispatch] = useReducer(reducer, detail, initState);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        window.localStorage.setItem(draftKey(detail.reportId), JSON.stringify(state));
      } catch {
        /* noop */
      }
    }, 500);
    return () => window.clearTimeout(timer);
  }, [state, detail.reportId]);

  const derived = useMemo(() => {
    const reviewed = state.issues.filter((i) => i.status !== "PENDING").length;
    const total = state.issues.length;
    return {
      progress: { reviewed, total },
      counts: {
        accepted: state.issues.filter((i) => i.status === "ACCEPTED").length,
        modified: state.issues.filter((i) => i.status === "MODIFIED").length,
        excluded: state.issues.filter((i) => i.status === "EXCLUDED").length,
      },
      reflectedIssueCount: reviewed,
      hasOpinion: state.review.trim().length > 0,
      allReviewed: total > 0 && reviewed === total,
    };
  }, [state.issues, state.review]);

  const actions = useMemo(
    () => ({
      setStatus: (id: string, status: ReviewIssueStatus) =>
        dispatch({ type: "SET_STATUS", id, status }),
      editIssue: (id: string, patch: Partial<ReviewIssue>) =>
        dispatch({ type: "EDIT_ISSUE", id, patch }),
      addIssue: (title: string, description: string, impactAmount: number | null) =>
        dispatch({ type: "ADD_ISSUE", title, description, impactAmount }),
      removeIssue: (id: string) => dispatch({ type: "REMOVE_ISSUE", id }),
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

  return { state, derived, actions, toSubmitBody };
}
