export type Icons = keyof typeof icons;
export type IconSize = 'md' | 'lg';
export type IconVariant = 'primary' | 'secondary';
export type IconState = 'default' | 'disabled';
type SVGString = `<svg ${string}</svg>`;
type HexCode = `#${string}`;

const ICON_SIZES: Record<string, number> = {
  md: 18,
  lg: 28
} as const;

const VARIANT_COLORS: Record<IconVariant, Record<IconState, HexCode>> = {
  primary: {
    default: '#262626',
    disabled: '#a3a3a3'
  },
  secondary: {
    default: '#a3a3a3',
    disabled: '#404040'
  }
} as const;

/**
 * Returns an SVG string representation of the specified icon with updated size and variant attributes.
 *
 * @param iconName - The name of the icon to retrieve from the icon library
 * @param size - The desired size of the icon
 * @param variant - The visual variant/style of the icon
 * @returns An SVG string with updated attributes
 * @throws Error if the specified icon name is not found in the library
 */
export function IconLibrary(
  iconName: Icons,
  size: IconSize,
  variant: IconVariant,
  state: IconState
): SVGString {
  const selectedIcon = icons[iconName];
  if (!selectedIcon) throw new Error(`Icon ${iconName} not found`);

  return updateIconAttributes(selectedIcon, size, variant, state);
}

/**
 * Updates SVG icon attributes with specified size and color variant
 * @param icon - The SVG icon string to modify
 * @param size - Size variant from IconSize enum to apply to width/height
 * @param variant - Color variant from IconVariant enum to apply to fill color
 * @returns Modified SVG string with updated attributes
 */
function updateIconAttributes(icon: string, size: IconSize, variant: IconVariant, state: IconState): SVGString {
  const sizeStr = ICON_SIZES[size].toString();
  const color = VARIANT_COLORS[variant][state];

  return icon
    .replace(/fill="#000000"/g, `fill="${color}"`)
    .replace(/width="16"|height="16"/g, `width="${sizeStr}" height="${sizeStr}"`) as SVGString;
}

//? To add a new icon, add a new key-value pair to the icons object
//? the key is the name of the icon, and the value is the svg string
//? From https://primer.style/foundations/icons
const icons: Record<string, SVGString> = {
  github: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16"><path fill="#000000" d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"></path></svg>',

  clipboard: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16"><path fill="#000000" d="M3.626 3.533a.249.249 0 0 0-.126.217v9.5c0 .138.112.25.25.25h8.5a.25.25 0 0 0 .25-.25v-9.5a.249.249 0 0 0-.126-.217.75.75 0 0 1 .752-1.298c.541.313.874.89.874 1.515v9.5A1.75 1.75 0 0 1 12.25 15h-8.5A1.75 1.75 0 0 1 2 13.25v-9.5c0-.625.333-1.202.874-1.515a.75.75 0 0 1 .752 1.298ZM5.75 1h4.5a.75.75 0 0 1 .75.75v3a.75.75 0 0 1-.75.75h-4.5A.75.75 0 0 1 5 4.75v-3A.75.75 0 0 1 5.75 1Zm.75 3h3V2.5h-3Z"></path></svg>',

  download: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16"><path fill="#000000" d="M2.75 14A1.75 1.75 0 0 1 1 12.25v-2.5a.75.75 0 0 1 1.5 0v2.5c0 .138.112.25.25.25h10.5a.25.25 0 0 0 .25-.25v-2.5a.75.75 0 0 1 1.5 0v2.5A1.75 1.75 0 0 1 13.25 14Z"></path><path fill="#000000" d="M7.25 7.689V2a.75.75 0 0 1 1.5 0v5.689l1.97-1.969a.749.749 0 1 1 1.06 1.06l-3.25 3.25a.749.749 0 0 1-1.06 0L4.22 6.78a.749.749 0 1 1 1.06-1.06l1.97 1.969Z"></path></svg>',

  reset: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16"><path fill="#000000" d="M1.705 8.005a.75.75 0 0 1 .834.656 5.5 5.5 0 0 0 9.592 2.97l-1.204-1.204a.25.25 0 0 1 .177-.427h3.646a.25.25 0 0 1 .25.25v3.646a.25.25 0 0 1-.427.177l-1.38-1.38A7.002 7.002 0 0 1 1.05 8.84a.75.75 0 0 1 .656-.834ZM8 2.5a5.487 5.487 0 0 0-4.131 1.869l1.204 1.204A.25.25 0 0 1 4.896 6H1.25A.25.25 0 0 1 1 5.75V2.104a.25.25 0 0 1 .427-.177l1.38 1.38A7.002 7.002 0 0 1 14.95 7.16a.75.75 0 0 1-1.49.178A5.5 5.5 0 0 0 8 2.5Z"></path></svg>',
  
  app: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16"><path fill="#000000" d="M4.75 3h6.5a.75.75 0 0 1 0 1.5h-6.5a.75.75 0 0 1 0-1.5ZM3 7.75A.75.75 0 0 1 3.75 7h8.5a.75.75 0 0 1 0 1.5h-8.5A.75.75 0 0 1 3 7.75Zm1.75 4a.75.75 0 0 1 0-1.5h6.5a.75.75 0 0 1 0 1.5h-6.5Z"></path><path fill="#000000" d="M0 1.75C0 .784.784 0 1.75 0h12.5C15.216 0 16 .784 16 1.75v12.5A1.75 1.75 0 0 1 14.25 16H1.75A1.75 1.75 0 0 1 0 14.25Zm1.75-.25a.25.25 0 0 0-.25.25v12.5c0 .138.112.25.25.25h12.5a.25.25 0 0 0 .25-.25V1.75a.25.25 0 0 0-.25-.25Z"></path></svg>'
} as const;
