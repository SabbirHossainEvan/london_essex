export function sanitizeInternalRedirect(
  value: string | null | undefined,
  fallback = "/dashboard"
) {
  if (!value) {
    return fallback;
  }

  const trimmedValue = value.trim();

  if (!trimmedValue.startsWith("/")) {
    return fallback;
  }

  if (trimmedValue.startsWith("//")) {
    return fallback;
  }

  return trimmedValue;
}

