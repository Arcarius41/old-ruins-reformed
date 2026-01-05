import { Link, useParams } from "react-router-dom";
import ArticleCard from "../components/ArticleCard";
import type { PostPreview } from "../components/ArticleCard";

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

const categoryMeta: Record<
  string,
  { label: string; description: string }
> = {
  devotionals: {
    label: "Devotionals",
    description: "Short reflections aimed at attention, prayer, and daily faithfulness.",
  },
  blogs: {
    label: "Blogs",
    description: "Short-form writing—clear, practical, and meant for quick reading.",
  },
  "journal-articles": {
    label: "Journal Articles",
    description: "Longer-form pieces with more structure, citations, and careful argumentation.",
  },
  reviews: {
    label: "Reviews",
    description: "Books, essays, or media—summarized and evaluated with clarity.",
  },
  resources: {
    label: "Resources",
    description: "Helpful links, reading lists, and recommendations for study.",
  },
};

export default function Category() {
  const { slug } = useParams();

  const meta = slug ? categoryMeta[slug] : undefined;

  const label = meta?.label ?? (slug ? slug.replaceAll("-", " ") : "Category");
  const description =
    meta?.description ??
    "Posts in this category. (This description will come from the CMS later.)";

  const posts = slug ? mockPosts.filter((p) => p.categorySlug === slug) : [];

  return (
    <div>
      {/* Category header */}
      <section style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="container" style={{ padding: "34px 16px 24px 16px" }}>
          <div className="small-muted" style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Link to="/" style={{ textDecoration: "none" }}>
              Home
            </Link>
            <span>•</span>
            <Link to="/articles" style={{ textDecoration: "none" }}>
              All
            </Link>
          </div>

          <h1 style={{ marginTop: 10, fontFamily: "var(--serif)", fontSize: 44 }}>
            {label}
          </h1>

          <p style={{ marginTop: 10, color: "var(--muted)", maxWidth: 760 }}>
            {description}
          </p>
        </div>
      </section>

      {/* Category posts */}
      <section className="container" style={{ padding: "24px 16px 56px 16px" }}>
        {posts.length === 0 ? (
          <div className="card" style={{ padding: 18 }}>
            <p style={{ margin: 0, color: "var(--muted)" }}>
              No posts yet in <strong>{label}</strong>.
            </p>
            <p style={{ marginTop: 10 }} className="small-muted">
              Once Sanity is connected, this will populate automatically.
            </p>
          </div>
        ) : (
          <div style={{ display: "grid", gap: 16 }}>
            {posts.map((p) => (
              <ArticleCard key={p.slug} post={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
