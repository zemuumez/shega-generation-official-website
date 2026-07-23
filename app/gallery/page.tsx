import GalleryGrid from "@/components/GalleryGrid";
import { safeFetch } from "@/sanity/lib/client";
import { GALLERY_QUERY } from "@/sanity/lib/queries";
import { demoGallery } from "@/lib/demoData";

export const metadata = { title: "Gallery | Shega Generations" };
export const revalidate = 0;

export default async function GalleryPage() {
  const items = await safeFetch(GALLERY_QUERY, {}, demoGallery);

  return (
    <div className="pb-28 pt-20 relative">
      <div className="mx-auto w-full max-w-[90vw] px-4 sm:px-6 relative z-20">
        <span className="inline-block px-3.5 py-1 rounded-full font-mono text-xs uppercase tracking-[0.2em] bg-ink/5 text-ink border border-zinc-200 font-bold">
          Media Hub
        </span>
        <h1 className="mt-6 font-display text-display-lg font-bold text-ink leading-tight uppercase">Moments from the field</h1>
        <p className="mt-4 max-w-xl text-lg text-ink-soft">
          Expeditions, hackathons, classrooms, and volunteer work. Filter by what you want to see.
        </p>

        <div className="mt-14">
          <GalleryGrid items={items} />
        </div>
      </div>
    </div>
  );
}
