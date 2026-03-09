import { NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

function verifySignature({ orderId, paymentId, signature, secret }) {
  const payload = `${orderId}|${paymentId}`;
  const expected = crypto.createHmac("sha256", secret).update(payload).digest("hex");
  return expected === signature;
}

async function storePaymentRecord({ orderId, paymentId, metadata }) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return { saved: false, reason: "missing-supabase-service-role-config" };
  }

  const adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false }
  });

  const payload = {
    razorpay_order_id: orderId,
    razorpay_payment_id: paymentId,
    payment_status: "success",
    business_id: metadata?.businessId || null,
    business_slug: metadata?.businessSlug || null,
    product_id: metadata?.productId || null,
    product_name: metadata?.productName || null,
    amount: metadata?.amount || null,
    currency: metadata?.currency || "INR",
    customer_name: metadata?.customerName || null,
    customer_email: metadata?.customerEmail || null,
    customer_phone: metadata?.customerPhone || null,
    gateway_response: metadata?.gatewayResponse || null
  };

  const { error } = await adminClient.from("payments").insert(payload);
  if (error) {
    console.error("Payment log save error:", error);
    return { saved: false, reason: error.message || "save-failed" };
  }

  return { saved: true };
}

export async function POST(request) {
  try {
    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      return NextResponse.json(
        { error: "Missing Razorpay env var. Set RAZORPAY_KEY_SECRET." },
        { status: 500 }
      );
    }

    const body = await request.json();
    const orderId = String(body?.razorpay_order_id || "");
    const paymentId = String(body?.razorpay_payment_id || "");
    const signature = String(body?.razorpay_signature || "");
    const metadata = body?.metadata || {};

    if (!orderId || !paymentId || !signature) {
      return NextResponse.json({ error: "Missing payment verification fields." }, { status: 400 });
    }

    const isValid = verifySignature({ orderId, paymentId, signature, secret });

    if (!isValid) {
      return NextResponse.json({ verified: false, error: "Signature verification failed." }, { status: 400 });
    }

    const saveResult = await storePaymentRecord({
      orderId,
      paymentId,
      metadata: {
        ...metadata,
        gatewayResponse: {
          razorpay_order_id: orderId,
          razorpay_payment_id: paymentId
        }
      }
    });

    return NextResponse.json({
      verified: true,
      paymentId,
      orderId,
      paymentSaved: saveResult.saved,
      paymentSaveReason: saveResult.saved ? null : saveResult.reason
    });
  } catch (error) {
    console.error("Razorpay verify error:", error);
    return NextResponse.json({ error: "Unable to verify payment." }, { status: 500 });
  }
}
