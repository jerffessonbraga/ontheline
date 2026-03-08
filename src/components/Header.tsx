import { Settings, Sparkles, Calendar, Zap, Plus, History, LogOut } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const navItems = [
  { label: "Configuração", icon: Settings, path: "/" },
  { label: "Criar com IA", icon: Sparkles, path: "/criar" },
  { label: "Agendar", icon: Calendar, path: "/agendar", badge: 0 },
  { label: "Histórico", icon: History, path: "/historico" },
  { label: "Automações", icon: Zap, path: "/automacoes" },
];

interface HeaderProps {
  onNewPost: () => void;
}

const Header = ({ onNewPost }: HeaderProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-md">
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl gradient-button flex items-center justify-center">
            <span className="text-lg">📷</span>
          </div>
          <span className="font-display text-xl font-bold tracking-tight">InstaFlow</span>
          <span className="text-[10px] font-bold bg-primary/20 text-primary px-2 py-0.5 rounded-full uppercase tracking-wider">
            Grátis
          </span>
        </div>

        <nav className="flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                }`}
              >
                <item.icon size={16} />
                {item.label}
                {item.badge !== undefined && (
                  <span className="bg-primary text-primary-foreground text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse-glow" />
            Configure a API
          </button>
          <Button
            onClick={onNewPost}
            className="gradient-button border-0 rounded-lg px-4 py-2 text-sm flex items-center gap-2"
          >
            <Plus size={16} />
            Novo Post
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
