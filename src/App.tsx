import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import StatusBar from "@/components/StatusBar";
import NewPostModal from "@/components/NewPostModal";
import Configuracao from "@/pages/Configuracao";
import CriarComIA from "@/pages/CriarComIA";
import Agendar from "@/pages/Agendar";
import Automacoes from "@/pages/Automacoes";
import Historico from "@/pages/Historico";
import Auth from "@/pages/Auth";
import InstagramCallback from "@/pages/InstagramCallback";
import NotFound from "./pages/NotFound";
import { Loader2 } from "lucide-react";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Loader2 size={32} className="animate-spin text-primary" />
    </div>
  );
  if (!user) return <Navigate to="/auth" replace />;
  return <>{children}</>;
};

const AppContent = () => {
  const [showNewPost, setShowNewPost] = useState(false);
  const { user, loading } = useAuth();

  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Loader2 size={32} className="animate-spin text-primary" />
    </div>
  );

  if (!user) {
    return (
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="*" element={<Navigate to="/auth" replace />} />
      </Routes>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header onNewPost={() => setShowNewPost(true)} />
      <Routes>
        <Route path="/" element={<Configuracao />} />
        <Route path="/criar" element={<CriarComIA />} />
        <Route path="/agendar" element={<Agendar />} />
        <Route path="/automacoes" element={<Automacoes />} />
        <Route path="/historico" element={<Historico />} />
        <Route path="/auth" element={<Navigate to="/criar" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <StatusBar />
      <NewPostModal open={showNewPost} onClose={() => setShowNewPost(false)} />
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
