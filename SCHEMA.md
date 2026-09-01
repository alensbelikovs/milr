# Content Schemas

Reference for the schema types registered in this Studio. Source of truth lives in
[`schemaTypes/`](schemaTypes/); this doc mirrors it for frontend and API consumers.

Registered in [`schemaTypes/index.ts`](schemaTypes/index.ts) and wired into the Studio via
`sanity.config.ts` (`projectId: 7dil1d5q`, dataset `production`).

| Type          | Kind     | Purpose                        |
| ------------- | -------- | ------------------------------ |
| `project`     | document | A portfolio project entry      |
| `category`    | document | Shared taxonomy for projects   |
| `videoBlog`   | document | A video blog post              |
| `testimonial` | document | A reusable quote from a client |

## Relationships

```
project ──category────▶ category      (reference, required — many projects → one category)
project ──testimonial─▶ testimonial   (reference, optional — reusable across projects)
```

Every relationship is **one-directional**: `project` points outward, and neither `category` nor
`testimonial` holds references back. Bidirectional references have to be kept in sync by hand and
double the writes on every edit, so the inverse is a query instead:

```groq
// Projects in a category
*[_type == "project" && category._ref == $categoryId]

// Projects using a testimonial
*[_type == "project" && testimonial._ref == $testimonialId]
```

Related documents are always fetched with an explicit `->` expansion. The one piece of inline
content is `project.gallery`, whose images live on the project document itself and come back
without any expansion.

## `project` (document)

| Field         | Type                        | Required | Notes                                             |
| ------------- | --------------------------- | -------- | ------------------------------------------------- |
| `title`       | `string`                    | yes      |                                                   |
| `slug`        | `slug`                      | yes      | Generated from `title`, max 96 chars              |
| `img`         | `image`                     | yes      | Hotspot enabled, with `alt` string field          |
| `gallery`     | `array` of `image`          | no       | Ordered gallery, hotspot + `alt` on each item     |
| `location`    | `string`                    | yes      |                                                   |
| `year`        | `date`                      | no       | Full ISO date; format to the year in the frontend |
| `category`    | `reference` → `category`    | yes      | The project's category                            |
| `description` | `text`                      | no       | 6 rows                                            |
| `testimonial` | `reference` → `testimonial` | no       | Optional client quote                             |

Preview subtitle: `category · location · year`.

**`year` holds a full date, not a year.** Sanity's `date` type always stores an ISO `YYYY-MM-DD`
string, so a project set to 2025 comes back as `"2025-01-01"`. The Studio narrows the picker's
display to `YYYY` via `options.dateFormat`, but that is presentation only — only the year is
meaningful, and trimming it is the frontend's job:

```ts
const year = project.year?.slice(0, 4) // "2025-01-01" -> "2025"
```

Treat the month and day as padding: they carry no editorial meaning and should never be rendered.
For range filters, GROQ compares the ISO strings correctly as-is (`year >= "2020-01-01"`).

## `category` (document)

| Field   | Type     | Required | Notes |
| ------- | -------- | -------- | ----- |
| `title` | `string` | yes      |       |

Categories are pure taxonomy — a title and nothing else. Membership is expressed on `project`.

## `videoBlog` (document)

| Field         | Type     | Required | Notes                                    |
| ------------- | -------- | -------- | ---------------------------------------- |
| `title`       | `string` | yes      |                                          |
| `slug`        | `slug`   | yes      | Generated from `title`, max 96 chars     |
| `mediaUrl`    | `url`    | yes      | `http`/`https` only                      |
| `img`         | `image`  | yes      | Hotspot enabled, with `alt` string field |
| `description` | `text`   | no       | 6 rows                                   |

Ordering `createdAtDesc` (newest first) is available in the Studio.

## `testimonial` (document)

| Field          | Type     | Required | Notes                                                      |
| -------------- | -------- | -------- | ---------------------------------------------------------- |
| `testimonial`  | `text`   | yes      | 4 rows                                                     |
| `author`       | `string` | yes      | Name of the person quoted                                  |
| `authorDetail` | `string` | no       | Job title or a two-word description, e.g. "Head of Design" |

Preview title: `author` (falls back to the quote), subtitle: `authorDetail`.

Its own document type, so it appears in the Studio content catalog alongside projects,
categories, and video blogs, and one testimonial can be referenced by any number of projects.

Attribution is text only — there is no author image. Render the quote with `author` and, when
present, `authorDetail`:

```tsx
<figcaption>
  {testimonial.author}
  {testimonial.authorDetail && <span>, {testimonial.authorDetail}</span>}
</figcaption>
```

## Querying

```groq
// A single project with its category resolved
*[_type == "project" && slug.current == $slug][0]{
  title,
  location,
  year,
  description,
  img,
  category->{_id, title},
  testimonial->{testimonial, author, authorDetail}
}

// All categories with a project count
*[_type == "category"]{
  _id,
  title,
  "projectCount": count(*[_type == "project" && category._ref == ^._id])
}

// Projects filtered by category title
*[_type == "project" && category->title == $categoryTitle]{title, slug}
```

### Gallery images

Each item in `project.gallery` is an inline image object, so the array comes back in document order
with no dereferencing. Sanity assigns every array item a `_key` — always project it and use it as
the React `key`; index keys break Visual Editing overlays.

