const routes = [
  {
    path: '',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/IndexPage.vue')
      },
    ],
  },
  /* Assessment */
  {
    path: '/assessment/:id',
    props: true,
    name: 'Assessment',
    component: () => import('pages/Assessment/AssessmentPage.vue'),
    children: [
      {
        path: ':pageId',
        props: true,
        name: 'Assessment Page',
        component: () => import('pages/Assessment/PageComponent.vue'),
      },
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
