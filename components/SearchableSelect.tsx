"use client";

import { useEffect, useId, useRef, useState } from "react";

export type SelectOption = { value: string; label: string };

type SearchableSelectProps = {
  id?: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  stepLabel?: string;
  emptyMessage?: string;
  compact?: boolean;
};

export function SearchableSelect({
  id: idProp,
  label,
  value,
  onChange,
  options,
  placeholder = "Search…",
  disabled = false,
  stepLabel,
  emptyMessage = "No matches",
  compact = false,
}: SearchableSelectProps) {
  const autoId = useId();
  const id = idProp ?? autoId;
  const listboxId = `${id}-listbox`;
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedLabel = options.find((o) => o.value === value)?.label ?? value;

  const filtered = query.trim()
    ? options.filter(
        (o) =>
          o.label.toLowerCase().includes(query.toLowerCase()) ||
          o.value.toLowerCase().includes(query.toLowerCase())
      )
    : options;

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  useEffect(() => {
    if (open) {
      setQuery("");
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  const select = (next: string) => {
    onChange(next);
    setOpen(false);
    setQuery("");
  };

  return (
    <div ref={containerRef} className="relative">
      {!compact && (
        <div className="mb-2 flex items-baseline gap-2">
          {stepLabel && (
            <span className="text-xs font-medium uppercase tracking-widest text-gold">{stepLabel}</span>
          )}
          <label htmlFor={`${id}-trigger`} className="text-xs uppercase tracking-widest text-stone">
            {label}
          </label>
        </div>
      )}

      {compact && (
        <label htmlFor={`${id}-trigger`} className="sr-only">
          {label}
        </label>
      )}

      <button
        id={`${id}-trigger`}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-label={compact ? label : undefined}
        onClick={() => !disabled && setOpen((v) => !v)}
        className={`flex w-full items-center justify-between rounded-lg border bg-white text-left text-sm text-charcoal transition focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold disabled:cursor-not-allowed disabled:bg-stone/5 disabled:text-stone/60 ${
          compact ? "min-h-[40px] px-3 py-2" : "min-h-[48px] rounded-xl px-4 py-3"
        } ${open ? "border-gold ring-1 ring-gold" : "border-stone/20"}`}
      >
        <span className={value ? "text-charcoal" : "text-stone"}>{selectedLabel || placeholder}</span>
        <svg
          className={`h-4 w-4 shrink-0 text-stone transition ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div
          className="absolute z-30 mt-1 w-full overflow-hidden rounded-xl border border-stone/20 bg-white shadow-lg"
          role="presentation"
        >
          <div className="border-b border-stone/10 p-2">
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={placeholder}
              aria-label={`Search ${label.toLowerCase()}`}
              className="w-full rounded-lg border border-stone/20 px-3 py-2.5 text-sm text-charcoal focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
            />
          </div>
          <ul
            id={listboxId}
            role="listbox"
            aria-label={label}
            className="max-h-56 overflow-y-auto py-1"
          >
            {filtered.length === 0 ? (
              <li className="px-4 py-3 text-sm text-stone">{emptyMessage}</li>
            ) : (
              filtered.map((option) => (
                <li key={option.value} role="option" aria-selected={option.value === value}>
                  <button
                    type="button"
                    onClick={() => select(option.value)}
                    className={`flex min-h-[44px] w-full items-center px-4 py-2.5 text-left text-sm transition hover:bg-gold/10 ${
                      option.value === value ? "bg-gold/15 font-medium text-charcoal" : "text-charcoal"
                    }`}
                  >
                    {option.label}
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
