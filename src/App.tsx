import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";

import Home from "./pages/Home";
import Articles from "./pages/Articles";
import About from "./pages/About";
import Category from "./pages/Category";
import Post from "./pages/Post";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/articles" element={<Articles />} />
        <Route path="/about" element={<About />} />

        <Route path="/category/:slug" element={<Category />} />
        <Route path="/article/:slug" element={<Post />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
