import { config, fields, collection } from "@keystatic/core";

// In-browser CMS. `local` storage edits files directly (great for dev). For
// production editing, switch to:
//   storage: { kind: "github", repo: "yxflc11/wenweb" }
// and set up the Keystatic GitHub app + env vars (you configure those secrets).
export default config({
  storage: { kind: "local" },
  ui: {
    brand: { name: "Bingwen He" }
  },
  collections: {
    posts: collection({
      label: "Blog posts",
      slugField: "title",
      path: "src/content/posts/*",
      format: { contentField: "content" },
      entryLayout: "content",
      schema: {
        title: fields.slug({ name: { label: "Title" } }),
        date: fields.text({ label: "Date", description: "YYYY-MM-DD" }),
        summary: fields.text({ label: "Summary", multiline: true }),
        tags: fields.array(fields.text({ label: "Tag" }), {
          label: "Tags",
          itemLabel: (p) => p.value
        }),
        content: fields.markdoc({ label: "Content" })
      }
    }),
    work: collection({
      label: "Work case-studies",
      slugField: "title",
      path: "src/content/work/*",
      format: { contentField: "content" },
      entryLayout: "content",
      schema: {
        title: fields.slug({ name: { label: "Title" } }),
        year: fields.text({ label: "Year" }),
        category: fields.text({ label: "Category" }),
        role: fields.text({ label: "Role" }),
        date: fields.text({ label: "Date", description: "YYYY-MM-DD" }),
        summary: fields.text({ label: "Summary", multiline: true }),
        link: fields.text({ label: "External link" }),
        content: fields.markdoc({ label: "Content" })
      }
    })
  }
});
