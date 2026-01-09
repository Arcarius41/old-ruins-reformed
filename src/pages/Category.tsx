import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ArticleCard from "../components/ArticleCard";
import type { PostPreview } from "../components/ArticleCard";
import { sanityClient } from "../lib/sanity";

type SanityCategory = {
  title: string;
  slug: string;
  description?: string;
};

type SanityPostPreview = {
  title: string;
  slug: string;
  publishedAt?: string; // "YYYY-MM-DD"
  excerpt?: string;
  author?: string;
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

const CATEGORY_QUERY = /* groq */ `
*[_type == "category" && slug.current == $slug][0]{
  title,
  "slug": slug.current,
  description
}
`;

const POSTS_QUERY = /* groq */ `
*[_type == "post" && category->slug.current == $slug] | order(publishedAt desc){
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

export default function Category() {
  const { slug } = useParams<{ slug: string }>();

  const [category, setCategory] = useState<SanityCategory | null>(null);
  const [posts, setPosts] = useState<PostPreview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fallbackCover = useMemo(() => {
    return (categorySlug?: string) =>
      FALLBACKS[categorySlug || ""] ||
      "linear-gradient(135deg, rgba(156,199,178,0.45), rgba(20,20,20,0.04))";
  }, []);

  useEffect(() => {
    let alive = true;

    async function run() {
      if (!slug) {
        setCategory(null);
        setPosts([]);
        setLoading(false);
        return;
      }

      try {
        setError(null);
        setLoading(true);

        const [cat, rawPosts] = await Promise.all([
          sanityClient.fetch<SanityCategory | null>(CATEGORY_QUERY, { slug }),
          sanityClient.fetch<SanityPostPreview[]>(POSTS_QUERY, { slug }),
        ]);

        const mapped: PostPreview[] = rawPosts.map((p) => ({
          title: p.title,
          slug: p.slug,
          categorySlug: p.categorySlug || slug,
          categoryLabel: p.categoryLabel || cat?.title || "Category",
          author: p.author || "Joseph",
          publishedAt: p.publishedAt || "",
          excerpt: p.excerpt || "",
          coverColor: p.imageUrl
            ? `url(${p.imageUrl}) center/cover no-repeat`
            : fallbackCover(p.categorySlug),
        }));

        if (alive) {
          setCategory(cat);
          setPosts(mapped);
        }
      } catch (err) {
        console.error("Failed to load category from Sanity:", err);
        if (alive) {
          setError(err instanceof Error ? err.message : String(err));
          setCategory(null);
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
  }, [slug, fallbackCover]);

  const label = category?.title ?? (slug ? slug.replaceAll("-", " ") : "Category");
  const description =
    category?.description ??
    "Posts in this category. (Add a description on the category document in Sanity when you’re ready.)";

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

          <h1 style={{ marginTop: 10, fontFamily: "var(--serif)", fontSize: 44 }}>{label}</h1>

          <p style={{ marginTop: 10, color: "var(--muted)", maxWidth: 760 }}>{description}</p>
        </div>
      </section>

      {/* Category posts */}
      <section className="container" style={{ padding: "24px 16px 56px 16px" }}>
        {loading ? (
          <div className="small-muted">Loading posts…</div>
        ) : error ? (
          <div className="small-muted" style={{ whiteSpace: "pre-wrap" }}>
            Sanity error: {error}
          </div>
        ) : posts.length === 0 ? (
          <div className="card" style={{ padding: 18 }}>
            <p style={{ margin: 0, color: "var(--muted)" }}>
              No posts yet in <strong>{label}</strong>.
            </p>
            <p style={{ marginTop: 10 }} className="small-muted">
              Publish a post in Sanity and it will appear here.
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
