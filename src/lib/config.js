export const SERVER_API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";
export const API_BASE_URL =
  typeof window !== "undefined" && SERVER_API_BASE_URL ? "/api/proxy" : SERVER_API_BASE_URL;
export const APP_BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
export const USE_MOCK = !SERVER_API_BASE_URL;

export function getApiOrigin() {
  if (!SERVER_API_BASE_URL) return "";
  try {
    return new URL(SERVER_API_BASE_URL).origin;
  } catch {
    return "";
  }
}
