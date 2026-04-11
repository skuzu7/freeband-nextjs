// src/lib/useViewTransition.ts
// Typed wrapper around document.startViewTransition() with a no-op fallback.
//
// Features:
// - Feature-detects startViewTransition (Chrome/Edge 111+, Safari 18+)
// - Optional `ready` Promise so callers can delay the transition until an
//   image has decoded — avoids empty-snapshot jank on slow networks
// - Short-circuits to the plain callback on Save-Data connections
// - Returns an object with `withVT(cb, ready?)` — stable identity across renders
"use client";

import { useCallback } from "react";

type WithViewTransition = Document & {
  startViewTransition?: (cb: () => void | Promise<void>) => {
    finished: Promise<void>;
    ready: Promise<void>;
    updateCallbackDone: Promise<void>;
  };
};

type SaveDataConnection = Navigator & {
  connection?: { saveData?: boolean };
};

export function useViewTransition() {
  const withVT = useCallback(
    async (cb: () => void, ready?: Promise<unknown>) => {
      if (typeof document === "undefined") {
        cb();
        return;
      }
      const doc = document as WithViewTransition;
      const nav = navigator as SaveDataConnection;

      // Save-Data: skip transition entirely
      if (nav.connection?.saveData) {
        cb();
        return;
      }

      if (typeof doc.startViewTransition !== "function") {
        cb();
        return;
      }

      // Wait for the ready promise before capturing the snapshot, if provided
      if (ready) {
        try {
          await ready;
        } catch {
          /* fall through — still run the transition */
        }
      }

      doc.startViewTransition(cb);
    },
    [],
  );

  return withVT;
}
