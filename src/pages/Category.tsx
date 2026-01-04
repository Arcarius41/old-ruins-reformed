import { useParams } from "react-router-dom";

export default function Category() {
  const { slug } = useParams();

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "2rem 1rem" }}>
      <h1 style={{ textTransform: "capitalize" }}>{slug?.replaceAll("-", " ")}</h1>
      <p style={{ maxWidth: 750, opacity: 0.85 }}>
        This page will show posts filtered by category: <strong>{slug}</strong>.
      </p>
    </div>
  );
}
