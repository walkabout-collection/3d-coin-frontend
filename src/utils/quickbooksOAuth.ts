import { startQuickBooksConnect } from "@/src/services/apiServices";

type ConnectResponse = Awaited<ReturnType<typeof startQuickBooksConnect>>;

const pickFirstString = (...values: Array<unknown>): string | null => {
  for (const v of values) {
    if (typeof v === "string" && v.trim().length > 0) return v;
  }
  return null;
};

export const extractQuickBooksAuthUrl = (
  res: ConnectResponse,
): string | null => {
  // Support a few possible backend shapes:
  // - { success: true, data: { authUrl: "https://..." } }
  // - { success: true, data: { authUri: "https://..." } }
  // - { success: true, authUrl: "https://..." }
  // - { success: true, data: { url: "https://..." } }
  // - { success: true, url: "https://..." }
  return pickFirstString(
    res?.data?.authUrl,
    (res as unknown as { data?: { authUri?: unknown } })?.data?.authUri,
    res?.authUrl,
    res?.data?.url,
    res?.url,
    res?.data?.redirectUrl,
    res?.redirectUrl,
  );
};

export async function beginQuickBooksConnect(options?: { returnTo?: string }) {
  // This flag is used by `src/containers/dashboard/index.tsx` to show a success toast
  // once the status endpoint reflects the new connection.
  sessionStorage.setItem("quickbooks_oauth_redirect", "pending");

  const res = await startQuickBooksConnect(
    options?.returnTo ? { returnTo: options.returnTo } : undefined,
  );
  const authUrl = extractQuickBooksAuthUrl(res);

  if (!authUrl) {
    const msg =
      res?.message ||
      "QuickBooks connect did not return an authorization URL. Please try again.";
    throw new Error(msg);
  }

  // Full-page redirect into Intuit OAuth
  window.location.assign(authUrl);
}
