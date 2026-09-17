---
version: 1
slug: "src-pages-chats-tsx"
primary_target: "src/pages/chats.tsx"
related_targets: ["src/pages/home.tsx","src/pages/login.tsx","src/pages/signup.tsx","src/pages/people.tsx","src/pages/profile.tsx"]
---

Scope: the whole Super Chat web client — auth (login, signup), app shell, chats list, conversation view, people, profile. Visitor mode: Operate.

Audience: engineers and technical recruiters evaluating the author, plus anyone actually using the app to talk. Task: read and send messages, manage friends, edit profile. Constraints: React 19 + Vite, Tailwind v4 + daisyUI alongside MUI, virtualized message list, WCAG 2.2 AA target.

## Direction contract

THESIS: Super Chat is a plainly excellent messenger, and it earns attention by being quiet rather than by being clever. It refuses the generated-UI arrangement it currently ships — a floating translucent card, glowing buttons, and controls that jump under the cursor — and refuses equally the temptation to replace that with a concept metaphor. The user considered a concept-led world and explicitly declined it. Convention is the commitment: Signal and Telegram set the craft bar, and the work is to hit that bar exactly, without irony or smuggled quirk.

OWN-WORLD: Warm neutral greys on off-white, never cold slate. One quiet deep-teal accent, reserved by law for the user's own messages and primary actions; nothing decorative may borrow it. Every surface opaque, separated by 1px hairline borders rather than shadows or blur. Dark mode is a true warm counterpart, not an inversion of the light theme. The conversation sits on a low-contrast neutral pattern in the manner of WhatsApp's wall. No gradient, no glow, no glass, no rounded floating card. Type carries the hierarchy: one humanist sans, tight leading, tabular numerals for timestamps.

STORY: The visitor understands within seconds that this is a real messenger built by someone with restraint. They believe the engineering is genuine because presence, delivery and read state are legible and immediate. They send a message in the global room and watch it land.

FIRST VIEWPORT: Edge-to-edge, no outer margin or floating card. Desktop: a 72px icon rail hard left, a 360px chats list beside it separated by a hairline, and the conversation filling the rest. Conversation header is a solid bar with avatar, name and presence text. Below it the patterned wall carries message rows at tight density — incoming white with a hairline border, outgoing deep teal with white text, both with a small tail and inline bottom-right timestamp. The composer is a solid bar pinned to the bottom, no blur. Mobile: the rail becomes a bottom tab bar, the list becomes full-width, and opening a chat pushes a full-screen conversation.

FORM: The standing exit — the category standard played straight — taken by the user after a full direction round was presented and declined. Position on the ordered list: not applicable; this is the canon card, not a grounded candidate. Seed key 7641f35d.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
