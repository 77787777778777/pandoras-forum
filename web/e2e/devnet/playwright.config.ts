// SPDX-License-Identifier: AGPL-3.0-or-later
// End-to-end tests of the SPA on the real wasm engine against the local devnet (ADR 0006):
// `pnpm --filter @pandoras-forum/web e2e:devnet` builds the e2e bundle (`VITE_E2E=1`, into
// web/dist-e2e) and runs these. The global setup starts `packages/e2e/devnet.mjs` (PLC + PDS,
// alice/bob/carol), seeds a forum through the PDS API and serves dist-e2e with the §6.2
// development CSP (Trusted Types enforced). Uses the preinstalled Chromium
// (PLAYWRIGHT_BROWSERS_PATH, never `playwright install`).
//
// `PANDORAS_FORUM_DEVNET_JSON=<file>` reuses a running devnet (the JSON devnet.mjs wrote);
// `PANDORAS_FORUM_BIN=<path>` names the `pandoras-forum` binary of the bridge test and the parity
// scenario (default target/debug/pandoras-forum; the bridge test needs one that embeds an e2e build,
// see bridge.spec.ts); `PANDORAS_FORUM_TUI_DRIVER=<path>` the TUI driver of the parity scenario
// (scenario.spec.ts; default target/debug/examples/parity_driver). `cargo xtask e2e --web`
// builds everything and runs this suite (packages/e2e/README.md).

import { fileURLToPath } from "node:url";
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: ".",
  testMatch: /.*\.spec\.ts$/,
  globalSetup: fileURLToPath(new URL("./global-setup.ts", import.meta.url)),
  fullyParallel: false,
  workers: 1,
  timeout: 120_000,
  expect: { timeout: 20_000 },
  reporter: [["list"]],
  outputDir: fileURLToPath(new URL("../../../test-results/web-e2e-devnet", import.meta.url)),
  use: {
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1400, height: 1000 } },
    },
  ],
});
