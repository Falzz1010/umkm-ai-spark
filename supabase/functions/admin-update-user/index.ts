
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
    console.log("Unauthorized: Only admin can call this.");
    return new Response(
      JSON.stringify({ error: "Unauthorized: Only admin can call this." }),
      { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    const { user_id, new_email, new_password } = await req.json();

    console.log("Received request. user_id:", user_id, "new_email:", new_email, "new_password:", Boolean(new_password));

    if (!user_id) {
      console.log("Request error: user_id is required.");
      return new Response(
        JSON.stringify({ error: "user_id is required." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    if (!new_email && !new_password) {
      console.log("Request error: Harus mengisi salah satu: new_email atau new_password.");
      return new Response(
        JSON.stringify({ error: "Harus mengisi salah satu: new_email atau new_password." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // PATCH via Supabase Auth Admin API
    const updates: Record<string, string> = {};
    if (new_email) updates.email = new_email;
    if (new_password) updates.password = new_password;

    console.log("PATCH request payload:", updates);

    const res = await fetch(`${SUPABASE_URL}/auth/v1/admin/users/${user_id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "apiKey": SUPABASE_SERVICE_ROLE_KEY!,
        "Authorization": `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      },
      body: JSON.stringify(updates),
    });

    let bodyText = await res.text();
    console.log("PATCH response status:", res.status, "body:", bodyText);

    let apiRes: any;
    try {
      apiRes = JSON.parse(bodyText);
    } catch (_) {
      apiRes = { error: "Invalid JSON response", body: bodyText };
    }

    if (!res.ok) {
      return new Response(
        JSON.stringify({ error: apiRes.error || "Failed to update user.", body: apiRes.body || bodyText }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ message: "Update berhasil!", user: apiRes.user }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.log("Server error:", String(e));
    return new Response(
      JSON.stringify({ error: "Terjadi error server.", detail: String(e) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
