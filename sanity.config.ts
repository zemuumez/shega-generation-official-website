import { defineConfig } from "sanity";
import { deskTool } from "sanity/desk";
import { schemaTypes } from "./sanity/schemas";
import { deskStructure } from "./sanity/structure";

export default defineConfig({
  name: "shega-generations-studio",
  title: "Shega Generations Studio",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  basePath: "/studio",
  plugins: [deskTool({ structure: deskStructure })],
  schema: { types: schemaTypes },
});

