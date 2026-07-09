// @ts-nocheck
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing Supabase environment variables");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: invoices, error: invoiceError } = await supabase
      .from("invoices")
      .select("*, profiles(email)")
      .eq("status", "Unpaid");

    if (invoiceError) throw invoiceError;
    if (!invoices || invoices.length === 0) {
      return new Response(
        JSON.stringify({ message: "Tidak ada tagihan Unpaid." }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) throw new Error("Missing Resend API Key");

    let sentCount = 0;

    for (const rawInvoice of invoices) {
      const invoice = rawInvoice as any;
      const clientEmail = invoice.profiles?.email || "customer@example.com"; 
      
      const emailHtml = `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2 style="color: #155b96;">Peringatan Tagihan: ${invoice.serial}</h2>
          <p>Yth. ${invoice.fullname},</p>
          <p>Ini adalah pengingat otomatis bahwa Anda memiliki tagihan internet yang belum dibayar sebesar <strong>Rp ${Number(invoice.amount).toLocaleString("id-ID")}</strong>.</p>
          <p>Jatuh Tempo: ${invoice.due_date ? new Date(invoice.due_date).toLocaleDateString("id-ID") : '-'}</p>
          <p>Harap segera melakukan pembayaran agar layanan internet Anda tidak terganggu.</p>
          <br/>
          <p>Terima kasih,</p>
          <p><strong>DJ Internet Management System</strong></p>
        </div>
      `;

      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: "Billing DJ IMS <billing@resend.dev>",
          to: [clientEmail],
          subject: `Tagihan Belum Dibayar: ${invoice.serial}`,
          html: emailHtml,
        }),
      });

      if (res.ok) sentCount++;
    }

    return new Response(
      JSON.stringify({ message: `Berhasil mengirim ${sentCount} email peringatan.` }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    const err = error as Error;
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
