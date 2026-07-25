import GalleryGrid from "@/components/GalleryGrid";
import { safeFetch } from "@/sanity/lib/client";
import { GALLERY_QUERY, SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";
import { demoGallery } from "@/lib/demoData";

export const metadata = { title: "Gallery | Shega Generations" };
export const revalidate = 0;

export default async function GalleryPage() {
  const [items, siteSettings] = await Promise.all([
    safeFetch(GALLERY_QUERY, {}, demoGallery),
    safeFetch<any>(SITE_SETTINGS_QUERY, {}, null),
  ]);

  return (
    <main className="min-h-screen bg-white relative overflow-hidden">
      <GalleryGrid
        items={items}
        customPhrases={siteSettings?.galleryPageTitlePhrases}
        customSubtitle={siteSettings?.galleryPageSubtitle}
        customCategories={siteSettings?.galleryCategories}
      />
    </main>
  );
}
