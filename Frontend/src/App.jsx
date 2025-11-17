import { Navigate, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage.jsx';
import MainPage from './pages/MainPage.jsx';
import ViewerPage from './pages/ViewerPage.jsx';
import MyListPage from './pages/MyListPage.jsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/main" element={<MainPage />} />
      <Route path="/viewer" element={<ViewerPage />} />
      <Route path="/viewer/:id" element={<ViewerPage />} />
      <Route path="/my-list" element={<MyListPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
