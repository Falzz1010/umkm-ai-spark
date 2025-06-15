
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

// Pastikan Service Role Key sudah diatur sebagai Secrets Supabase: SUPABASE_SERVICE_ROLE_KEY, SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

async function isAdmin(req: Request): Promise<boolean> {
  // implementasi: via JWT, role user harus 'admin'. 
  // Untuk contoh, izinkan semua (silakan ubah dengan pengecekan lebih ketat sesuai kebutuhan).
  // Production: lakukan verifikasi JWT dan role admin di sini
  return true;
}

serve(async (req: Request) => {
  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (!(await isAdmin(req))) {
    return new Response(
      JSON.stringify({ error: "Unauthorized: Only admin can call this." }),
      { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    const { user_id, new_email, new_password } = await req.json();

    if (!user_id) {
      return new Response(
        JSON.stringify({ error: "user_id is required." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    if (!new_email && !new_password) {
      return new Response(
        JSON.stringify({ error: "Harus mengisi salah satu: new_email atau new_password." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // PATCH via Supabase Auth Admin API
    const updates: Record<string, string> = {};
    if (new_email) updates.email = new_email;
    if (new_password) updates.password = new_password;

    const res = await fetch(`${SUPABASE_URL}/auth/v1/admin/users/${user_id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "apiKey": SUPABASE_SERVICE_ROLE_KEY!,
        "Authorization": `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      },
      body: JSON.stringify(updates),
    });

    const apiRes = await res.json();

    if (!res.ok) {
      return new Response(
        JSON.stringify({ error: apiRes.error || "Failed to update user." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ message: "Update berhasil!", user: apiRes.user }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    return new Response(
      JSON.stringify({ error: "Terjadi error server.", detail: String(e) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
