import "server-only";

import { cookies } from "next/headers";
import { DEFAULT_THEME, PREFERRED_THEME_NAME, THEMES } from "../theme.config";

export const getThemeFromCookies = async (): Promise<string> => {
  const cookiesResponse = await cookies();
  const preferredThemeCookie = cookiesResponse.get(PREFERRED_THEME_NAME);

  if (preferredThemeCookie) {
    const preferredTheme = preferredThemeCookie.value;
    const isSupportedTheme = THEMES.includes(preferredTheme);

    return isSupportedTheme ? preferredTheme : DEFAULT_THEME;
  }

  return DEFAULT_THEME;
};
