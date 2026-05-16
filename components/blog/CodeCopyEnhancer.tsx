"use client";

import { useEffect } from "react";

/**
 * Mounts inside the post page; finds <pre data-copyable> blocks rendered by
 * the server and appends a copy-to-clipboard button. No JSX is rendered.
 */
export function CodeCopyEnhancer({ rootSelector = "article.cf-prose" }: { rootSelector?: string }) {
  useEffect(() => {
    const root = document.querySelector(rootSelector);
    if (!root) return;
    const blocks = Array.from(root.querySelectorAll<HTMLPreElement>("pre[data-copyable]"));
    const cleanups: Array<() => void> = [];

    for (const pre of blocks) {
      if (pre.dataset.enhanced === "1") continue;
      pre.dataset.enhanced = "1";

      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "cf-prose-copy";
      btn.setAttribute("aria-label", "Copy code");
      btn.textContent = "Copy";

      const onClick = async () => {
        const code = pre.querySelector("code");
        const text = (code?.innerText ?? pre.innerText).replace(/\s+$/, "");
        try {
          await navigator.clipboard.writeText(text);
          btn.dataset.state = "copied";
          btn.textContent = "Copied";
          window.setTimeout(() => {
            btn.dataset.state = "";
            btn.textContent = "Copy";
          }, 1800);
        } catch {
          btn.dataset.state = "error";
          btn.textContent = "Press ⌘C";
          window.setTimeout(() => {
            btn.dataset.state = "";
            btn.textContent = "Copy";
          }, 1800);
        }
      };

      btn.addEventListener("click", onClick);
      pre.appendChild(btn);

      cleanups.push(() => {
        btn.removeEventListener("click", onClick);
        btn.remove();
        delete pre.dataset.enhanced;
      });
    }

    return () => {
      for (const fn of cleanups) fn();
    };
  }, [rootSelector]);

  return null;
}
