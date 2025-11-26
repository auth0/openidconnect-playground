"use server";

import { cookies } from "next/headers";
import { PREFERRED_THEME_NAME, THEMES } from "features/theme/theme.config";

export async function setTheme(theme: string) {
  const isSupportedTheme = THEMES.includes(theme);
  const cookiesResponse = await cookies()

  if (!isSupportedTheme) {
    return;
  }

  const preferredThemeCookie = cookiesResponse.get(PREFERRED_THEME_NAME);

  if (preferredThemeCookie?.value && preferredThemeCookie.value === theme) {
    return;
  }

  cookiesResponse.set(PREFERRED_THEME_NAME, theme, {
    secure: true,
  });
}