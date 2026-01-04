import { Link } from "react-router-dom";

export type PostPreview = {
  title: string;
  slug: string;
  excerpt: string;
  author?: string;
  publishedAt?: string;
  categorySlug: string;
  categoryLabel: string;
  coverColor?: string;
};

function formatDate(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export default function ArticleCard({ post }: { post: PostPreview }) {
  const date = formatDate(post.publishedAt);

  return (
    <article className="card" style={{ overflow: "hidden" }}>
      {/* Responsive grid: stacks on small screens */}
      <div className="article-card">
        {/* Image placeholder */}
        <div
          className="article-card__media"
          style={{
            background:
              post.coverColor ??
              "linear-gradient(135deg, rgba(156,199,178,0.65), rgba(20,20,20,0.06))",
          }}
        />

        <div className="article-card__content">
          <div className="small-muted article-card__meta">
            <Link
              to={`/category/${post.categorySlug}`}
              style={{ textDecoration: "none", fontWeight: 700, color: "var(--accent-strong)" }}
            >
              {post.categoryLabel}
            </Link>
            {post.author ? <span>• {post.author}</span> : null}
            {date ? <span>• {date}</span> : null}
          </div>

          <h3 className="article-card__title" style={{ fontFamily: "var(--serif)" }}>
            {post.title}
          </h3>

          <p className="article-card__excerpt">{post.excerpt}</p>

          <div style={{ marginTop: 14 }}>
            <Link to={`/article/${post.slug}`} className="btn" style={{ textDecoration: "none", display: "inline-block" }}>
              Read more
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
