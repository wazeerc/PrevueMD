const DRAFT_STORAGE_KEY = 'prevue-md:draft';
const DRAFT_TTL_MS = 24 * 60 * 60 * 1000;
const DRAFT_SAVE_DELAY = 1000;
const MAX_DRAFT_LENGTH = 1_000_000;

interface StoredDraft {
  markdown: string;
  savedAt: number;
}

let draftSaveTimeout: ReturnType<typeof setTimeout> | null = null;
let pendingDraftMarkdown: string | null = null;
let pendingDraftCallback: ((saved: boolean) => void) | null = null;

/**
 * Returns whether the markdown is small enough to persist without blocking
 * the main thread or exceeding typical localStorage quotas.
 */
function isDraftCacheable(markdown: string): boolean {
  return markdown.length <= MAX_DRAFT_LENGTH;
}

/**
 * Persists the editor contents to localStorage and refreshes the draft's
 * 24-hour lifetime. Empty or whitespace-only content removes the draft,
 * as does content that exceeds {@link MAX_DRAFT_LENGTH}.
 *
 * @param markdown - The editor contents to cache
 * @returns `true` when the draft was written or removed, `false` when the
 * content is too large or storage is unavailable
 */
function saveDraft(markdown: string): boolean {
  try {
    if (!markdown.trim()) {
      localStorage.removeItem(DRAFT_STORAGE_KEY);
      return true;
    }

    if (!isDraftCacheable(markdown)) {
      localStorage.removeItem(DRAFT_STORAGE_KEY);
      return false;
    }

    const draft: StoredDraft = { markdown, savedAt: Date.now() };
    localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
    return true;
  } catch {
    return false;
  }
}

/**
 * Queues a draft write that runs after the user stops typing. Repeated calls
 * replace the pending draft, so only one write happens per idle period.
 *
 * @param markdown - The latest editor contents
 * @param onSaved - Called with whether the queued draft was persisted
 */
function scheduleSaveDraft(markdown: string, onSaved?: (saved: boolean) => void): void {
  pendingDraftMarkdown = markdown;
  pendingDraftCallback = onSaved ?? null;

  if (draftSaveTimeout !== null) clearTimeout(draftSaveTimeout);
  draftSaveTimeout = setTimeout(flushDraft, DRAFT_SAVE_DELAY);
}

/**
 * Writes the pending draft immediately. Safe to call multiple times and from
 * page lifecycle handlers such as `pagehide`.
 */
function flushDraft(): void {
  if (draftSaveTimeout !== null) {
    clearTimeout(draftSaveTimeout);
    draftSaveTimeout = null;
  }

  if (pendingDraftMarkdown === null) return;

  const markdown = pendingDraftMarkdown;
  const onSaved = pendingDraftCallback;
  pendingDraftMarkdown = null;
  pendingDraftCallback = null;

  const saved = saveDraft(markdown);
  onSaved?.(saved);
}

/**
 * Discards any pending draft write without persisting it.
 */
function cancelDraftSave(): void {
  if (draftSaveTimeout !== null) {
    clearTimeout(draftSaveTimeout);
    draftSaveTimeout = null;
  }

  pendingDraftMarkdown = null;
  pendingDraftCallback = null;
}

/**
 * Reads the cached draft when it is still within its 24-hour lifetime.
 * Expired, malformed, oversized, or empty drafts are removed from storage.
 *
 * @param now - The current timestamp, injectable for testing
 * @returns The cached markdown, or `null` when no usable draft exists
 */
function loadDraft(now: number = Date.now()): string | null {
  try {
    const storedDraft = localStorage.getItem(DRAFT_STORAGE_KEY);
    if (storedDraft === null) return null;

    const parsedDraft: unknown = JSON.parse(storedDraft);
    if (typeof parsedDraft !== 'object' || parsedDraft === null) {
      localStorage.removeItem(DRAFT_STORAGE_KEY);
      return null;
    }

    const { markdown, savedAt } = parsedDraft as Partial<StoredDraft>;
    const isExpired = typeof savedAt !== 'number' || now - savedAt > DRAFT_TTL_MS;
    const isValidMarkdown = typeof markdown === 'string'
      && markdown.trim().length > 0
      && isDraftCacheable(markdown);

    if (isExpired || !isValidMarkdown) {
      localStorage.removeItem(DRAFT_STORAGE_KEY);
      return null;
    }

    return markdown;
  } catch {
    try {
      localStorage.removeItem(DRAFT_STORAGE_KEY);
    } catch {
      // Storage may be unavailable; there is nothing else to clean up.
    }

    return null;
  }
}

/**
 * Removes the cached draft from localStorage.
 */
function clearDraft(): void {
  try {
    localStorage.removeItem(DRAFT_STORAGE_KEY);
  } catch {
    // Storage may be unavailable; there is nothing to clear.
  }
}

export {
  cancelDraftSave,
  clearDraft,
  DRAFT_SAVE_DELAY,
  DRAFT_STORAGE_KEY,
  DRAFT_TTL_MS,
  flushDraft,
  isDraftCacheable,
  loadDraft,
  MAX_DRAFT_LENGTH,
  saveDraft,
  scheduleSaveDraft,
};
