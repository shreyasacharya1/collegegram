import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import AskSeniorsPage from "./pages/AskSeniorsPage";
import FeedPage from "./pages/FeedPage";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";
import ProfilePage from "./pages/ProfilePage";
import RegisterPage from "./pages/RegisterPage";
import { useAuth } from "./state/auth";

const Protected = ({ children }: { children: JSX.Element }) => {
  const { token, ready } = useAuth();
  if (!ready) return <main className="mx-auto max-w-2xl p-6">Loading...</main>;
  return token ? children : <Navigate to="/login" replace />;
};

export function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<Protected><FeedPage /></Protected>} />
        <Route path="/ask-seniors" element={<Protected><AskSeniorsPage /></Protected>} />
        <Route path="/profile/:id" element={<Protected><ProfilePage /></Protected>} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}
