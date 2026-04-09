import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import LoadingSpinner from './components/LoadingSpinner';

const HomePage = lazy(() => import('./pages/HomePage'));
const PlayerPage = lazy(() => import('./pages/PlayerPage'));

export default function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="main-content">
        <Suspense fallback={<div className="container" style={{paddingTop: '100px'}}><LoadingSpinner /></div>}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/catalog" element={<HomePage />} />
            <Route path="/anime/:id" element={<PlayerPage />} />
            <Route path="*" element={<div className="container" style={{paddingTop: '100px', textAlign: 'center'}}><h2>404 - Page Not Found</h2></div>} />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
}
