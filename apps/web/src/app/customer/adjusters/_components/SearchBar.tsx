"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { Search } from "@/shared/ui/icons/Search";

interface SearchBarProps {
  keyword: string;
  onSearch: (keyword: string) => void;
}

export function SearchBar({ keyword, onSearch }: SearchBarProps) {
  const [draft, setDraft] = useState(keyword);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSearch(draft.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-start gap-2">
      <Input
        className="flex-1"
        aria-label="손해사정사 검색"
        placeholder="이름 · 전문분야 · 지역 검색"
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        suffix={
          <button
            type="submit"
            aria-label="검색"
            className="flex size-9 items-center justify-center rounded-button text-lg text-ink-3 transition hover:bg-paper hover:text-ink"
          >
            <Search />
          </button>
        }
      />

      <Button type="submit" size="lg" className="hidden shrink-0 md:inline-flex" iconLeft={<Search />}>
        검색
      </Button>
    </form>
  );
}
