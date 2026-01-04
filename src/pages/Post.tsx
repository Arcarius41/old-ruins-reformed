import { useParams } from "react-router-dom";

export default function Post() {
  const { slug } = useParams();

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "2rem 1rem" }}>
      <h1>Post: {slug}</h1>
      <p style={{ opacity: 0.85 }}>
        Single post page. Later we’ll fetch the post by slug from Sanity and render the body.
      </p>
    </div>
  );
}
