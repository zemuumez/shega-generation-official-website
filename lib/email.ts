import "server-only";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

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

  // This call is fire-and-forget from the caller's perspective (see route
  // handler), but errors are still surfaced to the caller for logging.
  // A failed email must never roll back the already-persisted
  // application record; the two are intentionally decoupled.
  return resend.emails.send({
    from: "Shega Generations <onboarding@shegagenerations.org>",
    to: params.to,
    subject,
    text: body,
  });
}
