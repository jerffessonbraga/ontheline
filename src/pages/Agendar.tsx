import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Sparkles, FileText, Film, LayoutGrid, Circle, Image, Clock, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useScheduledPosts } from "@/hooks/useScheduledPosts";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameDay, addMonths, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

const DAYS = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"];

const typeIcons: Record<string, any> = {
  reel: Film,
  feed: LayoutGrid,
  story: Circle,
  carrossel: Image,
};

const statusColors: Record<string, string> = {
  rascunho: "bg-muted text-muted-foreground",
  agendado: "bg-primary/20 text-primary",
  pronto: "bg-warning/20 text-warning",
  publicado: "bg-success/20 text-success",
};

const Agendar = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [currentDate, setCurrentDate] = useState(new Date());
  const { data: posts = [], isLoading } = useScheduledPosts();

  const today = new Date();
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startPadding = getDay(monthStart);

  const postsByDay = useMemo(() => {
    const map: Record<string, typeof posts> = {};
    posts.forEach((post) => {
      if (post.scheduled_at) {
        const key = format(new Date(post.scheduled_at), "yyyy-MM-dd");
        if (!map[key]) map[key] = [];
        map[key].push(post);
      }
    });
    return map;
  }, [posts]);

  const scheduledPosts = posts.filter((p) => p.status === "agendado" || p.status === "rascunho");

  const handleSchedule = async (postId: string) => {
    try {
      const { error } = await supabase
        .from("posts")
        .update({ status: "agendado" })
        .eq("id", postId);
      if (error) throw error;
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("Post agendado! 📅");
    } catch {
      toast.error("Erro ao agendar post");
    }
  };

  return (
    <div className="flex h-[calc(100vh-57px-33px)]">
      {/* Sidebar - Queue */}
      <div className="w-72 border-r border-border overflow-y-auto p-5 space-y-4">
        <h2 className="font-display text-lg font-bold flex items-center gap-2">
          <FileText size={18} />
          Fila
        </h2>
        <span className="text-sm text-muted-foreground">{scheduledPosts.length} posts</span>

        {scheduledPosts.length === 0 ? (
          <p className="text-sm text-muted-foreground mt-8">
            Nenhum post na fila ainda.<br />
            Crie conteúdo com IA primeiro.
          </p>
        ) : (
          <div className="space-y-2 mt-4">
            {scheduledPosts.map((post) => {
              const TypeIcon = typeIcons[post.post_type] || LayoutGrid;
              return (
                <div key={post.id} className="glass-card p-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <TypeIcon size={14} className="text-primary" />
                    <span className="text-xs font-bold uppercase text-primary">{post.post_type}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ml-auto ${statusColors[post.status] || ""}`}>
                      {post.status}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{post.generated_content?.slice(0, 60)}...</p>
                  {post.scheduled_at && (
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      <Clock size={10} />
                      {format(new Date(post.scheduled_at), "dd MMM, HH:mm", { locale: ptBR })}
                    </div>
                  )}
                  {post.status === "rascunho" && post.scheduled_at && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full text-xs h-7"
                      onClick={() => handleSchedule(post.id)}
                    >
                      <Check size={12} className="mr-1" /> Confirmar Agendamento
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Calendar */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentDate((d) => subMonths(d, 1))}
              className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => setCurrentDate((d) => addMonths(d, 1))}
              className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronRight size={16} />
            </button>
            <h2 className="font-display text-2xl font-bold ml-2">
              {format(currentDate, "MMMM 'de' yyyy", { locale: ptBR })}
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-px bg-border rounded-xl overflow-hidden">
          {DAYS.map((day) => (
            <div key={day} className="bg-secondary/50 py-2 text-center text-xs font-bold text-muted-foreground tracking-wider">
              {day}
            </div>
          ))}
          {Array.from({ length: startPadding }).map((_, i) => (
            <div key={`pad-${i}`} className="bg-muted/30 min-h-[100px]" />
          ))}
          {daysInMonth.map((day) => {
            const key = format(day, "yyyy-MM-dd");
            const dayPosts = postsByDay[key] || [];
            const isToday = isSameDay(day, today);
            return (
              <motion.div
                key={key}
                whileHover={{ scale: 1.02 }}
                className={`bg-card min-h-[100px] p-2 transition-colors hover:bg-secondary/30 ${
                  isToday ? "ring-1 ring-primary/50" : ""
                }`}
              >
                <span className={`text-sm font-medium ${isToday ? "text-primary font-bold" : "text-muted-foreground"}`}>
                  {format(day, "d")}
                </span>
                <div className="mt-1 space-y-1">
                  {dayPosts.map((post: any) => (
                    <div
                      key={post.id}
                      className={`text-[10px] font-medium px-2 py-1 rounded truncate ${statusColors[post.status] || "bg-primary/20 text-primary"}`}
                    >
                      {post.post_type} · {post.nicho?.slice(0, 15)}
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Agendar;
