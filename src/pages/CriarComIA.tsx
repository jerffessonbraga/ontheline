import { useState } from "react";
import { Sparkles, Eye, Film, Image, Circle, LayoutGrid, Heart, MessageCircle, Send, Bookmark } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const postTypes = [
  { id: "reel", label: "REEL", icon: Film },
  { id: "feed", label: "FEED", icon: LayoutGrid },
  { id: "story", label: "STORY", icon: Circle },
  { id: "carrossel", label: "CARROSSEL", icon: Image },
];

const tones = [
  { id: "descontraido", label: "Descontraído", emoji: "😄" },
  { id: "profissional", label: "Profissional", emoji: "💼" },
  { id: "empolgante", label: "Empolgante", emoji: "🔥" },
  { id: "educativo", label: "Educativo", emoji: "🎓" },
  { id: "humoristico", label: "Humorístico", emoji: "😂" },
  { id: "premium", label: "Premium", emoji: "💎" },
];

const CriarComIA = () => {
  const [selectedType, setSelectedType] = useState("reel");
  const [selectedTone, setSelectedTone] = useState("descontraido");
  const [nicho, setNicho] = useState("Gastronomia / Restaurante");
  const [tema, setTema] = useState("");
  const [detalhes, setDetalhes] = useState("");
  const [dataHora, setDataHora] = useState("2026-03-08T02:00");

  return (
    <div className="flex h-[calc(100vh-57px-33px)]">
      {/* Left panel */}
      <div className="w-[440px] border-r border-border overflow-y-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-bold flex items-center gap-2">
            <Sparkles size={20} className="text-primary" />
            Criar com IA
          </h2>
          <span className="text-xs font-bold bg-primary/15 text-primary px-3 py-1 rounded-full">
            ✦ Gemini Free
          </span>
        </div>

        <div className="space-y-2">
          <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Tipo de Postagem</label>
          <div className="grid grid-cols-4 gap-2">
            {postTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all duration-200 ${
                  selectedType === type.id
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-card text-muted-foreground hover:border-muted-foreground"
                }`}
              >
                <type.icon size={22} />
                <span className="text-[11px] font-bold">{type.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Nicho</label>
          <Input
            value={nicho}
            onChange={(e) => setNicho(e.target.value)}
            className="bg-muted border-border"
            placeholder="🏷 Ex: Fitness, Gastronomia..."
          />
        </div>

        <div className="space-y-2">
          <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Tema / Assunto</label>
          <Input
            value={tema}
            onChange={(e) => setTema(e.target.value)}
            className="bg-muted border-border"
            placeholder="Ex: receita fit para café da manhã..."
          />
        </div>

        <div className="space-y-2">
          <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Tom de Voz</label>
          <div className="flex flex-wrap gap-2">
            {tones.map((tone) => (
              <button
                key={tone.id}
                onClick={() => setSelectedTone(tone.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm border transition-all ${
                  selectedTone === tone.id
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:border-muted-foreground"
                }`}
              >
                {tone.emoji} {tone.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Detalhes Extras</label>
          <Textarea
            value={detalhes}
            onChange={(e) => setDetalhes(e.target.value)}
            className="bg-muted border-border min-h-[100px] resize-y"
            placeholder="Promoção, produto, CTA específico..."
          />
        </div>

        <div className="space-y-2">
          <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Agendar Para</label>
          <Input
            type="datetime-local"
            value={dataHora}
            onChange={(e) => setDataHora(e.target.value)}
            className="bg-muted border-border"
          />
        </div>

        <Button className="w-full gradient-button border-0 py-6 text-base font-bold rounded-xl">
          ✦ Gerar com Gemini
        </Button>
      </div>

      {/* Right panel - Preview */}
      <div className="flex-1 flex flex-col items-center justify-start p-8 bg-background">
        <div className="flex items-center gap-2 mb-6 self-start">
          <Eye size={18} className="text-muted-foreground" />
          <h3 className="font-display text-lg font-semibold">Preview</h3>
          <span className="text-xs text-muted-foreground ml-auto">Como aparece no Instagram</span>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-[320px] bg-card border border-border rounded-2xl overflow-hidden"
        >
          {/* Phone header */}
          <div className="flex items-center justify-between px-4 py-2 text-xs text-muted-foreground">
            <span>9:41</span>
            <span>•••</span>
          </div>
          {/* Profile */}
          <div className="flex items-center gap-3 px-4 py-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent" />
            <div>
              <p className="text-sm font-semibold">@seuperfil</p>
              <p className="text-[10px] text-muted-foreground">Agora</p>
            </div>
            <span className="ml-auto text-muted-foreground">•••</span>
          </div>
          {/* Content placeholder */}
          <div className="aspect-square bg-muted flex flex-col items-center justify-center gap-3 text-muted-foreground">
            <LayoutGrid size={32} />
            <p className="text-xs">Preview aqui</p>
          </div>
          {/* Actions */}
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-4">
              <Heart size={20} className="text-destructive" />
              <MessageCircle size={20} />
              <Send size={20} />
            </div>
            <Bookmark size={20} />
          </div>
          <p className="px-4 pb-4 text-xs text-muted-foreground">
            Gere um conteúdo para ver o preview...
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default CriarComIA;
