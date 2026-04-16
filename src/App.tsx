import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SEO from "./components/SEO";

const HomePage = lazy(() => import("./pages/HomePage"));
const PlayerPage = lazy(() => import("./pages/PlayerPage"));
const AnimeDetailsPage = lazy(() => import("./pages/AnimeDetailsPage"));
const LegalPage = lazy(() => import("./pages/LegalPage"));

export default function App() {
  return (
    <div className="app">
      <SEO />
      <Navbar />
      <main className="main-content">
        <Suspense fallback={<div className="container" />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/catalog" element={<HomePage />} />
            <Route path="/anime/:id" element={<AnimeDetailsPage />} />
            <Route
              path="/anime/:id/watch/:episodeId"
              element={<PlayerPage />}
            />
            <Route path="/terms" element={<LegalPage type="terms" />} />
            <Route path="/privacy" element={<LegalPage type="privacy" />} />
            <Route path="/dmca" element={<LegalPage type="dmca" />} />
            <Route
              path="*"
              element={
                <div className="container" style={{ textAlign: "center" }}>
                  <h2>404 - Page Not Found</h2>
                </div>
              }
            />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
