import { useState } from "react";
import { Sparkles, Eye, Film, Image, Circle, LayoutGrid, Heart, MessageCircle, Send, Bookmark, Loader2, Save, Calendar } from "lucide-react";
import MediaUpload from "@/components/MediaUpload";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useQueryClient } from "@tanstack/react-query";
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
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedType, setSelectedType] = useState("reel");
  const [selectedTone, setSelectedTone] = useState("descontraido");
  const [nicho, setNicho] = useState("Gastronomia / Restaurante");
  const [tema, setTema] = useState("");
  const [detalhes, setDetalhes] = useState("");
  const [dataHora, setDataHora] = useState("2026-03-08T02:00");
  const [generatedContent, setGeneratedContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = async (schedule = false) => {
    if (!generatedContent || !user) return;
    try {
      const { error } = await supabase.from("posts").insert({
        user_id: user.id,
        post_type: selectedType,
        nicho,
        tema: tema || null,
        tom: selectedTone,
        detalhes: detalhes || null,
        generated_content: generatedContent,
        scheduled_at: dataHora ? new Date(dataHora).toISOString() : null,
        status: schedule ? "agendado" : "rascunho",
      });
      if (error) throw error;
      setIsSaved(true);
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success(schedule ? "Post agendado! 📅" : "Post salvo no histórico! 📋");
    } catch (e: any) {
      toast.error(e.message || "Erro ao salvar post");
    }
  };

  const handleGenerate = async () => {
    if (!nicho.trim()) {
      toast.error("Preencha o nicho antes de gerar.");
      return;
    }

    setIsGenerating(true);
    setGeneratedContent("");
    setIsSaved(false);

    const toneName = tones.find((t) => t.id === selectedTone)?.label || selectedTone;
    const typeName = postTypes.find((t) => t.id === selectedType)?.label || selectedType;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-content`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            postType: typeName,
            nicho,
            tema,
            tom: toneName,
            detalhes,
          }),
        }
      );

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        if (response.status === 429) {
          toast.error("Limite de requisições. Aguarde alguns segundos.");
        } else if (response.status === 402) {
          toast.error("Créditos insuficientes. Adicione créditos no workspace.");
        } else {
          toast.error(err.error || "Erro ao gerar conteúdo.");
        }
        setIsGenerating(false);
        return;
      }

      if (!response.body) throw new Error("No stream");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";
      let contentSoFar = "";
      let streamDone = false;

      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") {
            streamDone = true;
            break;
          }

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              contentSoFar += content;
              setGeneratedContent(contentSoFar);
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }

      // flush remaining
      if (textBuffer.trim()) {
        for (let raw of textBuffer.split("\n")) {
          if (!raw) continue;
          if (raw.endsWith("\r")) raw = raw.slice(0, -1);
          if (raw.startsWith(":") || raw.trim() === "") continue;
          if (!raw.startsWith("data: ")) continue;
          const jsonStr = raw.slice(6).trim();
          if (jsonStr === "[DONE]") continue;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              contentSoFar += content;
              setGeneratedContent(contentSoFar);
            }
          } catch { /* ignore */ }
        }
      }

      toast.success("Conteúdo gerado com sucesso! ✨");
    } catch (e) {
      console.error(e);
      toast.error("Erro ao conectar com a IA.");
    } finally {
      setIsGenerating(false);
    }
  };

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

        <Button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full gradient-button border-0 py-6 text-base font-bold rounded-xl disabled:opacity-60"
        >
          {isGenerating ? (
            <>
              <Loader2 size={18} className="mr-2 animate-spin" />
              Gerando...
            </>
          ) : (
            "✦ Gerar com Gemini"
          )}
        </Button>

        {generatedContent && !isGenerating && (
          <div className="flex gap-2 w-full">
            <Button
              onClick={() => handleSave(false)}
              disabled={isSaved}
              variant="outline"
              className="flex-1 py-5 text-sm font-bold rounded-xl"
            >
              <Save size={16} className="mr-2" />
              {isSaved ? "✓ Salvo" : "Salvar Rascunho"}
            </Button>
            <Button
              onClick={() => handleSave(true)}
              disabled={isSaved}
              className="flex-1 gradient-button border-0 py-5 text-sm font-bold rounded-xl"
            >
              <Calendar size={16} className="mr-2" />
              {isSaved ? "✓ Agendado" : "Salvar e Agendar"}
            </Button>
          </div>
        )}
      </div>

      {/* Right panel - Preview */}
      <div className="flex-1 flex flex-col p-8 bg-background overflow-y-auto">
        <div className="flex items-center gap-2 mb-6">
          <Eye size={18} className="text-muted-foreground" />
          <h3 className="font-display text-lg font-semibold">Preview</h3>
          <span className="text-xs text-muted-foreground ml-auto">Como aparece no Instagram</span>
        </div>

        <div className="flex flex-col items-center gap-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-[320px] bg-card border border-border rounded-2xl overflow-hidden shrink-0"
          >
            <div className="flex items-center justify-between px-4 py-2 text-xs text-muted-foreground">
              <span>9:41</span>
              <span>•••</span>
            </div>
            <div className="flex items-center gap-3 px-4 py-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent" />
              <div>
                <p className="text-sm font-semibold">@seuperfil</p>
                <p className="text-[10px] text-muted-foreground">Agora</p>
              </div>
              <span className="ml-auto text-muted-foreground">•••</span>
            </div>
            <div className="aspect-square bg-muted flex flex-col items-center justify-center gap-3 text-muted-foreground">
              {isGenerating ? (
                <Loader2 size={32} className="animate-spin text-primary" />
              ) : (
                <>
                  <LayoutGrid size={32} />
                  <p className="text-xs">Preview aqui</p>
                </>
              )}
            </div>
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-4">
                <Heart size={20} className="text-destructive" />
                <MessageCircle size={20} />
                <Send size={20} />
              </div>
              <Bookmark size={20} />
            </div>
            <p className="px-4 pb-4 text-xs text-muted-foreground">
              {generatedContent
                ? generatedContent.slice(0, 120) + (generatedContent.length > 120 ? "..." : "")
                : "Gere um conteúdo para ver o preview..."}
            </p>
          </motion.div>

          {generatedContent && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full max-w-2xl glass-card p-6"
            >
              <h4 className="font-display font-semibold mb-3 flex items-center gap-2">
                <Sparkles size={16} className="text-primary" />
                Conteúdo Gerado
              </h4>
              <div className="text-sm text-secondary-foreground whitespace-pre-wrap leading-relaxed">
                {generatedContent}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CriarComIA;
