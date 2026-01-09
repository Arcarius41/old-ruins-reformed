import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import ArticleCard from "../components/ArticleCard";
import type { PostPreview } from "../components/ArticleCard";
import { sanityClient } from "../lib/sanity";

type SanityPostRow = {
  title: string;
  slug: string;
  publishedAt?: string;
  excerpt?: string;
  categorySlug?: string;
  categoryLabel?: string;
  author?: string;
  imageUrl?: string;
};

type SanityResult = {
  items: SanityPostRow[];
  total: number;
};

const PAGE_SIZE = 10;

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
{
  "total": count(*[_type == "post"]),
  "items": *[_type == "post"] | order(publishedAt desc)[$start...$end]{
    title,
    "slug": slug.current,
    publishedAt,
    excerpt,
    author,
    "categorySlug": category->slug.current,
    "categoryLabel": category->title,
    "imageUrl": heroImage.asset->url
  }
}
`;

export default function Articles() {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = useMemo(() => {
    const raw = Number(searchParams.get("page") || "1");
    return Number.isFinite(raw) && raw > 0 ? Math.floor(raw) : 1;
  }, [searchParams]);

  const [posts, setPosts] = useState<PostPreview[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);

  function setPage(nextPage: number) {
    const p = Math.max(1, Math.min(nextPage, totalPages));
    setSearchParams({ page: String(p) });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  useEffect(() => {
    let alive = true;

    async function run() {
      try {
        setError(null);
        setLoading(true);

        const start = (safePage - 1) * PAGE_SIZE;
        const end = start + PAGE_SIZE;

        const data = await sanityClient.fetch<SanityResult>(QUERY, { start, end });

        const mapped: PostPreview[] = data.items.map((p) => ({
          title: p.title,
          slug: p.slug,
          categorySlug: p.categorySlug || "",
          categoryLabel: p.categoryLabel || "Uncategorized",
          author: p.author || "Joseph",
          publishedAt: (p.publishedAt || "").slice(0, 10),
          excerpt: p.excerpt || "",
          coverColor: p.imageUrl
            ? `url(${p.imageUrl}) center/cover no-repeat`
            : (FALLBACKS[p.categorySlug || ""] ||
              "linear-gradient(135deg, rgba(156,199,178,0.45), rgba(20,20,20,0.04))"),
        }));

        if (alive) {
          setPosts(mapped);
          setTotal(data.total);
        }
      } catch (err) {
        console.error("Failed to load posts from Sanity:", err);
        if (alive) {
          setError(err instanceof Error ? err.message : String(err));
          setPosts([]);
          setTotal(0);
        }
      } finally {
        if (alive) setLoading(false);
      }
    }

    run();
    return () => {
      alive = false;
    };
  }, [safePage, totalPages]);

  return (
    <div>
      {/* Header */}
      <section style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="container" style={{ padding: "34px 16px 24px 16px" }}>
          <div className="small-muted" style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Link to="/" style={{ textDecoration: "none" }}>Home</Link>
            <span>•</span>
            <span>All</span>
          </div>

          <h1 style={{ marginTop: 10, fontFamily: "var(--serif)", fontSize: 44 }}>
            All Posts
          </h1>

          <p style={{ marginTop: 10, color: "var(--muted)", maxWidth: 760 }}>
            Everything Joseph has published—across devotionals, blogs, journal articles, reviews, and resources.
          </p>
        </div>
      </section>

      {/* List */}
      <section className="container" style={{ padding: "24px 16px 22px 16px" }}>
        {loading ? (
          <div className="small-muted">Loading posts…</div>
        ) : error ? (
          <div className="small-muted" style={{ whiteSpace: "pre-wrap" }}>
            Sanity error: {error}
          </div>
        ) : posts.length === 0 ? (
          <div className="card" style={{ padding: 18 }}>
            <p style={{ margin: 0, color: "var(--muted)" }}>No posts yet.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gap: 16 }}>
            {posts.map((p) => (
              <ArticleCard key={p.slug} post={p} />
            ))}
          </div>
        )}
      </section>

      {/* Pagination */}
      <section className="container" style={{ padding: "0 16px 56px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <div className="small-muted">
            Page <strong>{safePage}</strong> of <strong>{totalPages}</strong> {total ? `• ${total} total` : ""}
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button
              className="btn"
              type="button"
              disabled={safePage <= 1 || loading}
              onClick={() => setPage(safePage - 1)}
            >
              ← Prev
            </button>

            <button
              className="btn btn-primary"
              type="button"
              disabled={safePage >= totalPages || loading}
              onClick={() => setPage(safePage + 1)}
            >
              Next →
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
