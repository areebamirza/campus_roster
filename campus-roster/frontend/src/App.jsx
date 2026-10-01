import { useCallback, useState } from 'react';
import { NavLink, Navigate, Route, Routes } from 'react-router-dom';
import StudentsPage from './pages/StudentsPage.jsx';
import CoursesPage from './pages/CoursesPage.jsx';

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const notify = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="app">
      <header className="topbar">
        <button className="btn ghost" onClick={() => setMenuOpen(true)} aria-label="Open menu">☰</button>
        <strong>Campus Roster</strong>
      </header>

      <aside className={`sidebar ${menuOpen ? 'open' : ''}`}>
        <div className="brand">Campus Roster</div>
        <nav>
          <NavLink to="/students" onClick={closeMenu}>Students</NavLink>
          <NavLink to="/courses" onClick={closeMenu}>Courses</NavLink>
        </nav>
      </aside>
      {menuOpen && <div className="backdrop" onClick={closeMenu} />}

      <main className="content">
        <Routes>
          <Route path="/" element={<Navigate to="/students" replace />} />
          <Route path="/students" element={<StudentsPage notify={notify} />} />
          <Route path="/courses" element={<CoursesPage notify={notify} />} />
        </Routes>
      </main>

      {toast && <div className={`toast ${toast.type}`}>{toast.message}</div>}
    </div>
  );
}
