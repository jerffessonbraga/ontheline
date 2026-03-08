import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { History, Trash2, Copy, Eye, Loader2, Search, Film, LayoutGrid, Circle, Image } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const typeIcons: Record<string, any> = {
  reel: Film,
  feed: LayoutGrid,
  story: Circle,
  carrossel: Image,
};

const Historico = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [selectedPost, setSelectedPost] = useState<any>(null);

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["posts", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("posts").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("Post excluído!");
      if (selectedPost) setSelectedPost(null);
    },
  });

  const filtered = posts.filter(
    (p: any) =>
      p.generated_content?.toLowerCase().includes(search.toLowerCase()) ||
      p.nicho?.toLowerCase().includes(search.toLowerCase()) ||
      p.tema?.toLowerCase().includes(search.toLowerCase())
  );

  const copyContent = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success("Conteúdo copiado! 📋");
  };

  return (
    <div className="flex h-[calc(100vh-57px-33px)]">
      {/* List */}
      <div className="w-[440px] border-r border-border overflow-y-auto p-6 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <History size={20} className="text-primary" />
          <h2 className="font-display text-xl font-bold">Histórico</h2>
          <span className="text-xs text-muted-foreground ml-auto">{filtered.length} posts</span>
        </div>

        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por nicho, tema ou conteúdo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-muted border-border"
          />
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 size={24} className="animate-spin text-primary" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <History size={32} className="mx-auto mb-3 opacity-50" />
            <p className="text-sm">Nenhum post encontrado</p>
            <p className="text-xs mt-1">Gere conteúdo na aba "Criar com IA"</p>
          </div>
        ) : (
          <div className="space-y-2">
            <AnimatePresence>
              {filtered.map((post: any) => {
                const TypeIcon = typeIcons[post.post_type] || LayoutGrid;
                return (
                  <motion.button
                    key={post.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setSelectedPost(post)}
                    className={`w-full text-left p-4 rounded-xl border transition-all ${
                      selectedPost?.id === post.id
                        ? "border-primary bg-primary/10"
                        : "border-border bg-card hover:border-muted-foreground"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <TypeIcon size={14} className="text-primary" />
                      <span className="text-xs font-bold uppercase text-primary">{post.post_type}</span>
                      <span className="text-[10px] text-muted-foreground ml-auto">
                        {format(new Date(post.created_at), "dd MMM yyyy, HH:mm", { locale: ptBR })}
                      </span>
                    </div>
                    <p className="text-sm font-medium truncate">{post.nicho}</p>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">
                      {post.generated_content?.slice(0, 80)}...
                    </p>
                  </motion.button>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Detail */}
      <div className="flex-1 overflow-y-auto p-8 bg-background">
        {selectedPost ? (
          <motion.div
            key={selectedPost.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-2xl mx-auto space-y-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-lg font-bold">{selectedPost.nicho}</h3>
                <p className="text-sm text-muted-foreground">
                  {selectedPost.tema || "Tema livre"} · Tom: {selectedPost.tom}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyContent(selectedPost.generated_content)}
                >
                  <Copy size={14} className="mr-1" /> Copiar
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-destructive hover:text-destructive"
                  onClick={() => deleteMutation.mutate(selectedPost.id)}
                >
                  <Trash2 size={14} className="mr-1" /> Excluir
                </Button>
              </div>
            </div>

            <div className="glass-card p-6">
              <div className="text-sm whitespace-pre-wrap leading-relaxed text-secondary-foreground">
                {selectedPost.generated_content}
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <Eye size={40} className="mb-3 opacity-50" />
            <p className="text-sm">Selecione um post para visualizar</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Historico;
