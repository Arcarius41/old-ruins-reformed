export default function Home() {
  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "2rem 1rem" }}>
      <h1 style={{ margin: 0 }}>The Old Ruins Reformed</h1>
      <p style={{ maxWidth: 700, opacity: 0.85 }}>
        Home will show the newest posts across all categories. Hero banner + latest posts + subscribe block goes here.
      </p>

      <section style={{ marginTop: "2rem", padding: "2rem", borderRadius: 16, border: "1px solid rgba(0,0,0,0.08)" }}>
        <h2 style={{ marginTop: 0 }}>Subscribe</h2>
        <p style={{ maxWidth: 650, opacity: 0.85 }}>
          Newsletter signup will go here (Brevo). For now, this is a placeholder.
        </p>
        <form style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          <input
            type="email"
            placeholder="Email address"
            style={{ padding: "0.75rem 1rem", borderRadius: 12, border: "1px solid rgba(0,0,0,0.2)", minWidth: 260 }}
          />
          <button type="button" style={{ padding: "0.75rem 1rem", borderRadius: 12, border: "1px solid rgba(0,0,0,0.2)", cursor: "pointer" }}>
            Subscribe
          </button>
        </form>
      </section>
    </div>
  );
}
