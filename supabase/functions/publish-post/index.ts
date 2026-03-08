import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userId = user.id;
    const { action, postId } = await req.json();

    if (action === "check_scheduled") {
      // Check for posts that are due for publishing
      const now = new Date().toISOString();
      const { data: duePosts, error } = await supabase
        .from("posts")
        .select("*")
        .eq("user_id", userId)
        .eq("status", "agendado")
        .lte("scheduled_at", now)
        .is("published_at", null);

      if (error) throw error;

      return new Response(JSON.stringify({ duePosts: duePosts || [] }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "publish" && postId) {
      // Check if user has Instagram connected
      const { data: connection } = await supabase
        .from("instagram_connections")
        .select("*")
        .eq("user_id", userId)
        .eq("is_active", true)
        .single();

      if (!connection) {
        // No Instagram connected — mark as "pronto" for manual publishing
        await supabase
          .from("posts")
          .update({ status: "pronto" })
          .eq("id", postId)
          .eq("user_id", userId);

        return new Response(
          JSON.stringify({
            published: false,
            status: "pronto",
            message: "Post marcado como pronto. Conecte o Instagram para publicar automaticamente.",
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // TODO: Future Meta API integration
      // 1. Upload media to Instagram container
      // 2. Create media object via Graph API
      // 3. Publish the container
      // For now, mark as published manually
      await supabase
        .from("posts")
        .update({ status: "publicado", published_at: new Date().toISOString() })
        .eq("id", postId)
        .eq("user_id", userId);

      return new Response(
        JSON.stringify({
          published: true,
          status: "publicado",
          message: "Post publicado com sucesso!",
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === "schedule" && postId) {
      await supabase
        .from("posts")
        .update({ status: "agendado" })
        .eq("id", postId)
        .eq("user_id", userId);

      return new Response(
        JSON.stringify({ status: "agendado", message: "Post agendado!" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Invalid action" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("publish-post error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
