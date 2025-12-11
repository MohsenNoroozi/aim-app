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
    path: '/assessment',
    component: () => import('layouts/AssessmentLayout.vue'),
    children: [
      {
        path: ':uuid',
        props: true,
        name: 'Assessment',
        component: () => import('pages/Assessment/AssessmentPage.vue'),
        children: [
          {
            path: 'pages',
            props: true,
            name: 'Assessment Pages',
            component: () => import('pages/Assessment/AssessmentPages.vue'),
          },
        ]
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
