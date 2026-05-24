# UX Patterns Reference

Concrete, copy-ready patterns for the parts of frontend work people most often get wrong. Read the section relevant to your task. These are framework-agnostic in spirit; adapt syntax to the project.

## Contents
1. The three states everyone forgets (empty / loading / error)
2. Forms and validation
3. Navigation and information architecture
4. Modals, dialogs, and toasts
5. Tables and data display
6. Buttons and actions
7. Accessibility checklist

---

## 1. The three states everyone forgets

A view that fetches or holds data has at least four states. Demos show one (data present). Products show all four.

**Loading.** Prefer skeletons that mirror the final layout over a centered spinner — they reduce perceived wait and avoid layout shift. A spinner is acceptable for short or unpredictable waits. Never show a blank screen that suddenly fills.

**Empty.** Not an error — an opportunity. An empty list should explain what would go here and offer the first action. "No projects yet" + a "Create your first project" button beats a blank box. Distinguish *empty because new* (guide them) from *empty because filtered* (offer to clear filters).

**Error.** Say what happened in human terms and offer a way forward (retry, go back, contact). Never dump a raw stack trace or a bare "Error." Keep the layout stable so the page doesn't collapse.

**Success / data.** The happy path. Make sure it still holds up with one item, hundreds of items, very long strings, and missing optional fields.

Sketch (React-ish, adapt freely):

```jsx
if (isLoading) return <ListSkeleton rows={5} />;
if (error)     return <ErrorState message="Couldn't load your projects." onRetry={refetch} />;
if (items.length === 0) return <EmptyState title="No projects yet" action={<Button onClick={onCreate}>Create your first project</Button>} />;
return <List items={items} />;
```

The principle matters more than the snippet: decide what each state looks like *before* you finish the component.

---

## 2. Forms and validation

Forms are where UX is most often won or lost.

- **Labels always.** Every input has a visible label (placeholder is not a label — it vanishes on input and fails accessibility). Associate it (`htmlFor`/`id` or wrapping `<label>`).
- **Validation timing.** Don't scream on every keystroke. Validate on blur or on submit; once a field has shown an error, you may re-validate as they type so they see it clear. Show errors inline next to the field, not only in a summary.
- **Required vs optional.** Mark one consistently. Don't make users guess.
- **Preserve input on error.** Never clear a form because one field was wrong.
- **Helpful messages.** "Enter a valid email (e.g. name@company.com)" beats "Invalid input." Say what's wrong and how to fix it.
- **Submit state.** Disable the submit button while submitting and show progress; prevent double-submit. Re-enable on error.
- **Formats.** If you need a specific format, either accept flexible input and normalize it, or show the expected format up front. Don't reject "(555) 123-4567" silently.
- **Grouping & order.** Group related fields; order them the way the user thinks (name before payment). Keep forms as short as the task allows.
- **Keyboard.** Enter submits where sensible; tab order is logical; focus moves to the first error on failed submit.

---

## 3. Navigation and information architecture

- **Tell users where they are.** Highlight the active nav item; use breadcrumbs for depth.
- **Consistent placement.** Primary nav stays put across pages. Don't move the goalposts.
- **Match structure to mental model**, not to your database schema. Group by what users look for.
- **Mobile nav** needs a real plan (hamburger/drawer, bottom bar) — don't just let the desktop nav wrap.
- **Back and escape should work** as users expect (browser back, Esc to close overlays).
- **Don't bury the primary task** under layers of menus.

---

## 4. Modals, dialogs, and toasts

**Modals/dialogs:**
- Use for focused tasks or confirmations that must interrupt — not as a dumping ground.
- Trap focus inside while open; return focus to the trigger on close.
- Close on Esc and on backdrop click (unless data loss risk — then confirm).
- Always confirm destructive, irreversible actions ("Delete project? This can't be undone.") with the destructive button clearly marked and *not* the default focus.
- Don't stack modals on modals.

**Toasts/notifications:**
- For transient feedback ("Saved," "Copied"). Auto-dismiss after a few seconds; allow manual dismiss.
- Errors that need action shouldn't be a disappearing toast — keep them visible.
- Don't flood; collapse or queue multiples.

---

## 5. Tables and data display

- **Right-align numbers**, left-align text, for scannability. Use tabular figures for changing numbers.
- **Headers** stay visible (sticky) for long tables.
- **Empty cells** get a clear placeholder (—), not blank ambiguity.
- **Pagination or virtualization** for large datasets — don't render 10,000 rows.
- **Sort/filter** affordances should show current state.
- **Responsive tables** are hard: consider card layouts on mobile, horizontal scroll with a frozen first column, or hiding low-priority columns — pick deliberately.
- **Loading** a table → skeleton rows, not a spinner that collapses the layout.

---

## 6. Buttons and actions

- **One primary per view (ideally).** The primary action is visually dominant (filled, accent color). Secondary actions are lighter (outline/ghost). Tertiary are text links.
- **Label with verbs** describing the outcome: "Save changes," "Delete account" — not "OK"/"Submit" when something clearer exists.
- **Destructive actions** look distinct (often red) and are separated from safe ones so they're not clicked by reflex.
- **Disabled** buttons should signal *why* when non-obvious (tooltip or helper text), and never be the only feedback for a validation failure.
- **Loading** state on async actions; prevent double-clicks.
- Make the whole expected hit area clickable; ensure adequate touch size on mobile.

---

## 7. Accessibility checklist

Quick pass — catch the high-impact issues:

- **Semantic HTML**: real `<button>`, `<a>` with `href`, `<nav>`, `<main>`, headings in logical order (one `h1`, no skipping levels for style).
- **Labels**: every form control labeled; icon-only buttons have `aria-label`.
- **Keyboard**: everything interactive is reachable and operable by keyboard; logical tab order; visible focus indicator (don't `outline: none` without a replacement).
- **Contrast**: body text meets ~4.5:1; large text ~3:1. Don't rely on color alone to convey meaning (add icon/text).
- **Images**: meaningful images have `alt`; decorative ones have `alt=""`.
- **Motion**: respect `prefers-reduced-motion`.
- **Live regions**: announce async updates (errors, toasts) to screen readers (`aria-live`) when relevant.
- **Don't trap** keyboard users anywhere except intentionally (modals, which must also release focus on close).
