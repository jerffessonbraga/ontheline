import { useState } from "react";
import { ChevronLeft, ChevronRight, Sparkles, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const DAYS = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"];

const samplePosts: Record<string, { title: string; color: string }[]> = {
  "3": [{ title: "Reel fitness", color: "bg-blue-600/60" }],
  "7": [
    { title: "Dica nutrição", color: "bg-primary/60" },
    { title: "Enquete", color: "bg-primary/40" },
  ],
  "10": [{ title: "Top 5", color: "bg-blue-600/60" }],
  "14": [{ title: "Receita fit", color: "bg-success/40" }],
  "17": [{ title: "Motivação", color: "bg-accent/50" }],
  "21": [
    { title: "Bastidores", color: "bg-success/40" },
    { title: "Tutorial", color: "bg-success/30" },
  ],
  "24": [{ title: "Guia", color: "bg-blue-600/60" }],
  "28": [{ title: "Reflexão", color: "bg-accent/40" }],
};

const Agendar = () => {
  const [month] = useState(2); // March 2026
  const [year] = useState(2026);
  const today = 7;

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div className="flex h-[calc(100vh-57px-33px)]">
      {/* Sidebar */}
      <div className="w-64 border-r border-border p-6 space-y-4">
        <h2 className="font-display text-lg font-bold flex items-center gap-2">
          <FileText size={18} />
          Fila
        </h2>
        <span className="text-sm text-muted-foreground">0 posts</span>
        <p className="text-sm text-muted-foreground mt-8">
          Nenhum post na fila ainda.<br />
          Crie conteúdo com IA primeiro.
        </p>
      </div>

      {/* Calendar */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
              <ChevronLeft size={16} />
            </button>
            <button className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
              <ChevronRight size={16} />
            </button>
            <h2 className="font-display text-2xl font-bold ml-2">março de 2026</h2>
          </div>
          <Button className="gradient-button border-0">
            <Sparkles size={14} className="mr-2" />
            Auto-preencher IA
          </Button>
        </div>

        <div className="grid grid-cols-7 gap-px bg-border rounded-xl overflow-hidden">
          {DAYS.map((day) => (
            <div key={day} className="bg-secondary/50 py-2 text-center text-xs font-bold text-muted-foreground tracking-wider">
              {day}
            </div>
          ))}
          {cells.map((day, i) => {
            const posts = day ? samplePosts[String(day)] || [] : [];
            const isToday = day === today;
            return (
              <motion.div
                key={i}
                whileHover={{ scale: 1.02 }}
                className={`bg-card min-h-[100px] p-2 transition-colors hover:bg-secondary/30 ${
                  isToday ? "ring-1 ring-primary/50" : ""
                } ${!day ? "bg-muted/30" : ""}`}
              >
                {day && (
                  <>
                    <span className={`text-sm font-medium ${isToday ? "text-primary font-bold" : "text-muted-foreground"}`}>
                      {day}
                    </span>
                    <div className="mt-1 space-y-1">
                      {posts.map((post, pi) => (
                        <div
                          key={pi}
                          className={`${post.color} text-[10px] font-medium px-2 py-1 rounded text-foreground truncate`}
                        >
                          {post.title}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Agendar;
