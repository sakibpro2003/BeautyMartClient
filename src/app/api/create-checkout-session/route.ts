import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";

type CheckoutItem = {
  name: string;
  price: number;
  quantity: number;
  image?: string;
};

export async function POST(req: NextRequest) {
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    return NextResponse.json({ message: "Stripe secret key missing" }, { status: 500 });
  }

  const stripe = new Stripe(secretKey, {
    apiVersion: "2022-11-15",
  });

  try {
    const body = await req.json();
    const { items, successUrl, cancelUrl, address, paymentMethod, customerEmail } = body;

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ message: "No items provided" }, { status: 400 });
    }

    const origin = req.headers.get("origin") || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: (items as CheckoutItem[]).map((item) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
            ...(item.image ? { images: [item.image] } : {}),
          },
          unit_amount: Math.max(50, Math.round(Number(item.price || 0) * 100)),
        },
        quantity: item.quantity || 1,
      })),
      success_url: successUrl || `${origin}/cart?status=success`,
      cancel_url: cancelUrl || `${origin}/cart?status=cancelled`,
      customer_email: customerEmail || undefined,
      metadata: {
        address: address || "",
        paymentMethod: paymentMethod || "card",
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Stripe session error", error);
    return NextResponse.json(
      { message: error?.message || "Unable to create checkout session" },
      { status: 500 },
    );
  }
}
