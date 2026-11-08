import {
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
} from '@/utils/draft-storage';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('draft storage', () => {
  beforeEach(() => {
    localStorage.clear();
    cancelDraftSave();
  });

  it('should save markdown with a timestamp', () => {
    const beforeSave = Date.now();

    expect(saveDraft('# Draft')).toBe(true);

    const storedDraft = JSON.parse(localStorage.getItem(DRAFT_STORAGE_KEY) as string);
    expect(storedDraft.markdown).toBe('# Draft');
    expect(storedDraft.savedAt).toBeGreaterThanOrEqual(beforeSave);
  });

  it('should load a draft saved within the last day', () => {
    localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify({
      markdown: '# Fresh',
      savedAt: Date.now(),
    }));

    expect(loadDraft()).toBe('# Fresh');
  });

  it('should discard and remove a draft older than one day', () => {
    const now = Date.now();
    localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify({
      markdown: '# Expired',
      savedAt: now - DRAFT_TTL_MS - 1,
    }));

    expect(loadDraft(now)).toBeNull();
    expect(localStorage.getItem(DRAFT_STORAGE_KEY)).toBeNull();
  });

  it('should keep a draft exactly one day old', () => {
    const now = Date.now();
    localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify({
      markdown: '# Boundary',
      savedAt: now - DRAFT_TTL_MS,
    }));

    expect(loadDraft(now)).toBe('# Boundary');
  });

  it('should remove malformed drafts', () => {
    localStorage.setItem(DRAFT_STORAGE_KEY, '{"markdown":');

    expect(loadDraft()).toBeNull();
    expect(localStorage.getItem(DRAFT_STORAGE_KEY)).toBeNull();
  });

  it('should remove drafts with invalid data', () => {
    localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify({ markdown: 42, savedAt: 'never' }));

    expect(loadDraft()).toBeNull();
    expect(localStorage.getItem(DRAFT_STORAGE_KEY)).toBeNull();
  });

  it('should not cache empty or whitespace-only content', () => {
    localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify({
      markdown: '# Existing',
      savedAt: Date.now(),
    }));

    expect(saveDraft('   ')).toBe(true);
    expect(localStorage.getItem(DRAFT_STORAGE_KEY)).toBeNull();
  });

  it('should ignore an empty stored draft', () => {
    localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify({
      markdown: '   ',
      savedAt: Date.now(),
    }));

    expect(loadDraft()).toBeNull();
    expect(localStorage.getItem(DRAFT_STORAGE_KEY)).toBeNull();
  });

  it('should clear the cached draft', () => {
    saveDraft('# Draft');

    clearDraft();

    expect(localStorage.getItem(DRAFT_STORAGE_KEY)).toBeNull();
  });

  it('should not cache drafts larger than the limit', () => {
    localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify({
      markdown: '# Existing',
      savedAt: Date.now(),
    }));
    const oversizedMarkdown = 'x'.repeat(MAX_DRAFT_LENGTH + 1);

    expect(isDraftCacheable(oversizedMarkdown)).toBe(false);
    expect(saveDraft(oversizedMarkdown)).toBe(false);
    expect(localStorage.getItem(DRAFT_STORAGE_KEY)).toBeNull();
  });

  it('should cache drafts exactly at the size limit', () => {
    const markdown = 'x'.repeat(MAX_DRAFT_LENGTH);

    expect(isDraftCacheable(markdown)).toBe(true);
    expect(saveDraft(markdown)).toBe(true);
    expect(loadDraft()).toBe(markdown);
  });

  it('should discard an oversized stored draft', () => {
    localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify({
      markdown: 'x'.repeat(MAX_DRAFT_LENGTH + 1),
      savedAt: Date.now(),
    }));

    expect(loadDraft()).toBeNull();
    expect(localStorage.getItem(DRAFT_STORAGE_KEY)).toBeNull();
  });
});

describe('scheduled draft saves', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    localStorage.clear();
    cancelDraftSave();
  });

  afterEach(() => {
    cancelDraftSave();
    vi.useRealTimers();
  });

  it('should defer the write until the user stops typing', () => {
    const onSaved = vi.fn();

    scheduleSaveDraft('# Draft', onSaved);

    expect(localStorage.getItem(DRAFT_STORAGE_KEY)).toBeNull();

    vi.advanceTimersByTime(DRAFT_SAVE_DELAY - 1);
    expect(localStorage.getItem(DRAFT_STORAGE_KEY)).toBeNull();

    vi.advanceTimersByTime(1);

    expect(loadDraft()).toBe('# Draft');
    expect(onSaved).toHaveBeenCalledWith(true);
  });

  it('should replace the pending write after rapid edits', () => {
    scheduleSaveDraft('# First');
    vi.advanceTimersByTime(DRAFT_SAVE_DELAY / 2);

    scheduleSaveDraft('# Second');
    vi.advanceTimersByTime(DRAFT_SAVE_DELAY);

    expect(loadDraft()).toBe('# Second');
  });

  it('should flush the pending write immediately', () => {
    scheduleSaveDraft('# Draft');

    flushDraft();

    expect(loadDraft()).toBe('# Draft');
  });

  it('should cancel a pending write', () => {
    scheduleSaveDraft('# Draft');

    cancelDraftSave();
    vi.advanceTimersByTime(DRAFT_SAVE_DELAY);

    expect(localStorage.getItem(DRAFT_STORAGE_KEY)).toBeNull();
  });

  it('should report when a pending draft cannot be cached', () => {
    const onSaved = vi.fn();

    scheduleSaveDraft('x'.repeat(MAX_DRAFT_LENGTH + 1), onSaved);
    vi.advanceTimersByTime(DRAFT_SAVE_DELAY);

    expect(onSaved).toHaveBeenCalledWith(false);
    expect(localStorage.getItem(DRAFT_STORAGE_KEY)).toBeNull();
  });
});
