export interface StripeInitParams {
  amount: number; // in USD dollars
  currency: string;
  email: string;
  txRef: string;
  donorName: string;
}

export interface StripeInitResponse {
  status: "success" | "failed";
  message: string;
  checkoutUrl?: string;
  sessionId?: string;
}

export function isStripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY.trim() !== "");
}

export async function initializeStripeCheckout(
  params: StripeInitParams
): Promise<StripeInitResponse> {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error("STRIPE_SECRET_KEY is not configured in environment variables.");
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const unitAmountInCents = Math.round(params.amount * 100);

  const bodyData = new URLSearchParams();
  bodyData.append("payment_method_types[0]", "card");
  bodyData.append("mode", "payment");
  bodyData.append("customer_email", params.email);
  bodyData.append("client_reference_id", params.txRef);
  bodyData.append("line_items[0][price_data][currency]", params.currency.toLowerCase());
  bodyData.append(
    "line_items[0][price_data][product_data][name]",
    "Shega Generations - Talent Fund Donation"
  );
  bodyData.append(
    "line_items[0][price_data][product_data][description]",
    `Donation by ${params.donorName}`
  );
  bodyData.append("line_items[0][price_data][unit_amount]", unitAmountInCents.toString());
  bodyData.append("line_items[0][quantity]", "1");
  bodyData.append(
    "success_url",
    `${appUrl}/donate/success?tx_ref=${encodeURIComponent(params.txRef)}&gateway=stripe&session_id={CHECKOUT_SESSION_ID}`
  );
  bodyData.append("cancel_url", `${appUrl}/donate`);

  try {
    const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: bodyData.toString(),
    });

    const data = await res.json();
    if (res.ok && data.url) {
      return {
        status: "success",
        message: "Stripe session created successfully",
        checkoutUrl: data.url,
        sessionId: data.id,
      };
    }

    return {
      status: "failed",
      message: data.error?.message || "Stripe checkout session initialization failed",
    };
  } catch (err: unknown) {
    return {
      status: "failed",
      message: err instanceof Error ? err.message : "Network error contacting Stripe API",
    };
  }
}

export async function verifyStripeSession(sessionId: string) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error("STRIPE_SECRET_KEY is not configured.");
  }

  try {
    const res = await fetch(`https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(sessionId)}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${secretKey}`,
      },
    });

    const data = await res.json();
    if (res.ok) {
      return {
        status: "success" as const,
        paid: data.payment_status === "paid",
        txRef: data.client_reference_id as string,
        customerEmail: data.customer_details?.email || data.customer_email,
      };
    }
    return { status: "failed" as const, paid: false, txRef: null, customerEmail: null };
  } catch {
    return { status: "failed" as const, paid: false, txRef: null, customerEmail: null };
  }
}
