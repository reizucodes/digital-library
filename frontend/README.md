# Digital Library — Frontend

Vue 3 + TypeScript + Vite + Pinia + Tailwind CSS.

---

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

App runs at http://localhost:5173. Set `VITE_API_BASE_URL` in `.env` to point at the backend (default: `http://localhost:8000`).

---

## Adding a Book

Click **Add Book** in the book list header, or use the link in the empty state. A modal dialog opens over the list — the background blurs while it is open. After a successful save the modal closes and the list refreshes in place.

The route `/books/create` no longer exists; it redirects to the book list.

---

## Key Components

| Component | Purpose |
|---|---|
| `BaseModal.vue` | Generic modal shell — handles backdrop, blur, focus-trap, and close-on-escape |
| `BookCreateModal.vue` | Add-book form rendered inside `BaseModal` |
| `BookListView.vue` | Book list page; owns the `showModal` state and passes it to `BookCreateModal` |
