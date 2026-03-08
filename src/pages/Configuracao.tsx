import { useState } from "react";
import { AlertTriangle, X, Rocket, Key, ExternalLink, Instagram, CheckCircle2, Link2, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const Configuracao = () => {
  const { user } = useAuth();
  const [showWarning, setShowWarning] = useState(false);

  const { data: igConnection } = useQuery({
    queryKey: ["instagram_connection", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("instagram_connections")
        .select("*")
        .eq("is_active", true)
        .maybeSingle();
      return data;
    },
    enabled: !!user,
  });

  return (
    <div className="max-w-3xl mx-auto px-6 py-8 pb-20 space-y-8">
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
          Copiloto de conteúdo para Instagram com IA. Gere, agende e publique — tudo em um só lugar.
        </p>
      </motion.div>

      {/* AI Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="glass-card p-6"
      >
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-success/15 flex items-center justify-center shrink-0">
            <CheckCircle2 size={20} className="text-success" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h2 className="font-display text-lg font-semibold">Gemini AI</h2>
              <span className="text-[10px] font-bold bg-success/20 text-success px-2 py-0.5 rounded-full uppercase">
                Ativo
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              IA integrada via Lovable Cloud — sem necessidade de chave API. Pronto para gerar conteúdo.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Instagram Integration */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-6"
      >
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-accent/15 flex items-center justify-center shrink-0">
            <Instagram size={20} className="text-accent" />
          </div>
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-3">
              <h2 className="font-display text-lg font-semibold">Instagram</h2>
              {igConnection ? (
                <span className="text-[10px] font-bold bg-success/20 text-success px-2 py-0.5 rounded-full uppercase">
                  Conectado
                </span>
              ) : (
                <span className="text-[10px] font-bold bg-warning/20 text-warning px-2 py-0.5 rounded-full uppercase">
                  Em breve
                </span>
              )}
            </div>

            {igConnection ? (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Conectado como <strong className="text-foreground">@{igConnection.instagram_username}</strong>
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  A publicação automática via Meta Graph API está sendo preparada. Por enquanto, o InstaFlow funciona como copiloto:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="flex items-start gap-2 p-3 rounded-lg bg-secondary/50">
                    <span className="text-primary mt-0.5">✦</span>
                    <div>
                      <p className="text-xs font-semibold">Gerar</p>
                      <p className="text-[10px] text-muted-foreground">IA cria o conteúdo</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 p-3 rounded-lg bg-secondary/50">
                    <span className="text-primary mt-0.5">✦</span>
                    <div>
                      <p className="text-xs font-semibold">Agendar</p>
                      <p className="text-[10px] text-muted-foreground">Calendário visual</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 p-3 rounded-lg bg-secondary/50">
                    <span className="text-primary mt-0.5">✦</span>
                    <div>
                      <p className="text-xs font-semibold">Lembrete</p>
                      <p className="text-[10px] text-muted-foreground">Notifica na hora</p>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-muted/50 border border-border">
                  <h4 className="text-xs font-semibold flex items-center gap-1.5 mb-2">
                    <Shield size={12} className="text-muted-foreground" />
                    Requisitos para publicação automática
                  </h4>
                  <ul className="text-[11px] text-muted-foreground space-y-1">
                    <li>▸ Conta Business ou Creator no Instagram</li>
                    <li>▸ Página do Facebook vinculada</li>
                    <li>▸ App aprovado pela Meta (em processo)</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Status Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="glass-card p-6"
      >
        <h2 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
          <Link2 size={18} className="text-primary" />
          Fluxo de Publicação
        </h2>
        <div className="flex items-center gap-2 text-sm">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 text-primary font-medium">
            <span>1. Criar com IA</span>
          </div>
          <span className="text-muted-foreground">→</span>
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 text-primary font-medium">
            <span>2. Salvar</span>
          </div>
          <span className="text-muted-foreground">→</span>
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 text-primary font-medium">
            <span>3. Agendar</span>
          </div>
          <span className="text-muted-foreground">→</span>
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-warning/10 text-warning font-medium">
            <span>4. Publicar</span>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          Quando a integração com a Meta API estiver ativa, o passo 4 será automático.
        </p>
      </motion.div>
    </div>
  );
};

export default Configuracao;
