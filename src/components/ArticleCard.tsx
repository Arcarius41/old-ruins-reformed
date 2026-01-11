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

function formatDate(dateStr?: string) {
  if (!dateStr) return "";

  // If Sanity returns "YYYY-MM-DD" (date-only), construct a LOCAL date to avoid UTC off-by-one.
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    const [y, m, d] = dateStr.split("-").map(Number);
    const local = new Date(y, (m ?? 1) - 1, d ?? 1);
    return local.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  // If Sanity returns a full ISO datetime, normal parsing is fine.
  const dt = new Date(dateStr);
  if (Number.isNaN(dt.getTime())) return "";
  return dt.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function ArticleCard({ post }: { post: PostPreview }) {
  const date = formatDate(post.publishedAt);

  const mediaBackground =
    post.coverColor ??
    "linear-gradient(135deg, rgba(156,199,178,0.65), rgba(20,20,20,0.06))";

  return (
    <article className="card article-card-wrap">
      <div className="article-card">
        {/* Media */}
        <div className="article-card__media" style={{ background: mediaBackground }} />

        {/* Content */}
        <div className="article-card__content">
          <div className="small-muted article-card__meta">
            <Link
              to={`/category/${post.categorySlug}`}
              className="article-card__category"
              style={{ textDecoration: "none" }}
            >
              {post.categoryLabel}
            </Link>
            {post.author ? <span>• {post.author}</span> : null}
            {date ? <span>• {date}</span> : null}
          </div>

          <h3 className="article-card__title" style={{ fontFamily: "var(--serif)" }}>
            <Link
              to={`/article/${post.slug}`}
              className="article-card__titleLink"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              {post.title}
            </Link>
          </h3>

          {post.excerpt ? <p className="article-card__excerpt">{post.excerpt}</p> : null}

          <div className="article-card__actions">
            <Link to={`/article/${post.slug}`} className="btn btn-primary" style={{ textDecoration: "none" }}>
              Read more
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