```groq
*[_type == "project" && slug.current == $slug][0]{
  title,
  gallery[]{
    _key,
    alt,
    hotspot,
    crop,
    asset->{
      _id,
      url,
      metadata {lqip, dimensions {width, height}}
    }
  }
}
```

`metadata.lqip` is not returned automatically — project it explicitly if you want blur placeholders.

```tsx
import imageUrlBuilder from '@sanity/image-url'

const builder = imageUrlBuilder({projectId: '7dil1d5q', dataset: 'production'})
const urlFor = (source) => builder.image(source)

export function Gallery({gallery}) {
  if (!gallery?.length) return null

  return (
    <ul>
      {gallery.map((image) => (
        <li key={image._key}>
          <img
            src={urlFor(image).width(1200).fit('crop').auto('format').url()}
            alt={image.alt || ''}
            width={image.asset?.metadata?.dimensions?.width}
            height={image.asset?.metadata?.dimensions?.height}
            loading="lazy"
          />
        </li>
      ))}
    </ul>
  )
}
```

Passing the whole `image` object to `urlFor` (not just `asset.url`) is what lets the builder apply
the editor's hotspot and crop when it resizes.

## Schema code

### `schemaTypes/index.ts`

```typescript
import {category} from './category'
import {project} from './project'
import {testimonial} from './testimonial'
import {videoBlog} from './videoBlog'

export const schemaTypes = [project, category, testimonial, videoBlog]
```

### `schemaTypes/project.ts`

```typescript
import {defineArrayMember, defineField, defineType} from 'sanity'
import {DocumentIcon} from '@sanity/icons/Document'

export const project = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  icon: DocumentIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title', maxLength: 96},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'img',
      title: 'Image',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative text',
          type: 'string',
          description: 'Describes the image for screen readers.',
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'gallery',
      title: 'Gallery',
      type: 'array',
      description: 'Additional images, shown in the order listed here.',
      of: [
        defineArrayMember({
          name: 'galleryImage',
          title: 'Image',
          type: 'image',
          options: {hotspot: true},
          fields: [
            defineField({
              name: 'alt',
              title: 'Alternative text',
              type: 'string',
              description: 'Describes the image for screen readers.',
            }),
          ],
        }),
      ],
      options: {layout: 'grid'},
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'year',
      title: 'Year',
      type: 'date',
      description: 'Pick any date in the project year — only the year is shown.',
      options: {dateFormat: 'YYYY'},
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{type: 'category'}],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 6,
    }),
    defineField({
      name: 'testimonial',
      title: 'Testimonial',
      type: 'reference',
      to: [{type: 'testimonial'}],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      category: 'category.title',
      location: 'location',
      year: 'year',
      media: 'img',
    },
    prepare({title, category, location, year, media}) {
      const subtitle = [category, location, year?.slice(0, 4)].filter(Boolean).join(' · ')
      return {title, subtitle, media}
    },
  },
})
```

### `schemaTypes/category.ts`

```typescript
import {defineField, defineType} from 'sanity'
import {TagIcon} from '@sanity/icons/Tag'

export const category = defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  icon: TagIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'title',
    },
  },
})
```

### `schemaTypes/videoBlog.ts`

```typescript
import {defineField, defineType} from 'sanity'
import {VideoIcon} from '@sanity/icons/Video'

export const videoBlog = defineType({
  name: 'videoBlog',
  title: 'Video Blog',
  type: 'document',
  icon: VideoIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title', maxLength: 96},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'mediaUrl',
      title: 'Media URL',
      type: 'url',
      description: 'Link to the video.',
      validation: (rule) => rule.required().uri({scheme: ['http', 'https']}),
    }),
    defineField({
      name: 'img',
      title: 'Image',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative text',
          type: 'string',
          description: 'Describes the image for screen readers.',
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 6,
    }),
  ],
  orderings: [
    {
      name: 'createdAtDesc',
      title: 'Newest first',
      by: [{field: '_createdAt', direction: 'desc'}],
    },
  ],
  preview: {
    select: {
      title: 'title',
      createdAt: '_createdAt',
      media: 'img',
    },
    prepare({title, createdAt, media}) {
      return {title, subtitle: createdAt?.slice(0, 10), media}
    },
  },
})
```

### `schemaTypes/testimonial.ts`

```typescript
import {defineField, defineType} from 'sanity'
import {CommentIcon} from '@sanity/icons/Comment'

export const testimonial = defineType({
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  icon: CommentIcon,
  fields: [
    defineField({
      name: 'testimonial',
      title: 'Testimonial',
      type: 'text',
      rows: 4,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'string',
      description: 'Name of the person quoted.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'authorDetail',
      title: 'Author detail',
      type: 'string',
      description: 'Job title or a two-word description of the person, e.g. "Head of Design".',
    }),
  ],
  preview: {
    select: {
      testimonial: 'testimonial',
      author: 'author',
      authorDetail: 'authorDetail',
    },
    prepare({testimonial: quote, author, authorDetail}) {
      return {
        title: author || quote || 'Testimonial',
        subtitle: authorDetail || (author ? quote : undefined),
      }
    },
  },
})
```
