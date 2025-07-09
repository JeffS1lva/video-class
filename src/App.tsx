import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { LoginSignupScreen } from "./componentes/Login/LoginSignUp";
import VideoLearningPlatform from "./componentes/VideoLearningPlatform";

// URL base da API
const API_BASE_URL = "https://video-class-backend-production.up.railway.app/api";

// Componente para proteger rotas autenticadas
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      const user = localStorage.getItem("user");

      if (token && user) {
        // Verificar se o token ainda é válido fazendo uma chamada para o perfil
        try {
          const response = await fetch(`${API_BASE_URL}/profile`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });

          if (response.ok) {
            setIsAuthenticated(true);
          } else {
            // Token inválido, limpar storage
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setIsAuthenticated(false);
          }
        } catch (error) {
          console.error("Erro ao verificar autenticação:", error);
          // Em caso de erro, assumir que não está autenticado
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }

      setIsLoading(false);
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Carregando...</div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Componente para redirecionar usuários autenticados
const AuthRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      const user = localStorage.getItem("user");

      if (token && user) {
        // Verificar se o token ainda é válido
        try {
          const response = await fetch(`${API_BASE_URL}/profile`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });

          if (response.ok) {
            setIsAuthenticated(true);
          } else {
            // Token inválido, limpar storage
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setIsAuthenticated(false);
          }
        } catch (error) {
          console.error("Erro ao verificar autenticação:", error);
          // Em caso de erro, assumir que não está autenticado
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }

      setIsLoading(false);
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Carregando...</div>
      </div>
    );
  }

  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
};

// Componente wrapper para o VideoLearningPlatform com função de logout
const VideoLearningWrapper = () => {
  return <VideoLearningPlatform />;
};

export function App() {
  return (
    <Router>
      <Routes>
        {/* Rota raiz - redireciona para login se não autenticado ou dashboard se autenticado */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Navigate to="/dashboard" replace />
            </ProtectedRoute>
          }
        />

        {/* Rota de login - redireciona para dashboard se já autenticado */}
        <Route
          path="/login"
          element={
            <AuthRoute>
              <LoginSignupScreen />
            </AuthRoute>
          }
        />

        {/* Rota protegida do dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <VideoLearningWrapper />
            </ProtectedRoute>
          }
        />

        {/* Rota para capturar todas as outras rotas e redirecionar */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
