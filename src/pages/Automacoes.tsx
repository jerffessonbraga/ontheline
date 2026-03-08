import { useState, useEffect } from "react";
import { Zap, Film, Calendar, Hash, MessageCircle, BarChart3, RefreshCw, Loader2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const automationDefs = [
  {
    id: "reels",
    icon: Film,
    iconBg: "bg-primary/15 text-primary",
    title: "Geração Semanal de Reels",
    desc: "IA cria roteiro, legenda e hashtags toda semana com Gemini automaticamente.",
    defaultActive: true,
  },
  {
    id: "agendamento",
    icon: Calendar,
    iconBg: "bg-success/15 text-success",
    title: "Agendamento Inteligente",
    desc: "Publica nos melhores horários baseado no engajamento do seu perfil.",
    defaultActive: true,
  },
  {
    id: "hashtags",
    icon: Hash,
    iconBg: "bg-blue-500/15 text-blue-400",
    title: "Hashtags Automáticas",
    desc: "Hashtags segmentadas e otimizadas para cada tipo de conteúdo.",
    defaultActive: true,
  },
  {
    id: "respostas",
    icon: MessageCircle,
    iconBg: "bg-accent/15 text-accent",
    title: "Respostas Automáticas",
    desc: "Responde comentários frequentes com mensagens personalizadas pela IA.",
    defaultActive: false,
  },
  {
    id: "relatorio",
    icon: BarChart3,
    iconBg: "bg-warning/15 text-warning",
    title: "Relatório Semanal",
    desc: "Resumo de desempenho toda segunda via WhatsApp ou Email.",
    defaultActive: false,
  },
  {
    id: "repost",
    icon: RefreshCw,
    iconBg: "bg-success/15 text-success",
    title: "Repost de Menções",
    desc: "Reposta automaticamente quando marcam você em conteúdos relevantes.",
    defaultActive: false,
  },
];

const Automacoes = () => {
  const { user } = useAuth();
  const [states, setStates] = useState<Record<string, boolean>>(
    Object.fromEntries(automationDefs.map((a) => [a.id, a.defaultActive]))
  );
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState<string | null>(null);

  // Load saved states from DB
  useEffect(() => {
    if (!user) return;

    const load = async () => {
      const { data, error } = await supabase
        .from("user_automations")
        .select("automation_id, is_active")
        .eq("user_id", user.id);

      if (error) {
        console.error("Error loading automations:", error);
        setLoading(false);
        return;
      }

      if (data && data.length > 0) {
        const dbStates: Record<string, boolean> = {};
        for (const a of automationDefs) {
          const saved = data.find((d) => d.automation_id === a.id);
          dbStates[a.id] = saved ? saved.is_active : a.defaultActive;
        }
        setStates(dbStates);
      } else {
        // First time — seed defaults
        const inserts = automationDefs.map((a) => ({
          user_id: user.id,
          automation_id: a.id,
          is_active: a.defaultActive,
        }));
        await supabase.from("user_automations").insert(inserts);
      }

      setLoading(false);
    };

    load();
  }, [user]);

  const toggle = async (id: string) => {
    if (!user || toggling) return;

    const newValue = !states[id];
    setStates((prev) => ({ ...prev, [id]: newValue }));
    setToggling(id);

    const { error } = await supabase
      .from("user_automations")
      .upsert(
        { user_id: user.id, automation_id: id, is_active: newValue, updated_at: new Date().toISOString() },
        { onConflict: "user_id,automation_id" }
      );

    if (error) {
      // Revert
      setStates((prev) => ({ ...prev, [id]: !newValue }));
      toast.error("Erro ao salvar automação");
      console.error(error);
    } else {
      const label = automationDefs.find((a) => a.id === id)?.title;
      toast.success(`${label} ${newValue ? "ativada" : "desativada"}`);
    }

    setToggling(null);
  };

  const activeCount = Object.values(states).filter(Boolean).length;

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-8 flex items-center justify-center min-h-[60vh]">
        <Loader2 size={28} className="animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 pb-20">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold flex items-center gap-2">
            <Zap size={22} className="text-primary" />
            Automações
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Piloto automático para o seu Instagram</p>
        </div>
        <span className="text-sm font-medium text-success">
          • {activeCount} de {automationDefs.length} ativas
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {automationDefs.map((auto, i) => {
          const isActive = states[auto.id];
          return (
            <motion.div
              key={auto.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`glass-card p-5 space-y-4 transition-all duration-300 ${
                isActive ? "border-primary/20" : ""
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${auto.iconBg}`}>
                <auto.icon size={20} />
              </div>
              <div>
                <h3 className="font-display font-semibold">{auto.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{auto.desc}</p>
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className={`text-xs font-medium ${isActive ? "status-active" : "status-inactive"}`}>
                  • {isActive ? "Ativa" : "Inativa"}
                </span>
                <Switch
                  checked={isActive}
                  onCheckedChange={() => toggle(auto.id)}
                  disabled={toggling === auto.id}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default Automacoes;
