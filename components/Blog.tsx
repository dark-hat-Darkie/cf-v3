import Image from 'next/image';
import Link from 'next/link';
import { DEMO_POSTS } from '@/lib/demo-content';
import { ArrowIcon } from './site/icons';

export type HomepageBlogPost = {
  slug: string;
  title: string;
  publishedAt: Date | null;
  focusKeyword: string;
  featuredImage: { url: string; alt: string; width: number | null; height: number | null } | null;
};

function monthYear(d: Date | null) {
  if (!d) return '';
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

/** Homepage journal strip. Renders nothing until there is at least one published post. */
export default function Blog({ posts }: { posts: HomepageBlogPost[] }) {
  const items = posts.slice(0, 3);
  // Fill the row with demo cards until three real posts exist.
  const demo = DEMO_POSTS.slice(0, 3 - items.length);

  return (
    <section className="cf-section cf-sf-paper" id="journal">
      <div className="cf-container">
        <div className="cf-head">
          <div>
            <span className="cf-eyebrow">Field notes</span>
            <h2 className="cf-h2">From the <span className="cf-dim">studio journal.</span></h2>
          </div>
          <div className="cf-head-aside">
            <Link href="/blog" className="cf-link">
              All posts <ArrowIcon size={13} className="" />
            </Link>
          </div>
        </div>
        <div className="cf-posts">
          {items.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="cf-post-card" data-rise="">
              <span className="cf-media">
                {post.featuredImage && (
                  <Image
                    src={post.featuredImage.url}
                    alt={post.featuredImage.alt || ''}
                    fill
                    sizes="(max-width: 760px) 100vw, 400px"
                  />
                )}
              </span>
              <span className="cf-post-card-text">
              <span className="cf-post-card-meta">
                {[post.focusKeyword, monthYear(post.publishedAt)].filter(Boolean).join(' · ')}
              </span>
              <span className="cf-post-card-title cf-h3">{post.title}</span>
              </span>
            </Link>
          ))}
          {demo.map((d, i) => (
            <Link key={d.title} href="/blog" className="cf-post-card" data-rise="">
              <span className={`cf-media cf-post-card-demo cf-post-card-demo--${i + 1}`} aria-hidden="true" />
              <span className="cf-post-card-text">
                <span className="cf-post-card-meta">{d.tag} · {d.date}</span>
                <span className="cf-post-card-title cf-h3">{d.title}</span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
