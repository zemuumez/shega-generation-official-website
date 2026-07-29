import ContactDirectory from "@/components/ContactDirectory";
import { safeFetch } from "@/sanity/lib/client";
import { SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";
import SideFramingPatterns from "@/components/SideFramingPatterns";

import ThemeProvider from "@/components/ThemeProvider";

export const metadata = {
  title: "Contact Us | Shega Generations",
  description:
    "Get in touch with the Shega Generations team for general inquiries, partnerships, sponsorships, donations, and media features.",
};

export const revalidate = 0;

export default async function ContactPage() {
  const siteSettings = await safeFetch<any>(SITE_SETTINGS_QUERY, {}, null);

  return (
    <main className="min-h-screen bg-[#F4F3EE] relative overflow-hidden">
      <ThemeProvider siteSettings={siteSettings} />
      <SideFramingPatterns />
      <div className="relative z-10">
        <ContactDirectory
          customPhrases={siteSettings?.contactPageTitlePhrases}
          customSubtitle={siteSettings?.contactPageSubtitle}
        />
      </div>
    </main>
  );
}
