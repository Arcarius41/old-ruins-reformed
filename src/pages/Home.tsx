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
          author: "Joseph",
          publishedAt: (p.publishedAt || "").slice(0, 10),
          excerpt: p.excerpt || "",
          // ArticleCard uses this as a background value; we can pass either a gradient or a url(...) background
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

  return (
    <div>
      {/* HERO */}
      <Hero
        kicker="Isaiah 61:4"
        title="The Old Ruins Reformed"
        subtitle="Essays, devotionals, and longer-form writing aimed at rebuilding what’s been neglected—patiently, thoughtfully, and with clarity."
      />

      {/* Quick actions under hero (keeps your original CTA buttons) */}
      <section
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
      </section>

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

        <div style={{ marginTop: 18, display: "grid", gap: 16 }}>
          {loading ? (
            <div className="small-muted">Loading posts…</div>
          ) : error ? (
            <div className="small-muted" style={{ whiteSpace: "pre-wrap" }}>
              Sanity error: {error}
            </div>
          ) : posts.length === 0 ? (
            <div className="small-muted">No posts found yet. (Publish one in Sanity Studio.)</div>
          ) : (
            posts.map((p) => <ArticleCard key={p.slug} post={p} />)
          )}
        </div>
      </section>

      {/* SUBSCRIBE */}
      <section className="container" style={{ padding: "10px 16px 54px 16px" }}>
        <div className="card" style={{ padding: 22 }}>
          <h2 style={{ fontFamily: "var(--serif)", fontSize: 26 }}>Subscribe</h2>
          <p style={{ marginTop: 8, color: "var(--muted)", maxWidth: 720 }}>
            Get new posts by email. (We’ll wire this to Brevo once the CMS is connected.)
          </p>

          <form style={{ marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap" }}>
            <input
              type="email"
              placeholder="Email address"
              style={{
                padding: "12px 14px",
                borderRadius: 14,
                border: "1px solid rgba(20,20,20,0.18)",
                minWidth: 280,
                flex: "1 1 280px",
                background: "white",
              }}
            />
            <button type="button" className="btn btn-primary">
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
