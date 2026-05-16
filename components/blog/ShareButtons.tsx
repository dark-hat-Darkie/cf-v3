"use client";

import { useState, useSyncExternalStore } from "react";

type Props = {
  url: string;
  title: string;
  variant?: "inline" | "rail";
};

const noopSubscribe = () => () => {};
const getCanShare = () => typeof navigator !== "undefined" && typeof navigator.share === "function";
const getCanShareSSR = () => false;

export function ShareButtons({ url, title, variant = "inline" }: Props) {
  const [copied, setCopied] = useState(false);
  const canShare = useSyncExternalStore(noopSubscribe, getCanShare, getCanShareSSR);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked — silent */
    }
  };

  const onNativeShare = async () => {
    try {
      await navigator.share({ title, url });
    } catch {
      /* user cancelled — silent */
    }
  };

  const twitter = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
  const linkedIn = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;

  return (
    <div className="cf-share" data-variant={variant}>
      <span className="cf-share-label" aria-hidden>
        Share
      </span>
      <a
        className="cf-share-btn"
        href={twitter}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on Twitter"
        data-icon="twitter"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
        <span className="cf-share-text">Twitter</span>
      </a>
      <a
        className="cf-share-btn"
        href={linkedIn}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on LinkedIn"
        data-icon="linkedin"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M4.98 3.5a2.5 2.5 0 11.02 5 2.5 2.5 0 01-.02-5zM3 8.98h4V21H3zM9 8.98h3.8v1.64h.05c.53-1 1.82-2.06 3.75-2.06 4.01 0 4.75 2.64 4.75 6.07V21h-4v-5.46c0-1.3-.02-2.97-1.81-2.97-1.81 0-2.09 1.41-2.09 2.87V21H9z" />
        </svg>
        <span className="cf-share-text">LinkedIn</span>
      </a>
      <button
        type="button"
        className="cf-share-btn"
        onClick={onCopy}
        aria-label="Copy link to article"
        data-icon="copy"
        data-state={copied ? "copied" : undefined}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          {copied ? (
            <polyline points="20 6 9 17 4 12" />
          ) : (
            <>
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
            </>
          )}
        </svg>
        <span className="cf-share-text">{copied ? "Copied" : "Copy link"}</span>
      </button>
      {canShare ? (
        <button
          type="button"
          className="cf-share-btn"
          onClick={onNativeShare}
          aria-label="Share via system sheet"
          data-icon="share"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
          </svg>
          <span className="cf-share-text">Share</span>
        </button>
      ) : null}
    </div>
  );
}
