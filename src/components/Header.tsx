import { NavLink } from "react-router-dom";

const linkStyle = ({ isActive }: { isActive: boolean }) => ({
  textDecoration: "none",
  padding: "0.5rem 0.75rem",
  borderRadius: "10px",
  color: "inherit",
  background: isActive ? "rgba(0,0,0,0.06)" : "transparent",
});

export default function Header() {
  return (
    <header style={{ borderBottom: "1px solid rgba(0,0,0,0.08)" }}>
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "1rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
          flexWrap: "wrap",
        }}
      >
        <NavLink
          to="/"
          style={{
            textDecoration: "none",
            color: "inherit",
            fontWeight: 800,
            letterSpacing: "0.2px",
          }}
        >
          The Old Ruins Reformed
        </NavLink>

        <nav style={{ display: "flex", flexWrap: "wrap", gap: "0.25rem" }}>
          <NavLink to="/" style={linkStyle}>Home</NavLink>

          <NavLink to="/category/devotionals" style={linkStyle}>Devotionals</NavLink>
          <NavLink to="/category/blogs" style={linkStyle}>Blogs</NavLink>
          <NavLink to="/category/journal-articles" style={linkStyle}>Journal Articles</NavLink>
          <NavLink to="/category/reviews" style={linkStyle}>Reviews</NavLink>
          <NavLink to="/category/resources" style={linkStyle}>Resources</NavLink>

          <NavLink to="/articles" style={linkStyle}>All</NavLink>
          <NavLink to="/about" style={linkStyle}>About</NavLink>
        </nav>
      </div>
    </header>
  );
}
