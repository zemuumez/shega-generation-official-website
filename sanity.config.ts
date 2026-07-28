import { defineConfig } from "sanity";
import { deskTool } from "sanity/desk";
import { schemaTypes } from "./sanity/schemas";
import { deskStructure } from "./sanity/structure";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "g8zdm74i";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

export default defineConfig({
  name: "shega-generations-studio",
  title: "Shega Generations Studio",
  projectId,
  dataset,
  basePath: "/studio",
  plugins: [deskTool({ structure: deskStructure })],
  schema: { types: schemaTypes },
});

