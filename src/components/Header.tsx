import { useEffect, useMemo, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";

type NavItem = { label: string; to: string };

const navLinkStyle = ({ isActive }: { isActive: boolean }) => ({
  textDecoration: "none",
  padding: "0.55rem 0.75rem",
  borderRadius: "12px",
  color: "inherit",
  background: isActive ? "rgba(255,255,255,0.14)" : "transparent",
  fontWeight: 650,
});

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const location = useLocation();
  const isHome = location.pathname === "/";

  const navItems: NavItem[] = useMemo(
    () => [
      { label: "Home", to: "/" },
      { label: "Devotionals", to: "/category/devotionals" },
      { label: "Blogs", to: "/category/blogs" },
      { label: "Journal Articles", to: "/category/journal-articles" },
      { label: "Reviews", to: "/category/reviews" },
      { label: "Resources", to: "/category/resources" },
      { label: "All", to: "/articles" },
      { label: "About", to: "/about" },
    ],
    []
  );

  // Scroll behavior: on Home, start as overlay until user scrolls.
  // On other pages, treat it as "scrolled" immediately so the header is readable on light backgrounds.
  useEffect(() => {
    const onScroll = () => {
      if (!isHome) {
        setScrolled(true);
        return;
      }
      setScrolled(window.scrollY > 24);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // Close menu on Escape or click outside
  useEffect(() => {
    if (!menuOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };

    const onMouseDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (menuRef.current && !menuRef.current.contains(target)) {
        setMenuOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("mousedown", onMouseDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("mousedown", onMouseDown);
    };
  }, [menuOpen]);

  return (
    <header
      className={`site-header ${
        isHome ? "site-header--overlay" : "site-header--solid"
      } ${scrolled ? "site-header--scrolled" : ""}`}
    >
      <div className="site-header__inner container">
        <NavLink
          to="/"
          className={`site-brand ${scrolled ? "site-brand--scrolled" : ""}`}
        >
          The Old Ruins Reformed
        </NavLink>

        {/* Desktop nav */}
        <nav className="site-nav site-nav--desktop" aria-label="Primary navigation">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} style={navLinkStyle}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Mobile hamburger */}
        <div className="site-nav--mobile" ref={menuRef}>
          <button
            type="button"
            className="menu-button"
            aria-label="Open menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span className="menu-icon" aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
          </button>

          <div
            id="mobile-menu"
            className={`mobile-menu ${menuOpen ? "mobile-menu--open" : ""}`}
            role="menu"
          >
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} style={navLinkStyle} role="menuitem">
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
