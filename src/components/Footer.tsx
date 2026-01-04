export default function Footer() {
  return (
    <footer style={{ borderTop: "1px solid rgba(0,0,0,0.08)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "1.5rem 1rem", fontSize: 14, opacity: 0.8 }}>
        © {new Date().getFullYear()} The Old Ruins Reformed
      </div>
    </footer>
  );
}
