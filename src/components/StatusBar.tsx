import { Bot, Instagram, Film } from "lucide-react";

const StatusBar = () => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 border-t border-border bg-background/95 backdrop-blur-md px-6 py-2 flex items-center justify-between text-xs text-muted-foreground z-40">
      <div className="flex items-center gap-6">
        <span className="flex items-center gap-1.5">
          <Bot size={12} />
          Gemini: não configurado
        </span>
        <span className="flex items-center gap-1.5">
          <Instagram size={12} />
          Instagram: não conectado
        </span>
        <span className="flex items-center gap-1.5">
          <Film size={12} />
          Fila: 0 posts
        </span>
      </div>
      <span className="text-muted-foreground">
        InstaFlow ✦ Powered by Gemini Free
      </span>
    </footer>
  );
};

export default StatusBar;
