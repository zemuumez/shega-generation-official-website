export interface ChapaInitParams {
  amount: number;
  currency: "ETB" | "USD";
  email: string;
  firstName: string;
  lastName: string;
  txRef: string;
  callbackUrl?: string;
  returnUrl?: string;
  title?: string;
  description?: string;
}

export interface ChapaInitResponse {
  status: "success" | "failed";
  message: string;
  checkoutUrl?: string;
}

export interface ChapaVerifyResponse {
  status: "success" | "failed";
  message: string;
  data?: {
    status: "success" | "pending" | "failed";
    tx_ref: string;
    amount: number;
    currency: string;
    email: string;
  };
}

export function isChapaConfigured(): boolean {
  return Boolean(process.env.CHAPA_SECRET_KEY && process.env.CHAPA_SECRET_KEY.trim() !== "");
}

export async function initializeChapaTransaction(
  params: ChapaInitParams
): Promise<ChapaInitResponse> {
  const secretKey = process.env.CHAPA_SECRET_KEY;
  if (!secretKey) {
    throw new Error("CHAPA_SECRET_KEY is not configured in environment variables.");
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const payload = {
    amount: params.amount,
    currency: params.currency,
    email: params.email,
    first_name: params.firstName,
    last_name: params.lastName,
    tx_ref: params.txRef,
    callback_url: params.callbackUrl || `${appUrl}/api/payments/webhook`,
    return_url: params.returnUrl || `${appUrl}/donate/success?tx_ref=${encodeURIComponent(params.txRef)}&gateway=chapa`,
    customization: {
      title: params.title || "Shega Generations Donation",
      description: params.description || "Empowering tech & creative talent in Ethiopia",
    },
  };

  try {
    const res = await fetch("https://api.chapa.co/v1/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (res.ok && data.status === "success" && data.data?.checkout_url) {
      return {
        status: "success",
        message: data.message || "Initialization successful",
        checkoutUrl: data.data.checkout_url,
      };
    }

    return {
      status: "failed",
      message: data.message || "Chapa transaction initialization failed",
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Network error contacting Chapa API";
    return {
      status: "failed",
      message: errorMsg,
    };
  }
}

export async function verifyChapaTransaction(txRef: string): Promise<ChapaVerifyResponse> {
  const secretKey = process.env.CHAPA_SECRET_KEY;
  if (!secretKey) {
    throw new Error("CHAPA_SECRET_KEY is not configured.");
  }

  try {
    const res = await fetch(`https://api.chapa.co/v1/transaction/verify/${encodeURIComponent(txRef)}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${secretKey}`,
      },
    });

    const data = await res.json();
    return {
      status: res.ok && data.status === "success" ? "success" : "failed",
      message: data.message || "Chapa verification complete",
      data: data.data,
    };
  } catch (err: unknown) {
    return {
      status: "failed",
      message: err instanceof Error ? err.message : "Verification request failed",
    };
  }
}
