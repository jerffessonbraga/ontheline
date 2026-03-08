import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "@/components/Header";
import StatusBar from "@/components/StatusBar";
import NewPostModal from "@/components/NewPostModal";
import Configuracao from "@/pages/Configuracao";
import CriarComIA from "@/pages/CriarComIA";
import Agendar from "@/pages/Agendar";
import Automacoes from "@/pages/Automacoes";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  const [showNewPost, setShowNewPost] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header onNewPost={() => setShowNewPost(true)} />
      <Routes>
        <Route path="/" element={<Configuracao />} />
        <Route path="/criar" element={<CriarComIA />} />
        <Route path="/agendar" element={<Agendar />} />
        <Route path="/automacoes" element={<Automacoes />} />
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
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
