export const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") {
    return null;
  }

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(";").shift() ?? null;
  }

  return null;
};

export const setCookie = (
  name: string,
  value: string,
  maxAgeMs?: number,
): void => {
  if (typeof document === "undefined") {
    return;
  }

  const maxAge = maxAgeMs ? `; max-age=${Math.floor(maxAgeMs / 1000)}` : "";
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/${maxAge}`;
};
