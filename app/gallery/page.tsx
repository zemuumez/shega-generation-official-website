import GalleryGrid from "@/components/GalleryGrid";
import { safeFetch } from "@/sanity/lib/client";
import { GALLERY_QUERY } from "@/sanity/lib/queries";
import { demoGallery } from "@/lib/demoData";

export const metadata = { title: "Gallery | Shega Generations" };

export default async function GalleryPage() {
  const items = await safeFetch(GALLERY_QUERY, {}, demoGallery);

  return (
    <div className="pb-24 pt-16">
      <div className="mx-auto max-w-5xl px-6 sm:px-10">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-ochre">Media Hub</p>
        <h1 className="mt-3 font-display text-display-lg">Moments from the field</h1>
        <p className="mt-4 max-w-xl text-ink-soft">
          Expeditions, hackathons, classrooms, and volunteer work. Filter by what you want to see.
        </p>

        <div className="mt-12">
          <GalleryGrid items={items} />
        </div>
      </div>
    </div>
  );
}
