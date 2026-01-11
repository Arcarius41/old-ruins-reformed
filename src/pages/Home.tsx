import { useEffect, useMemo, useState } from "react";
import ArticleCard from "../components/ArticleCard";
import type { PostPreview } from "../components/ArticleCard";
import { sanityClient } from "../lib/sanity";
import Hero from "../components/Hero";

type SanityPost = {
  title: string;
  slug: string;
  publishedAt?: string;
  excerpt?: string;
  categorySlug?: string;
  categoryLabel?: string;
  imageUrl?: string;
  author?: string;
};

const FALLBACKS: Record<string, string> = {
  "journal-articles":
    "linear-gradient(135deg, rgba(156,199,178,0.75), rgba(20,20,20,0.08))",
  devotionals:
    "linear-gradient(135deg, rgba(156,199,178,0.55), rgba(20,20,20,0.05))",
  blogs: "linear-gradient(135deg, rgba(156,199,178,0.45), rgba(20,20,20,0.04))",
  reviews:
    "linear-gradient(135deg, rgba(156,199,178,0.40), rgba(20,20,20,0.06))",
  resources:
    "linear-gradient(135deg, rgba(156,199,178,0.35), rgba(20,20,20,0.05))",
};

const QUERY = /* groq */ `
*[_type == "post"] | order(publishedAt desc)[0...6]{
  title,
  "slug": slug.current,
  publishedAt,
  excerpt,
  author,
  "categorySlug": category->slug.current,
  "categoryLabel": category->title,
  "imageUrl": heroImage.asset->url
}
`;

export default function Home() {
  const [posts, setPosts] = useState<PostPreview[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fallbackCover = useMemo(() => {
    return (categorySlug?: string) =>
      FALLBACKS[categorySlug || ""] ||
      "linear-gradient(135deg, rgba(156,199,178,0.45), rgba(20,20,20,0.04))";
  }, []);

  useEffect(() => {
    let alive = true;

    async function run() {
      try {
        setError(null);
        setLoading(true);

        const data = await sanityClient.fetch<SanityPost[]>(QUERY);

        const mapped: PostPreview[] = data.map((p) => ({
          title: p.title,
          slug: p.slug,
          categorySlug: p.categorySlug || "",
          categoryLabel: p.categoryLabel || "Uncategorized",
          author: p.author || "Joseph",
          publishedAt: (p.publishedAt || "").slice(0, 10),
          excerpt: p.excerpt || "",
          coverColor: p.imageUrl
            ? `url(${p.imageUrl}) center/cover no-repeat`
            : fallbackCover(p.categorySlug),
        }));

        if (alive) setPosts(mapped);
      } catch (err) {
        console.error("Failed to load posts from Sanity:", err);
        if (alive) {
          setError(err instanceof Error ? err.message : String(err));
          setPosts([]);
        }
      } finally {
        if (alive) setLoading(false);
      }
    }

    run();

    return () => {
      alive = false;
    };
  }, [fallbackCover]);

  const featured = posts.slice(0, 2);
  const rest = posts.slice(2);

  return (
    <div>
      {/* HERO */}
      <Hero
        kicker="Isaiah 61:4"
        title="The Old Ruins Reformed"
        subtitle="Essays, devotionals, and longer-form writing aimed at rebuilding what’s been neglected—patiently, thoughtfully, and with clarity."
      />

      {/* Quick actions under hero */}
      <div
        style={{
          borderBottom: "1px solid var(--border)",
          background:
            "radial-gradient(1200px 500px at 20% 10%, rgba(156,199,178,0.22), rgba(251,251,250,0.0))",
        }}
      >
        <div className="container" style={{ padding: "18px 16px 22px 16px" }}>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <a className="btn btn-primary" href="#latest" style={{ textDecoration: "none" }}>
              Read the latest
            </a>
            <a className="btn" href="/articles" style={{ textDecoration: "none" }}>
              Browse all
            </a>
          </div>
        </div>
      </div>

      {/* LATEST */}
      <section id="latest" className="container" style={{ padding: "34px 16px 24px 16px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <h2 style={{ fontFamily: "var(--serif)", fontSize: 30 }}>Latest</h2>
          <a href="/articles" className="small-muted" style={{ textDecoration: "none" }}>
            View all →
          </a>
        </div>

        <div style={{ marginTop: 18 }}>
          {loading ? (
            <div className="small-muted">Loading posts…</div>
          ) : error ? (
            <div className="small-muted" style={{ whiteSpace: "pre-wrap" }}>
              Sanity error: {error}
            </div>
          ) : posts.length === 0 ? (
            <div className="small-muted">No posts found yet. (Publish one in Sanity Studio.)</div>
          ) : (
            <>
              {/* Featured row */}
              <div className="home-featured">
                {featured.map((p) => (
                  <div className="home-featured__item" key={p.slug}>
                    <ArticleCard post={p} />
                  </div>
                ))}
              </div>

              {/* Remaining posts */}
              {rest.length > 0 ? (
                <div className="home-latest-list">
                  {rest.map((p) => (
                    <ArticleCard key={p.slug} post={p} />
                  ))}
                </div>
              ) : null}
            </>
          )}
        </div>
      </section>

      {/* SUBSCRIBE */}
      <section className="container" style={{ padding: "10px 16px 54px 16px" }}>
        <div className="card subscribe-card">
          <h2 style={{ fontFamily: "var(--serif)", fontSize: 26 }}>Subscribe</h2>
          <p style={{ marginTop: 8, color: "var(--muted)", maxWidth: 720 }}>
            Get new posts by email. (We’ll connect this to EmailOctopus once Joseph’s account is set up.)
          </p>

          <form className="subscribe-form" style={{ marginTop: 14 }}>
            <input
              type="email"
              placeholder="Email address"
              className="subscribe-input"
            />
            <button type="button" className="btn btn-primary subscribe-button">
              Subscribe
            </button>
          </form>

          <p className="small-muted" style={{ marginTop: 10 }}>
            No spam. Unsubscribe anytime.
          </p>
        </div>
      </section>
    </div>
  );
}
