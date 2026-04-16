import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SEO from "./components/SEO";

const HomePage = lazy(() => import("./pages/HomePage"));
const PlayerPage = lazy(() => import("./pages/PlayerPage"));
const AnimeDetailsPage = lazy(() => import("./pages/AnimeDetailsPage"));

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
            <Route path="/terms" element={<div className="container" style={{padding: '120px 20px'}}><h2>Terms of Service</h2><p>Coming soon...</p></div>} />
            <Route path="/privacy" element={<div className="container" style={{padding: '120px 20px'}}><h2>Privacy Policy</h2><p>Coming soon...</p></div>} />
            <Route path="/dmca" element={<div className="container" style={{padding: '120px 20px'}}><h2>DMCA</h2><p>Coming soon...</p></div>} />
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
