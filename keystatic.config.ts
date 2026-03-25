import { collection, config, fields } from "@keystatic/core";

export default config({
  storage: {
    kind: "github",
    repo: "watchdecode/watchdecode",
  },
  collections: {
    posts: collection({
      label: "Blog posts",
      slugField: "title",
      path: "src/content/posts/*/",
      format: { contentField: "content" },
      schema: {
        title: fields.slug({
          name: { label: "Title" },
          slug: { label: "URL slug" },
        }),
        description: fields.text({
          label: "Description",
          multiline: true,
        }),
        date: fields.date({
          label: "Date",
        }),
        category: fields.select({
          label: "Category",
          options: [
            { label: "Buying Guides", value: "Buying Guides" },
            { label: "Reviews", value: "Reviews" },
            { label: "Comparisons", value: "Comparisons" },
            { label: "Watch Brands", value: "Watch Brands" },
            { label: "Budget Picks", value: "Budget Picks" },
            { label: "Luxury Watches", value: "Luxury Watches" },
            { label: "Watch Care", value: "Watch Care" },
          ],
          defaultValue: "Buying Guides",
        }),
        affiliateLinks: fields.array(
          fields.object({
            watchName: fields.text({
              label: "Watch name",
            }),
            affiliateUrl: fields.text({
              label: "Affiliate URL",
            }),
            buttonLabel: fields.text({
              label: "Button label",
              defaultValue: "Check Price on Amazon",
            }),
          }),
          {
            label: "Affiliate links",
            itemLabel: (props) => {
              // Keystatic itemLabel receives preview props
              return props.fields.watchName.value || "Affiliate link";
            },
          },
        ),
        featured: fields.checkbox({
          label: "Featured",
          defaultValue: false,
        }),
        coverImage: fields.image({
          label: "Cover image",
          directory: "public/images/posts",
          publicPath: "/images/posts/",
        }),
        content: fields.mdx({
          label: "Body",
          extension: "mdx",
          options: {
            image: {
              directory: "public/images/posts",
              publicPath: "/images/posts/",
            },
          },
        }),
      },
    }),
  },
});
