import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'books-list',
      component: () => import('../views/BookListView.vue'),
    },
    {
      // Must come before /books/:id to prevent "create" being treated as an id
      path: '/books/create',
      name: 'books-create',
      component: () => import('../views/BookCreateView.vue'),
    },
    {
      path: '/books/:id',
      name: 'books-detail',
      component: () => import('../views/BookDetailView.vue'),
    },
    {
      path: '/books/:id/edit',
      name: 'books-edit',
      component: () => import('../views/BookEditView.vue'),
    },
  ],
})

export default router
