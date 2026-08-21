// The URL a video blog wears while its modal is open. Deliberately not a real route — nothing under
// app/video-blog/ resolves a slug — so this is a marker in the address bar rather than a page: the
// grid pushes it with the History API and the page underneath stays exactly where it was.
//
// The pattern and the builder live together because two places have to agree on them character for
// character. VideoBlogGridShell writes the path; TransitionControl matches it to decide a URL change is a
// modal opening rather than a navigation. Let those drift and the guard quietly stops firing, which
// looks like the home page replaying its entrance animation on every click.
export const VIDEO_BLOG_SHOW_PATH = /^\/video-blog\/([^/]+)$/

export const videoBlogShowPath = (slug: string) => `/video-blog/${slug}`
