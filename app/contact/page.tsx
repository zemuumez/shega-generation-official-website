import ContactDirectory from "@/components/ContactDirectory";
import { safeFetch } from "@/sanity/lib/client";
import { SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";

export const metadata = {
  title: "Contact Us | Shega Generations",
  description:
    "Get in touch with the Shega Generations team for general inquiries, partnerships, sponsorships, donations, and media features.",
};

export const revalidate = 0;

export default async function ContactPage() {
  const siteSettings = await safeFetch<any>(SITE_SETTINGS_QUERY, {}, null);

  return (
    <main className="min-h-screen bg-white relative overflow-hidden">
      <ContactDirectory
        customPhrases={siteSettings?.contactPageTitlePhrases}
        customSubtitle={siteSettings?.contactPageSubtitle}
      />
    </main>
  );
}
