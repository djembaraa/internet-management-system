// @ts-nocheck
import { createClient } from "npm:@supabase/supabase-js@2";
import nodemailer from "npm:nodemailer";

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

    // Gmail SMTP credentials
    const GMAIL_USER = Deno.env.get("GMAIL_USER");
    const GMAIL_APP_PASSWORD = Deno.env.get("GMAIL_APP_PASSWORD");

    if (!GMAIL_USER || !GMAIL_APP_PASSWORD) {
      throw new Error("Missing Gmail credentials (GMAIL_USER or GMAIL_APP_PASSWORD)");
    }

    // Setup Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: GMAIL_USER,
        pass: GMAIL_APP_PASSWORD,
      },
    });

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

      try {
        await transporter.sendMail({
          from: `"Billing DJ IMS" <${GMAIL_USER}>`,
          to: clientEmail,
          subject: `Tagihan Belum Dibayar: ${invoice.serial}`,
          html: emailHtml,
        });
        sentCount++;
      } catch (err) {
        console.error("Gagal mengirim email ke", clientEmail, err);
      }
    }

    return new Response(
      JSON.stringify({ message: `Berhasil mengirim ${sentCount} email peringatan via Gmail.` }),
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
