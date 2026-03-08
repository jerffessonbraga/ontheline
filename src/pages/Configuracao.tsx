import { useState } from "react";
import { AlertTriangle, X, Rocket, Key, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";

const Configuracao = () => {
  const [showWarning, setShowWarning] = useState(true);
  const [apiKey, setApiKey] = useState("");

  return (
    <div className="max-w-3xl mx-auto px-6 py-8 pb-20 space-y-8">
      <AnimatePresence>
        {showWarning && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="glass-card p-5 border-warning/30"
          >
            <div className="flex gap-3">
              <AlertTriangle className="text-warning shrink-0 mt-0.5" size={20} />
              <div className="space-y-2 flex-1">
                <h3 className="font-display font-semibold text-warning">
                  Para a IA funcionar: baixe e abra localmente
                </h3>
                <p className="text-sm text-muted-foreground">
                  O Claude.ai bloqueia chamadas a APIs externas. Siga estes passos:
                </p>
                <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                  <li>Clique em <strong>⬇ Download / Baixar</strong> no topo direito do preview</li>
                  <li>Salve o arquivo <code className="bg-muted px-1.5 py-0.5 rounded text-xs">instaflow.html</code></li>
                  <li>Abra no <strong>Chrome ou Edge</strong> do seu PC</li>
                  <li>Cole a chave Gemini → Testar → funciona! 🚀</li>
                </ol>
              </div>
              <button onClick={() => setShowWarning(false)} className="text-muted-foreground hover:text-foreground shrink-0">
                <X size={18} />
              </button>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowWarning(false)}
              className="mt-3 ml-8 border-border text-muted-foreground hover:text-foreground"
            >
              <X size={14} className="mr-1" />
              Fechar
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-8 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-primary/5 blur-3xl" />
        <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider bg-primary/15 text-primary px-3 py-1.5 rounded-full mb-4">
          <Rocket size={12} />
          Versão Gratuita
        </span>
        <h1 className="font-display text-3xl font-bold gradient-text mb-3">
          Bem-vindo ao InstaFlow
        </h1>
        <p className="text-muted-foreground max-w-lg">
          Automação inteligente para o seu Instagram, usando Gemini AI do Google — 100% gratuito. Configure em 2 minutos e comece a criar conteúdo profissional.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-6"
      >
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center text-primary font-display font-bold shrink-0">
            1
          </div>
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-3">
              <Key size={18} className="text-primary" />
              <h2 className="font-display text-lg font-semibold">API Gemini (Google)</h2>
              <span className="text-[10px] font-bold bg-success/20 text-success px-2 py-0.5 rounded-full uppercase">
                Grátis
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              O Gemini 1.5 Flash tem <strong className="text-foreground">15 req/minuto</strong> e{" "}
              <strong className="text-foreground">1 milhão de tokens/dia</strong> sem pagar nada. Mais do que suficiente para dezenas de posts por dia.
            </p>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li className="flex items-center gap-2">
                <span className="text-primary">▸</span>
                Acesse{" "}
                <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener" className="text-primary hover:underline font-medium">
                  aistudio.google.com/apikey
                  <ExternalLink size={12} className="inline ml-1" />
                </a>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">▸</span>
                Faça login com sua conta Google
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">▸</span>
                Clique em <strong className="text-foreground">"Create API Key"</strong> e copie
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">▸</span>
                Cole abaixo e clique em Testar
              </li>
            </ul>
            <div className="flex gap-3">
              <Input
                placeholder="AIzaSy..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="bg-muted border-border text-foreground placeholder:text-muted-foreground"
              />
              <Button className="gradient-button border-0 shrink-0">
                ▶ Testar
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Configuracao;
