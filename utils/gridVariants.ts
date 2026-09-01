// Every placement rhythm in the app, in one file, because a rhythm defined beside the one component
// that plays it is a rhythm nobody finds when a second component wants it. Both of the ones below
// are read by more than one caller now.
//
// A plain module, deliberately not a "use client" one: an array exported from a client module comes
// back as a client-reference stub, which the server components that lay these out could neither map
// over nor measure.
//
// One Tailwind trap to know when editing these: col-span-N compiles to the grid-column SHORTHAND
// (`span N / span N`), so it rewrites the start as well as the end. A col-start from a smaller
// breakpoint is undone by any col-span at a larger one, because the later media query wins — restate
// the start at every breakpoint that restates the span. Within one breakpoint the order is safe:
// Tailwind emits col-start after col-span, and the order inside the class string never matters.
//
// The *: classes reach one level below the grid item, which is the card itself — see CardGridItem
// for why an item is two boxes. Any card these dress has to keep that shape, or the aspect lands on
// the wrong box and the cover collapses.

// The six-step pattern the full-page grids lay out on, named for where it started. /projects plays
// it, /diary borrows it whole, and a project's own gallery plays it again over plain images — three
// callers, one rhythm, so a change to the shape of a page is a change here and nowhere else.
export const PROJECT_VARIANTS = ([
	"col-start-1 col-span-full md:col-span-9 lg:col-span-6 *:aspect-16/10",
	"col-start-1 col-span-full md:col-start-8 md:col-span-5 lg:col-start-9 lg:mt-section lg:col-span-4 *:aspect-16/10 md:*:aspect-10/16",
	"col-start-1 col-span-full md:col-span-6 md:-mt-section lg:col-span-5 *:aspect-16/10 md:*:aspect-4/3",
	"col-start-1 col-span-full md:col-span-9 md:col-start-4 lg:col-start-7 lg:mt-section lg:col-span-6 *:aspect-16/10",
	"col-start-1 col-span-full md:col-span-5 lg:col-span-4 *:aspect-16/10 md:*:aspect-10/16 lg:-mt-section",
	"col-start-1 col-span-full md:col-span-6 md:col-start-8 md:mt-section lg:col-span-5 lg:col-start-8 *:aspect-16/10 md:*:aspect-4/3 md:mt-section-2x"
])

// One entry, not three. Every card in the home teaser is placed the same way, and variantAt wraps,
// so a single-entry rhythm dresses all three — and keeps tiling three-up if the section ever
// features more.
//
// The ratio is fixed here, where the rhythm above varies it per card: one row of three even
// portraits is the shape of that section, and a card that changed ratio with its index would break
// the row rather than give it rhythm. It has to be stated, not left off — CardGridItem's cover fills
// its card, so a card with no aspect has no height to fill.
export const BLOG_SMALL_VARIANTS = ([
	"md:col-span-4 col-span-full *:aspect-3/4",
])

// The break between one pass of the rhythm and the next, and above md it is the whole of that break:
// the container below runs its row gap at 0 there, so this height is the only thing between the two
// passes and reads at exactly its face value.
//
// hidden rather than h-0 below md, and that is the one line holding the spacing honest. A grid item
// cannot opt out of gap — anything that generates a box takes a track and collects a row gap on BOTH
// sides of it, so a zero-height spacer would not read as nothing, it would read as double the gap it
// sits in. display:none is the only way out: an item that generates no box is not a grid item at
// all, so it takes no track and no gaps with it, and the two cards either side of it fall back to
// the single gap they would have had. Below md the cards stack one per row anyway, so there is no
// tail column for a break to clean up and nothing lost by standing down.
//
// If a breakpoint ever wants this spacer AND a row gap at the same time, the height is not enough on
// its own — pair it with -mb-<that gap> so the track floors one gap short and the next row starts
// exactly this far down. It only works while the height exceeds the gap: a negative margin box
// floors at zero, which is why it cannot rescue the h-0 case above.
export const GRID_CYCLE_SPACER = "col-span-full hidden md:block md:h-normal-3"

// The shared box every grid playing the rhythm above is laid out in — same columns, same gutters,
// same row gap, same clip. Part of what "the same grid with different cards in it" means, and the
// reason /projects, /diary and a project's gallery read as one page design rather than three.
//
// The grid clips. The reveal parks every card half a viewport below its place, and a translated box
// still counts toward scrollable overflow, so unclipped the section grows by that much empty space
// and the page scrolls into it. The last row pays for it, rising into view from the grid's own
// bottom edge rather than from 50vh down.
//
// It clips the negative-margin variants too, which stays safe only while none of them lands in the
// first row — a card pulled above the grid's padding box loses whatever it is pulled past.
//
// gap-y-0 rather than gap-0 above md: gap-0 sets both axes, which would take gap-x-regular down with
// it and leave cards in adjacent columns touching. Only the rows are meant to close up there — the
// rhythm's own margins and the cycle spacer do the vertical spacing from md on, and a row gap on top
// of them would be spacing nobody asked for.
export const GRID_CONTAINER = `
	pt-normal-2 pb-normal-3 grid grid-cols-12 items-start
	gap-x-regular overflow-hidden
	gap-y-normal-2 lg:gap-y-0
`
