const routes = [
  {
    path: '',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'Home',
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
            path: 'introduction',
            name: 'Assessment Introduction',
            component: () => import('pages/Assessment/AssessmentIntro.vue'),
          },
          {
            path: 'pages',
            name: 'Assessment Pages',
            component: () => import('pages/Assessment/AssessmentPages.vue'),
          },
          {
            path: 'feedback/:submissionUuid',
            props: true,
            name: 'Assessment Feedback',
            component: () => import('pages/Assessment/AssessmentFeedback.vue'),
          },
          {
            path: 'confirmation',
            name: 'Assessment Confirmation',
            component: () => import('pages/Assessment/AssessmentConfirmation.vue'),
          }
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
