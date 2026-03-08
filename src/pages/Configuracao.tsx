import { useState } from "react";
import { Rocket, CheckCircle2, Instagram, Link2, Shield, Loader2, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const Configuracao = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [connecting, setConnecting] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);

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

  const handleConnectInstagram = async () => {
    setConnecting(true);
    try {
      const redirectUri = `${window.location.origin}/instagram/callback`;
      const { data, error } = await supabase.functions.invoke("instagram-auth", {
        body: { action: "get_auth_url", redirect_uri: redirectUri },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      // Redirect to Facebook OAuth
      window.location.href = data.authUrl;
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Erro ao iniciar conexão com Instagram");
      setConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    setDisconnecting(true);
    try {
      const { data, error } = await supabase.functions.invoke("instagram-auth", {
        body: { action: "disconnect" },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      toast.success("Instagram desconectado");
      queryClient.invalidateQueries({ queryKey: ["instagram_connection"] });
    } catch (err: any) {
      toast.error(err.message || "Erro ao desconectar");
    } finally {
      setDisconnecting(false);
    }
  };

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
          Bem-vindo ao Postei
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
              <h2 className="font-display text-lg font-semibold">Instagram Business</h2>
              {igConnection ? (
                <span className="text-[10px] font-bold bg-success/20 text-success px-2 py-0.5 rounded-full uppercase">
                  Conectado
                </span>
              ) : (
                <span className="text-[10px] font-bold bg-muted text-muted-foreground px-2 py-0.5 rounded-full uppercase">
                  Não conectado
                </span>
              )}
            </div>

            {igConnection ? (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Conectado como <strong className="text-foreground">@{igConnection.instagram_username}</strong>
                </p>
                {igConnection.token_expires_at && (
                  <p className="text-xs text-muted-foreground">
                    Token expira em {new Date(igConnection.token_expires_at).toLocaleDateString("pt-BR")}
                  </p>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDisconnect}
                  disabled={disconnecting}
                  className="text-destructive border-destructive/30 hover:bg-destructive/10"
                >
                  {disconnecting ? <Loader2 size={14} className="mr-2 animate-spin" /> : <LogOut size={14} className="mr-2" />}
                  Desconectar
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Conecte sua conta Business ou Creator para publicar automaticamente posts do tipo Feed e Carrossel.
                </p>

                <Button
                  onClick={handleConnectInstagram}
                  disabled={connecting}
                  className="gradient-button border-0"
                >
                  {connecting ? (
                    <Loader2 size={14} className="mr-2 animate-spin" />
                  ) : (
                    <Instagram size={14} className="mr-2" />
                  )}
                  Conectar Instagram Business
                </Button>

                <div className="p-3 rounded-lg bg-muted/50 border border-border">
                  <h4 className="text-xs font-semibold flex items-center gap-1.5 mb-2">
                    <Shield size={12} className="text-muted-foreground" />
                    Requisitos
                  </h4>
                  <ul className="text-[11px] text-muted-foreground space-y-1">
                    <li>▸ Conta Business ou Creator no Instagram</li>
                    <li>▸ Página do Facebook vinculada ao Instagram</li>
                    <li>▸ Facebook App configurado (App ID + App Secret)</li>
                  </ul>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-start gap-2 p-3 rounded-lg bg-success/5 border border-success/20">
                    <span className="text-success mt-0.5">✓</span>
                    <div>
                      <p className="text-xs font-semibold">Feed & Carrossel</p>
                      <p className="text-[10px] text-muted-foreground">Publicação automática</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 p-3 rounded-lg bg-warning/5 border border-warning/20">
                    <span className="text-warning mt-0.5">⚠</span>
                    <div>
                      <p className="text-xs font-semibold">Reels & Stories</p>
                      <p className="text-[10px] text-muted-foreground">Não suportado pela Meta API</p>
                    </div>
                  </div>
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
        <div className="flex items-center gap-2 text-sm flex-wrap">
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
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-success/10 text-success font-medium">
            <span>4. Publicar ✓</span>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          {igConnection
            ? "Instagram conectado — posts do tipo Feed e Carrossel serão publicados automaticamente."
            : "Conecte o Instagram acima para habilitar a publicação automática."}
        </p>
      </motion.div>

      {/* Como funciona */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card p-8 space-y-8"
      >
        <h2 className="font-display text-xl font-bold uppercase tracking-wider flex items-center gap-3">
          <Instagram size={22} className="text-accent" />
          Como a publicação automática funciona
        </h2>

        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-9 h-9 rounded-full bg-destructive/15 flex items-center justify-center shrink-0 text-sm font-bold text-destructive">A</div>
            <div>
              <h3 className="text-base font-semibold">Conta Business/Creator (obrigatório)</h3>
              <p className="text-sm text-muted-foreground mt-1.5">
                A API do Instagram só funciona com contas Profissionais. Vá em Configurações → Conta → Mudar para conta Profissional. Gratuito, não muda seu conteúdo.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-9 h-9 rounded-full bg-warning/15 flex items-center justify-center shrink-0 text-sm font-bold text-warning">B</div>
            <div>
              <h3 className="text-base font-semibold">O que publica automaticamente</h3>
              <div className="flex flex-wrap gap-2.5 mt-2">
                <span className="text-xs px-2.5 py-1 rounded-full bg-success/15 text-success font-medium">✓ Feed (foto/vídeo)</span>
                <span className="text-xs px-2.5 py-1 rounded-full bg-success/15 text-success font-medium">✓ Carrossel até 10 imagens</span>
                <span className="text-xs px-2.5 py-1 rounded-full bg-warning/15 text-warning font-medium">⚠ Reels (limitado)</span>
                <span className="text-xs px-2.5 py-1 rounded-full bg-muted text-muted-foreground font-medium">✗ Stories</span>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center shrink-0 text-sm font-bold text-primary">C</div>
            <div>
              <h3 className="text-base font-semibold">Publicação 100% automática</h3>
              <p className="text-sm text-muted-foreground mt-1.5">
                O Postei agenda e publica automaticamente via backend — sem precisar abrir o app na hora marcada.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-9 h-9 rounded-full bg-accent/15 flex items-center justify-center shrink-0 text-sm font-bold text-accent">D</div>
            <div>
              <h3 className="text-base font-semibold">Fluxo atual do Postei</h3>
              <p className="text-sm text-muted-foreground mt-1.5">
                IA gera conteúdo → você aprova → Postei agenda → na hora certa chama a API do Instagram e publica. Simples assim.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Configuracao;
