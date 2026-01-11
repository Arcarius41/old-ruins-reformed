import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { PortableText } from "@portabletext/react";
import { sanityClient } from "../lib/sanity";
import type { PortableTextBlock } from "@portabletext/types";


type SanityPost = {
  title: string;
  slug: string;
  publishedAt?: string; // "YYYY-MM-DD"
  excerpt?: string;
  author?: string;
  categorySlug?: string;
  categoryLabel?: string;
  imageUrl?: string;
 body?: PortableTextBlock[];
 // Portable Text blocks
};

const QUERY = /* groq */ `
*[_type == "post" && slug.current == $slug][0]{
  title,
  "slug": slug.current,
  publishedAt,
  excerpt,
  author,
  "categorySlug": category->slug.current,
  "categoryLabel": category->title,
  "imageUrl": heroImage.asset->url,
  body
}
`;

function formatDateDateOnly(yyyyMmDd?: string) {
  if (!yyyyMmDd) return "";
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(yyyyMmDd);
  if (!m) return yyyyMmDd;
  const [, y, mo, d] = m;
  const dt = new Date(Number(y), Number(mo) - 1, Number(d));
  if (Number.isNaN(dt.getTime())) return yyyyMmDd;
  return dt.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
}

export default function Post() {
  const { slug } = useParams<{ slug: string }>();

  const [post, setPost] = useState<SanityPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const coverBg = useMemo(() => {
    if (post?.imageUrl) return `url(${post.imageUrl}) center/cover no-repeat`;
    return "linear-gradient(135deg, rgba(156,199,178,0.55), rgba(20,20,20,0.06))";
  }, [post?.imageUrl]);

  useEffect(() => {
    let alive = true;

    async function run() {
      if (!slug) {
        setPost(null);
        setLoading(false);
        return;
      }

      try {
        setError(null);
        setLoading(true);

        const data = await sanityClient.fetch<SanityPost | null>(QUERY, { slug });
        if (alive) setPost(data);
      } catch (err) {
        console.error("Failed to load post from Sanity:", err);
        if (alive) {
          setError(err instanceof Error ? err.message : String(err));
          setPost(null);
        }
      } finally {
        if (alive) setLoading(false);
      }
    }

    run();
    return () => {
      alive = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="container" style={{ padding: "34px 16px 54px 16px", maxWidth: 900 }}>
        <div className="small-muted">Loading post…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container" style={{ padding: "34px 16px 54px 16px", maxWidth: 900 }}>
        <h1 style={{ fontFamily: "var(--serif)" }}>Couldn’t load post</h1>
        <p className="small-muted" style={{ whiteSpace: "pre-wrap" }}>
          Sanity error: {error}
        </p>
        <div style={{ marginTop: 16 }}>
          <Link to="/articles" className="btn" style={{ textDecoration: "none" }}>
            Back to Articles
          </Link>
        </div>
      </div>
    );
  }

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

  const dateLabel = formatDateDateOnly(post.publishedAt);

  return (
    <div>
      <section style={{ borderBottom: "1px solid var(--border)", background: coverBg }}>
        <div
          className="container"
          style={{
            padding: "34px 16px 24px 16px",
            background: post.imageUrl ? "rgba(0,0,0,0.18)" : "transparent",
          }}
        >
          <div className="small-muted" style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {post.categorySlug ? (
              <Link
                to={`/category/${post.categorySlug}`}
                style={{ textDecoration: "none", fontWeight: 800, color: "var(--accent-strong)" }}
              >
                {post.categoryLabel ?? "Category"}
              </Link>
            ) : (
              <span style={{ fontWeight: 800, color: "var(--accent-strong)" }}>
                {post.categoryLabel ?? "Uncategorized"}
              </span>
            )}

            {post.author ? <span>• {post.author}</span> : null}
            {dateLabel ? <span>• {dateLabel}</span> : null}
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

      <article className="container" style={{ padding: "28px 16px 60px 16px", maxWidth: 900 }}>
        <div className="prose">{post.body ? <PortableText value={post.body} /> : null}</div>
      </article>
    </div>
  );
}
