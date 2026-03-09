import { NextResponse } from "next/server";
import Razorpay from "razorpay";

function normalizeAmount(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return null;
  return Math.round(parsed * 100);
}

export async function POST(request) {
  try {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return NextResponse.json(
        { error: "Missing Razorpay env vars. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET." },
        { status: 500 }
      );
    }

    const body = await request.json();
    const product = body?.product || {};
    const business = body?.business || {};
    const customer = body?.customer || {};

    const amountInPaise = normalizeAmount(product.price);
    if (!amountInPaise) {
      return NextResponse.json({ error: "Invalid product price." }, { status: 400 });
    }

    const instance = new Razorpay({
      key_id: keyId,
      key_secret: keySecret
    });

    const order = await instance.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
      notes: {
        businessId: String(business.id || ""),
        businessSlug: String(business.slug || ""),
        businessName: String(business.name || ""),
        productId: String(product.id || ""),
        productName: String(product.name || ""),
        customerName: String(customer.name || ""),
        customerEmail: String(customer.email || ""),
        customerPhone: String(customer.phone || "")
      }
    });

    return NextResponse.json({
      keyId,
      order,
      customer: {
        name: String(customer.name || ""),
        email: String(customer.email || ""),
        contact: String(customer.phone || "")
      }
    });
  } catch (error) {
    console.error("Razorpay create-order error:", error);
    return NextResponse.json({ error: "Unable to create Razorpay order." }, { status: 500 });
  }
}
