import Image from 'next/image';
import Link from 'next/link';

export type HomepageBlogPost = {
  slug: string;
  title: string;
  publishedAt: Date | null;
  focusKeyword: string;
  featuredImage: { url: string; alt: string; width: number | null; height: number | null } | null;
};

const FALLBACK: HomepageBlogPost[] = [
  { slug: '#', title: 'Shipping weekly: the CodeFlee agile playbook.', publishedAt: new Date('2026-04-01'), focusKeyword: 'Engineering', featuredImage: { url: '/assets/c1.webp', alt: '', width: null, height: null } },
  { slug: '#', title: 'Why we kill every feature on Fridays.', publishedAt: new Date('2026-03-01'), focusKeyword: 'Design', featuredImage: { url: '/assets/c2.webp', alt: '', width: null, height: null } },
  { slug: '#', title: 'Hiring senior-only: how our team stays small.', publishedAt: new Date('2026-02-01'), focusKeyword: 'Studio', featuredImage: { url: '/assets/c3.png', alt: '', width: null, height: null } },
];

function monthYear(d: Date | null) {
  if (!d) return '';
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

function postHref(slug: string) {
  return slug === '#' ? '#' : `/blog/${slug}`;
}

function PostImage({ post, sizes }: { post: HomepageBlogPost; sizes: string }) {
  if (!post.featuredImage) return null;
  const fi = post.featuredImage;
  if (fi.width && fi.height) {
    return (
      <Image
        src={fi.url}
        alt={fi.alt || post.title}
        width={fi.width}
        height={fi.height}
        sizes={sizes}
      />
    );
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={fi.url} alt={fi.alt || post.title} />;
}

function FeatureCard({ post }: { post: HomepageBlogPost }) {
  return (
    <Link
      href={postHref(post.slug)}
      className="cf-blog-feature"
      data-cursor="Read"
    >
      <div className="cf-blog-feature-img">
        <PostImage post={post} sizes="(max-width: 980px) 100vw, 720px" />
      </div>
      <div className="cf-blog-feature-body">
        <div className="cf-blog-feature-meta">
          {post.focusKeyword ? <span>{post.focusKeyword}</span> : null}
          {post.focusKeyword && post.publishedAt ? <span aria-hidden>·</span> : null}
          {post.publishedAt ? <span>{monthYear(post.publishedAt)}</span> : null}
        </div>
        <h3 className="cf-blog-feature-title">{post.title}</h3>
        <div className="cf-blog-feature-cta">
          Read the article <span aria-hidden>→</span>
        </div>
      </div>
    </Link>
  );
}

function StackCard({ post }: { post: HomepageBlogPost }) {
  return (
    <Link
      href={postHref(post.slug)}
      className="cf-blog-stack-card"
      data-cursor="Read"
    >
      <div className="cf-blog-stack-card-img">
        <PostImage post={post} sizes="(max-width: 980px) 100vw, 360px" />
      </div>
      <div className="cf-blog-stack-card-body">
        <div className="cf-blog-stack-card-meta">
          {post.focusKeyword ? <span>{post.focusKeyword}</span> : null}
          {post.focusKeyword && post.publishedAt ? <span aria-hidden>·</span> : null}
          {post.publishedAt ? <span>{monthYear(post.publishedAt)}</span> : null}
        </div>
        <h3 className="cf-blog-stack-card-title">{post.title}</h3>
        <div className="cf-blog-stack-card-cta">Read more →</div>
      </div>
    </Link>
  );
}

function EmptyCTA() {
  return (
    <div className="cf-blog-empty">
      <div className="cf-blog-empty-eyebrow">New here?</div>
      <h3 className="cf-blog-empty-title">
        First posts are landing soon — bookmark the blog and we&apos;ll meet you there.
      </h3>
      <Link href="/blog" className="cf-btn-primary" data-cursor="View all">
        Visit the blog <span aria-hidden>→</span>
      </Link>
    </div>
  );
}

export default function Blog({ posts }: { posts?: HomepageBlogPost[] }) {
  // Distinguish three states explicitly:
  //   - `posts` undefined  → DB unreachable / not wired up: show placeholder design preview
  //   - `posts` empty array → DB reachable but zero published: show real empty-state CTA
  //   - `posts` populated  → render the real posts (1/2/3+ shapes all handled below)
  const isPreview = posts === undefined;
  const items = isPreview ? FALLBACK : posts.slice(0, 3);

  return (
    <section className="cf-sec cf-sec-white">
      <div className="cf-wrap">
        <div className="cf-section-head">
          <div className="left">
            <div className="cf-eyebrow">Field notes</div>
            <h2 className="cf-h2">From the <em className="grad">studio journal</em>.</h2>
          </div>
          <div className="right">
            <Link href="/blog" className="cf-btn-ghost" data-cursor="View all">All posts →</Link>
          </div>
        </div>

        {items.length === 0 ? (
          <EmptyCTA />
        ) : items.length === 1 ? (
          <div className="cf-blog-asymmetric cf-blog-asymmetric-solo">
            <FeatureCard post={items[0]} />
          </div>
        ) : (
          <div className="cf-blog-asymmetric">
            <FeatureCard post={items[0]} />
            <div className="cf-blog-stack">
              {items.slice(1, 3).map((p) => (
                <StackCard key={p.slug + p.title} post={p} />
              ))}
            </div>
          </div>
        )}

        <div className="cf-blog-footer-cta">
          <Link href="/blog" className="cf-btn-primary" data-cursor="View all">
            Browse the full blog <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
