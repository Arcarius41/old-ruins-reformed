import { Link, useParams } from "react-router-dom";

type MockPost = {
  title: string;
  slug: string;
  categorySlug: string;
  categoryLabel: string;
  author: string;
  publishedAt: string;
  coverColor?: string;
  body: Array<{ type: "p" | "h2"; text: string }>;
};

const mockPosts: MockPost[] = [
  {
    title: "Recovering the Reformed Imagination",
    slug: "recovering-the-reformed-imagination",
    categorySlug: "journal-articles",
    categoryLabel: "Journal Articles",
    author: "Joseph",
    publishedAt: "2026-01-02",
    coverColor: "linear-gradient(135deg, rgba(156,199,178,0.75), rgba(20,20,20,0.08))",
    body: [
      { type: "p", text: "This is placeholder content. Later, this will come from Sanity as rich text." },
      { type: "p", text: "For now, we’re building the layout: readable typography, spacing, and a simple structure." },
      { type: "h2", text: "A Second Heading" },
      { type: "p", text: "More placeholder text to show how a longer article will feel on the page." },
    ],
  },
  {
    title: "Mid-Week Musings: On Prayer and Attention",
    slug: "mid-week-musings-prayer-and-attention",
    categorySlug: "devotionals",
    categoryLabel: "Devotionals",
    author: "Joseph",
    publishedAt: "2025-12-18",
    coverColor: "linear-gradient(135deg, rgba(156,199,178,0.55), rgba(20,20,20,0.05))",
    body: [
      { type: "p", text: "A devotional entry typically reads shorter and calmer. This layout should support both." },
      { type: "p", text: "Later, Joseph will paste his devotional text into the CMS and it will render here." },
    ],
  },
  {
    title: "A Short-form Shelf Entry: Why Creeds Still Matter",
    slug: "why-creeds-still-matter",
    categorySlug: "blogs",
    categoryLabel: "Blogs",
    author: "Joseph",
    publishedAt: "2025-11-28",
    coverColor: "linear-gradient(135deg, rgba(156,199,178,0.45), rgba(20,20,20,0.04))",
    body: [
      { type: "p", text: "Blog entries can be punchier and shorter, but the design should still feel editorial." },
      { type: "p", text: "This is placeholder content until Sanity is connected." },
    ],
  },
];

function formatDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
}

export default function Post() {
  const { slug } = useParams();

  const post = mockPosts.find((p) => p.slug === slug);

  if (!post) {
    return (
      <div className="container" style={{ padding: "34px 16px 54px 16px", maxWidth: 900 }}>
        <h1 style={{ fontFamily: "var(--serif)" }}>Post not found</h1>
        <p className="small-muted">We couldn’t find “{slug}”.</p>
        <div style={{ marginTop: 16 }}>
          <Link to="/articles" className="btn" style={{ textDecoration: "none" }}>
            Back to Articles
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Cover */}
      <section
        style={{
          borderBottom: "1px solid var(--border)",
          background: post.coverColor ?? "linear-gradient(135deg, rgba(156,199,178,0.5), rgba(20,20,20,0.05))",
        }}
      >
        <div className="container" style={{ padding: "34px 16px 24px 16px" }}>
          <div className="small-muted" style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Link
              to={`/category/${post.categorySlug}`}
              style={{ textDecoration: "none", fontWeight: 800, color: "var(--accent-strong)" }}
            >
              {post.categoryLabel}
            </Link>
            <span>• {post.author}</span>
            <span>• {formatDate(post.publishedAt)}</span>
          </div>

          <h1 style={{ marginTop: 10, fontFamily: "var(--serif)", fontSize: 46, maxWidth: 920 }}>
            {post.title}
          </h1>

          <div style={{ marginTop: 18 }}>
            <Link to="/articles" className="btn" style={{ textDecoration: "none" }}>
              ← Back
            </Link>
          </div>
        </div>
      </section>

      {/* Body */}
      <article className="container" style={{ padding: "28px 16px 60px 16px", maxWidth: 900 }}>
        <div className="prose">
          {post.body.map((block, idx) => {
            if (block.type === "h2") return <h2 key={idx}>{block.text}</h2>;
            return <p key={idx}>{block.text}</p>;
          })}
        </div>
      </article>
    </div>
  );
}
