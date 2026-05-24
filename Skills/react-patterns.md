# React & Component Architecture Patterns

Patterns for writing frontend code that other engineers (and future-you) can live with. React-centric because it's most common, but the architecture ideas (composition, state placement, separating fetch states from view) apply to Vue, Svelte, and plain JS too. Always defer to the project's existing conventions over anything here.

## Contents
1. Component boundaries and composition
2. Where state lives
3. Data fetching and its states
4. Common React pitfalls and fixes
5. Styling approaches — adapt to the project
6. Project structure

---

## 1. Component boundaries and composition

- **Split at meaningful seams**, not arbitrarily. A component should do one coherent thing. If you can't name it clearly, the boundary is probably wrong.
- **Don't over-abstract.** A layout used once doesn't need to be a configurable component with twelve props. Inline it. Extract when you see real repetition (rule of three) or a genuine reusable concept.
- **Prefer composition over configuration.** A component that takes `children` or slot-like props (`header`, `footer`, `actions`) ages better than one with a giant boolean/enum prop matrix. `<Card><Card.Header/>...</Card>` or passing elements as props beats `<Card showHeader headerVariant="x" hasFooter .../>`.
- **Keep presentational and container concerns loosely separated** when it helps — a component that just renders props is easy to reason about and reuse; push data-fetching and orchestration up or out.

---

## 2. Where state lives

- **Keep state as local as possible.** Lift it only to the lowest common ancestor that needs it. Global state for everything is a smell.
- **Derive, don't store.** If a value can be computed from existing state/props during render, compute it — don't mirror it in another state variable that can drift out of sync.
- **Match the project's tool.** If it uses Zustand, use Zustand; Redux, use Redux; Context, use Context. Don't add a state library to a project that's doing fine without one for a feature that doesn't need it.
- **Context is for genuinely shared, low-churn state** (theme, auth, current user). Putting fast-changing state in a high-level Context re-renders the world — colocate or use a store with selectors instead.
- **URL is state too.** Filters, tabs, selected item, pagination often belong in the URL (query params/route) so they're shareable and survive refresh.

---

## 3. Data fetching and its states

Whatever the fetching approach (React Query/TanStack Query, SWR, RTK Query, raw `fetch` in an effect, framework loaders), the rule is the same: **a fetch has loading, error, and success states, and the UI must handle all three.** See `ux-patterns.md` §1 for what each looks like.

- Prefer the project's existing data layer (a `useX` query hook, an API client) over hand-rolling `fetch` in a component.
- If using raw effects: handle cleanup/cancellation to avoid setting state on unmounted components or out-of-order responses; don't forget the dependency array.
- Don't fetch in a way that waterfalls unnecessarily (sequential awaits that could be parallel).
- Optimistic updates are great UX for fast actions — but only with a rollback path on failure.

Shape to aim for:

```jsx
const { data, isLoading, error, refetch } = useProjects();
// then branch: loading → skeleton, error → ErrorState w/ retry, empty → EmptyState, else → render
```

---

## 4. Common React pitfalls and fixes

- **List keys**: use a stable unique id, not the array index, when items can reorder, insert, or delete. Index keys cause subtle state/DOM bugs.
- **Unnecessary effects**: `useEffect` is for synchronizing with *external* systems (DOM, network, subscriptions), not for computing derived data or responding to props — do that during render or in an event handler. An effect that just `setState`s from props is usually a mistake.
- **Stale closures**: callbacks capturing old state — use functional updates (`setX(prev => ...)`) or correct deps.
- **Controlled inputs**: pick controlled or uncontrolled and stay consistent; a controlled input needs both `value` and `onChange`.
- **Premature memoization**: `useMemo`/`useCallback`/`memo` add complexity and aren't free. Add them where there's a real, observed cost (expensive compute, referential stability for a memoized child, big lists) — not reflexively everywhere.
- **Prop drilling marathons**: passing a prop through five layers → reach for composition (pass JSX through) or context.
- **Key on the wrong thing / remounting**: changing a `key` to force remount is a valid tool but easy to misuse; know when you're doing it.
- **Effects firing twice in dev** (StrictMode) is expected — write effects to be idempotent rather than fighting it.

---

## 5. Styling approaches — adapt to the project

Detect the approach and follow it. Don't mix paradigms in one codebase.

- **Tailwind**: use the config's design tokens (colors, spacing, fonts) — `bg-brand-600`, not arbitrary `bg-[#3b5bdb]` unless there's no token. Extract repeated class strings into a component, not copy-paste. Use `clsx`/`cn` for conditional classes if the project does. Avoid arbitrary-value soup that defeats the system.
- **CSS Modules / vanilla CSS**: use CSS custom properties for tokens; keep selectors flat; colocate styles with components. Respect existing variable names.
- **CSS-in-JS (styled-components/emotion)**: follow the theme object; use `theme.colors.x` not hardcoded hex. Don't define styled components inside render (it remounts).
- **UI kit (shadcn/ui, MUI, Chakra, Radix, etc.)**: use the kit's components and theming rather than fighting it. shadcn components live in the repo and are meant to be edited — edit them; don't wrap them in three layers. Extend the theme, don't override piecemeal with `!important`.

In all cases: define the visual language once (tokens/theme/config) and reference it, so spacing, color, and type stay consistent. One-off inline styles scattered around are the enemy of a coherent look.

---

## 6. Project structure

- **Imitate what exists.** Feature folders, atomic design, flat `components/` — whatever the repo does, match it. Consistency beats your preferred structure.
- **Colocate** what changes together: a component, its styles, its tests, its small helpers can live together.
- **Name by what it is**, clearly. `UserAvatar`, not `Comp1`. Match the casing convention already in use.
- **Shared primitives** (Button, Input, Card) go in a shared location and get reused; don't re-implement a button per feature.
- **Index/barrel files** only if the project already uses them — they can hurt tree-shaking and create import cycles if overused.

The throughline of this whole reference: **read the codebase, match it, keep state local, handle all fetch states, and don't abstract or memoize until there's a reason.** Good frontend code is mostly restraint plus consistency.
