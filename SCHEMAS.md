# Content Schemas

Reference for the schema types registered in this Studio. Source of truth lives in
[`schemaTypes/`](schemaTypes/); this doc mirrors it for frontend and API consumers.

Registered in [`schemaTypes/index.ts`](schemaTypes/index.ts) and wired into the Studio via
`sanity.config.ts` (`projectId: 7dil1d5q`, dataset `production`).

| Type          | Kind     | Purpose                           |
| ------------- | -------- | --------------------------------- |
| `project`     | document | A portfolio project entry         |
| `category`    | document | Shared taxonomy for projects      |
| `videoBlog`   | document | A video blog post                 |
| `testimonial` | object   | Quote block embedded in a project |

## Relationships

```
project ──category──▶ category   (reference, many projects → one category)
project ──testimonial──▶ testimonial (embedded object, not shared)
```

The relationship is **one-directional**: a project points at its category. `category` holds no
references back to projects — bidirectional references have to be kept in sync manually and
double the writes on every edit. To list a category's projects, query from the project side:

```groq
*[_type == "project" && category._ref == $categoryId]
```

## `project` (document)

| Field         | Type                     | Required | Notes                                             |
| ------------- | ------------------------ | -------- | ------------------------------------------------- |
| `title`       | `string`                 | yes      |                                                   |
| `slug`        | `slug`                   | yes      | Generated from `title`, max 96 chars              |
| `img`         | `image`                  | yes      | Hotspot enabled, with `alt` string field          |
| `location`    | `string`                 | yes      |                                                   |
| `year`        | `date`                   | no       | Any date in the project year; displayed as `YYYY` |
| `category`    | `reference` → `category` | yes      | The project's category                            |
| `description` | `text`                   | no       | 6 rows                                            |
| `testimonial` | `testimonial`            | no       | Embedded object, see below                        |

Preview subtitle: `category · location · year`.

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

## `testimonial` (object)

| Field         | Type    | Required | Notes                                                  |
| ------------- | ------- | -------- | ------------------------------------------------------ |
| `testimonial` | `text`  | yes      | 4 rows                                                 |
| `src`         | `image` | no       | Author image, hotspot enabled, with `alt` string field |

Used inline on `project`. Not a document — each project owns its own copy.

## Querying

References need explicit expansion with `->`; embedded objects come back inline.

```groq
// A single project with its category resolved
*[_type == "project" && slug.current == $slug][0]{
  title,
  location,
  year,
  description,
  img,
  category->{_id, title},
  testimonial
}

// All categories with a project count
*[_type == "category"]{
  _id,
  title,
  "projectCount": count(*[_type == "project" && references(^._id)])
}

// Projects filtered by category title
*[_type == "project" && category->title == $categoryTitle]{title, slug}
```

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
import {defineField, defineType} from 'sanity'
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
      type: 'testimonial',
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
  type: 'object',
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
      name: 'src',
      title: 'Author image',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative text',
          type: 'string',
          description: 'Describes the author for screen readers.',
        }),
      ],
    }),
  ],
  preview: {
    select: {
      testimonial: 'testimonial',
      media: 'src',
    },
    prepare({testimonial: quote, media}) {
      return {
        title: quote || 'Testimonial',
        subtitle: quote ? 'Testimonial' : undefined,
        media,
      }
    },
  },
})
```
