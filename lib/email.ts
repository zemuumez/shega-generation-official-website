import "server-only";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "re_dummy_key_for_build");

const SUBJECT_BY_LOCALE: Record<string, string> = {
  am: "የናሙና ምዘና ተያይዟል | Shega Generations",
  en: "Your diagnostic assessment | Shega Generations",
  om: "Qormaata madaallii keessan | Shega Generations",
  ti: "ናይ ምርመራ ገምጋም | Shega Generations",
};

const BODY_BY_LOCALE: Record<string, string> = {
  am:
    "ሰላም {{name}},\n\nወደ ሽጋ ትውልድ ስላመለከቱ እናመሰግናለን። የናሙና ምዘናዎ እና የቀጣይ ደረጃዎች በቅርቡ ይላካሉ።\n\nሽጋ ትውልድ ቡድን",
  en:
    "Hi {{name}},\n\nThanks for applying to Shega Generations. Your diagnostic assessment and next steps are on their way.\n\nThe Shega Generations Team",
  om:
    "Akkam {{name}},\n\nGalatoomaa Shega Generations keessatti iyyannoo keessan waliif galfattaniif. Qormaanni keessan dhiyaatee jira.\n\nGarreen Shega Generations",
  ti:
    "ሰላም {{name}},\n\nየቐንኩም ብምዃኑ ነመስግን። ገምጋም ትምህርትኹም ብቕልጡፍ ክለኣኸልኩም እዩ።\n\nጋንታ ሽጋ ትውልድ",
};

export async function sendDiagnosticEmail(params: {
  to: string;
  name: string;
  locale: string;
}) {
  const locale = SUBJECT_BY_LOCALE[params.locale] ? params.locale : "en";
  const subject = SUBJECT_BY_LOCALE[locale];
  const body = BODY_BY_LOCALE[locale].replace("{{name}}", params.name);

  return resend.emails.send({
    from: "Shega Generations <onboarding@shegagenerations.org>",
    to: params.to,
    subject,
    text: body,
  });
}

export async function sendDonationReceiptEmail(params: {
  to: string;
  name: string;
  amount: number;
  currency: string;
  txRef: string;
  gateway: string;
}) {
  const subject = `Donation Receipt: ${params.currency} ${params.amount} | Shega Generations`;
  const body = `Dear ${params.name || "Supporter"},

Thank you deeply for supporting Shega Generations! Your contribution fuels transport, food, lodging, and computational resources for underprivileged tech talent in Ethiopia.

Receipt Details:
- Amount: ${params.currency} ${params.amount}
- Transaction Reference: ${params.txRef}
- Payment Gateway: ${params.gateway.toUpperCase()}
- Date: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}

If you have any questions, feel free to contact us at support@shegagenerations.org.

With gratitude,
The Shega Generations Team`;

  return resend.emails.send({
    from: "Shega Generations <donations@shegagenerations.org>",
    to: params.to,
    subject,
    text: body,
  });
}

