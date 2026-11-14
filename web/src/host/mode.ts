// SPDX-License-Identifier: AGPL-3.0-or-later
// Which host serves this copy of the SPA (synthesis §6.13): `pandoras-forum-config.json` next to
// `index.html` says `{"oauth": "hosted"}` on the static site (the file ships in the build) and
// `{"oauth": "bridge"}` when `pandoras-forum web` serves it (the bridge answers that path itself,
// threat-model WEB-5). Anything unreadable means hosted: the bridge always answers.

export type HostMode = "hosted" | "bridge";

/** Parses the body of `pandoras-forum-config.json`. */
export function parseHostConfig(text: string): HostMode {
  try {
    const v = JSON.parse(text) as { oauth?: unknown };
    return v.oauth === "bridge" ? "bridge" : "hosted";
  } catch {
    return "hosted";
  }
}

/** Fetches `pandoras-forum-config.json` from the page's own origin and directory. */
export async function loadHostMode(
  base: string = document.baseURI,
  fetchFn: typeof fetch = globalThis.fetch.bind(globalThis),
): Promise<HostMode> {
  try {
    const resp = await fetchFn(new URL("pandoras-forum-config.json", base).href, {
      cache: "no-cache",
      credentials: "omit",
      redirect: "error",
    });
    if (!resp.ok) return "hosted";
    return parseHostConfig(await resp.text());
  } catch {
    return "hosted";
  }
}
