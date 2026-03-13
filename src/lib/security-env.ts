const DEFAULT_DEV_SECRET = "change-me";

function isProductionRuntime() {
  return process.env.NODE_ENV === "production";
}

export function getNextAuthSecret() {
  const secret = process.env.NEXTAUTH_SECRET?.trim();

  if (!secret || secret === DEFAULT_DEV_SECRET) {
    return isProductionRuntime() ? undefined : DEFAULT_DEV_SECRET;
  }

  return secret;
}

export function getAdminSessionSecret() {
  const secret = process.env.NEXTAUTH_SECRET?.trim();

  if (!secret || secret === DEFAULT_DEV_SECRET) {
    if (isProductionRuntime()) {
      throw new Error("NEXTAUTH_SECRET must be set to a non-default value in production.");
    }

    return DEFAULT_DEV_SECRET;
  }

  return secret;
}

export function getSeedAdminPassword() {
  const password = process.env.ADMIN_PASSWORD?.trim();

  if (!password || password === DEFAULT_DEV_SECRET) {
    if (isProductionRuntime()) {
      throw new Error("ADMIN_PASSWORD must be set to a non-default value before running seed in production.");
    }

    return DEFAULT_DEV_SECRET;
  }

  return password;
}
