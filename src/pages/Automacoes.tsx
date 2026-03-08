import { useState } from "react";
import { Zap, Film, Calendar, Hash, MessageCircle, BarChart3, RefreshCw } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { motion } from "framer-motion";

const automations = [
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
  const [states, setStates] = useState<Record<string, boolean>>(
    Object.fromEntries(automations.map((a) => [a.id, a.defaultActive]))
  );

  const activeCount = Object.values(states).filter(Boolean).length;

  const toggle = (id: string) => {
    setStates((prev) => ({ ...prev, [id]: !prev[id] }));
  };

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
          • {activeCount} de {automations.length} ativas
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {automations.map((auto, i) => {
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
                <Switch checked={isActive} onCheckedChange={() => toggle(auto.id)} />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default Automacoes;
