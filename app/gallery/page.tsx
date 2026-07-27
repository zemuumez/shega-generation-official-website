import GalleryGrid from "@/components/GalleryGrid";
import { safeFetch } from "@/sanity/lib/client";
import { GALLERY_QUERY, SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";
import { demoGallery } from "@/lib/demoData";
import SideFramingPatterns from "@/components/SideFramingPatterns";

export const metadata = { title: "Gallery | Shega Generations" };
export const revalidate = 0;

export default async function GalleryPage() {
  const [items, siteSettings] = await Promise.all([
    safeFetch(GALLERY_QUERY, {}, demoGallery),
    safeFetch<any>(SITE_SETTINGS_QUERY, {}, null),
  ]);

  return (
    <main className="min-h-screen bg-[#F4F3EE] relative overflow-hidden">
      <SideFramingPatterns />
      <div className="relative z-10">
        <GalleryGrid
          items={items}
          customPhrases={siteSettings?.galleryPageTitlePhrases}
          customSubtitle={siteSettings?.galleryPageSubtitle}
          customCategories={siteSettings?.galleryCategories}
        />
      </div>
    </main>
  );
}
