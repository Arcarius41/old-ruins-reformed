import ArticleCard from "../components/ArticleCard";
import type { PostPreview } from "../components/ArticleCard";
import Hero from "../components/Hero";

const mockPosts: PostPreview[] = [
  {
    title: "Recovering the Reformed Imagination",
    slug: "recovering-the-reformed-imagination",
    categorySlug: "journal-articles",
    categoryLabel: "Journal Articles",
    author: "Joseph",
    publishedAt: "2026-01-02",
    excerpt:
      "A short opening that previews the thesis. This is where Joseph’s voice comes through in a calm, confident way. The card layout should feel inviting and readable.",
    coverColor: "linear-gradient(135deg, rgba(156,199,178,0.75), rgba(20,20,20,0.08))",
  },
  {
    title: "Mid-Week Musings: On Prayer and Attention",
    slug: "mid-week-musings-prayer-and-attention",
    categorySlug: "devotionals",
    categoryLabel: "Devotionals",
    author: "Joseph",
    publishedAt: "2025-12-18",
    excerpt:
      "A devotional reflection that’s short, nourishing, and meant to be revisited. The homepage highlights newest across all categories by default.",
    coverColor: "linear-gradient(135deg, rgba(156,199,178,0.55), rgba(20,20,20,0.05))",
  },
  {
    title: "A Short-form Shelf Entry: Why Creeds Still Matter",
    slug: "why-creeds-still-matter",
    categorySlug: "blogs",
    categoryLabel: "Blogs",
    author: "Joseph",
    publishedAt: "2025-11-28",
    excerpt:
      "A blog-style piece: punchier, shorter, and written for quick reading—still cleanly organized under the category tabs.",
    coverColor: "linear-gradient(135deg, rgba(156,199,178,0.45), rgba(20,20,20,0.04))",
  },
];

export default function Home() {
  return (
    <div>
      {/* HERO (now uses your Hero component + banner image) */}
      <Hero
        kicker="Isaiah 61:4"
        title="The Old Ruins Reformed"
        subtitle="Essays, devotionals, and longer-form writing aimed at rebuilding what’s been neglected—patiently, thoughtfully, and with clarity."
      />

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
          {mockPosts.map((p) => (
            <ArticleCard key={p.slug} post={p} />
          ))}
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
