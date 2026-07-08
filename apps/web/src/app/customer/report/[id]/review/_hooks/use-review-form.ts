"use client";

import { useMemo, useState } from "react";

export const MAX_REVIEW_CONTENT_LENGTH = 1000;

export function useReviewForm() {
  const [score, setScore] = useState(0);
  const [content, setContent] = useState("");

  const isSubmittable = useMemo(() => score >= 1 && score <= 5, [score]);

  return { score, setScore, content, setContent, isSubmittable };
}
