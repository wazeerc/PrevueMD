import { describe, expect, it } from 'vitest';
import { IconLibrary } from './icons';

describe('IconLibrary', () => {
  const defaultColor = '#262626';
  const disabledColor = '#404040';
  const defaultWidthStr = 'width="18"';
  const defaultHeightStr = 'height="18"';

  it('should return modified SVG string with correct size and color for md primary default', () => {
    const result = IconLibrary('github', 'md', 'primary', 'default');

    expect(result).toContain(defaultWidthStr);
    expect(result).toContain(defaultHeightStr);
    expect(result).toContain(`fill="${defaultColor}"`);
  });

  it('should return modified SVG string with correct size and color for lg secondary disabled', () => {
    const result = IconLibrary('github', 'lg', 'secondary', 'disabled');

    expect(result).toContain('width="28"');
    expect(result).toContain('height="28"');
    expect(result).toContain(`fill="${disabledColor}"`);
  });

  it('should throw error for non-existent icon', () => {
    expect(() =>
      IconLibrary('nonexistent', 'md', 'primary', 'default')
    ).toThrow('Icon nonexistent not found');
  });

  it('should correctly replace all color and size attributes', () => {
    const result = IconLibrary('download', 'md', 'primary', 'default');
    const colorMatches = result.match(new RegExp(`fill="${defaultColor}"`, 'g'));

    expect(colorMatches!.length).toBe(2);
    expect(result).toContain(defaultWidthStr);
    expect(result).toContain(defaultHeightStr);
  });
});
