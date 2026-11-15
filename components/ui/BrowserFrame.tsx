import Image from 'next/image';

type Props = {
  src: string;
  alt: string;
  /** Address shown in the fake URL bar. */
  url?: string;
  blurDataURL?: string;
  sizes: string;
  /** Load immediately (above the fold). */
  eager?: boolean;
  preload?: boolean;
  className?: string;
};

/** A screenshot inside a minimal browser window. */
export default function BrowserFrame({ src, alt, url, blurDataURL, sizes, eager = false, preload = false, className = '' }: Props) {
  return (
    <span className={`cf-frame ${className}`}>
      <span className="cf-frame-bar" aria-hidden="true">
        <i /><i /><i />
        {url && <span className="cf-frame-url">{url}</span>}
      </span>
      <span className="cf-frame-shot">
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          placeholder={blurDataURL ? 'blur' : 'empty'}
          blurDataURL={blurDataURL || undefined}
          preload={preload}
          loading={preload ? undefined : eager ? 'eager' : 'lazy'}
        />
      </span>
    </span>
  );
}

/** "https://factwatch.org/" → "factwatch.org" */
export function displayUrl(url: string | undefined, fallback: string) {
  if (!url) return fallback;
  return url.replace(/^https?:\/\//, '').replace(/\/$/, '');
}
