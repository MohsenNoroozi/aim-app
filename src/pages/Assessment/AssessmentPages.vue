<template>
  <q-stepper
    v-if="!assessmentLoading"
    v-model="currentStep"
    :contracted="$q.screen.lt.md"
    :header-nav="true"
    active-color="white"
    active-icon="lens"
    alternative-labels
    animated
    class="transparent"
    color="red"
    done-color="grey-3"
    flat
    inactive-color="grey-2"
    header-class="q-my-sm"
    keep-alive
  >
    <q-step
      v-for="(page, index) in assessment?.['pages'] || []"
      :key="page.id || index"
      :disable="!isPageComplete(index)"
      :done="isPageComplete(index + 1)"
      :name="'page-' + (index + 1)"
      :title="page.title || page?.pillar?.name || 'Page ' + (index + 1)"
    >
      <q-card>
        <q-card-section>
          <transition appear :name="transitionName" mode="out-in">
            <PageComponent
              key="assessment-pages-content"
              v-model="responses"
              :assessment="assessment"
              :page-index="index"
            />
          </transition>
        </q-card-section>
        <q-card-actions align="right" class="q-mb-md">
          <q-btn v-if="currentStep !== 'page-1'" class="q-ml-sm" color="primary" flat label="Back" @click="goPrev"/>
          <q-btn :disable="!isPageComplete(index + 1)" color="primary" icon-right="arrow_circle_right" label="Continue" padding="5px 16px" @click="goNext"/>
        </q-card-actions>
      </q-card>
    </q-step>

    <q-step
      :disable="!allQuestionsAnswered"
      name="review"
      title="Review"
    >
      <q-card>
        <q-card-section>
          <AssessmentReview
            :all-answered="allQuestionsAnswered"
            :assessment="assessment"
            :responses="responses"
            :submitting="loading === 'submit'"
            @submit="submit"
            @edit-page="pageIndex => currentStep = 'page-' + pageIndex"
          />
        </q-card-section>
      </q-card>
    </q-step>
  </q-stepper>

  <template v-else>
    <q-toolbar class="toolbar-skeleton q-mb-xs-xs q-mb-md-lg q-px-none">
      <svg class="toolbar-line" viewBox="0 0 100 1" preserveAspectRatio="none">
        <defs>
          <mask id="line-mask">
            <rect x="16.66" y="0" width="66.68" height="1" fill="white" />

            <circle cx="16.66" cy="0.5" r="4" fill="black" />
            <circle cx="49.98" cy="0.5" r="4" fill="black" />
            <circle cx="83.34" cy="0.5" r="4" fill="black" />
          </mask>
        </defs>

        <rect x="0" y="0" width="100" height="1" fill="white" mask="url(#line-mask)"/>
      </svg>

      <q-toolbar-title class="q-mx-lg q-px-none skeleton-wrapper">
        <q-skeleton type="QAvatar" size="24px" animation="pulse" />
      </q-toolbar-title>

      <q-toolbar-title class="q-mx-lg q-px-none skeleton-wrapper">
        <q-skeleton type="QAvatar" size="24px" animation="pulse" />
      </q-toolbar-title>

      <q-toolbar-title class="q-mx-lg q-px-none skeleton-wrapper">
        <q-skeleton type="QAvatar" size="24px" animation="pulse" />
      </q-toolbar-title>
    </q-toolbar>

    <q-card style="min-height:50vh;max-height:calc(100vh - 200px)">
      <q-card-actions align="center">
        <q-inner-loading class="transparent" showing transition-duration="500" style="max-height:80vh">
          <template v-slot:default>
            <div class="text-center">
              <q-spinner-hourglass color="grey-9" size="1.5em"/>
              <div class="text-grey-9">Loading, Please wait...</div>
            </div>
          </template>
        </q-inner-loading>
      </q-card-actions>
    </q-card>
  </template>
</template>

<script setup>
import {computed, ref, watch} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {useQuasar} from 'quasar'
import {api} from 'boot/xhr.js'
import {buildMeta} from "boot/helper.js"
import PageComponent from "pages/Assessment/PageComponent.vue"
import AssessmentReview from "pages/Assessment/AssessmentReview.vue"

const props = defineProps({
  assessment: {
    type: Object,
    required: true,
  },
  assessmentLoading: {
    type: Boolean,
    default: false,
  }
})

const $q = useQuasar()
const route = useRoute()
const router = useRouter()
const loading = ref('')
const responses = ref({ /* [questionId]: responseOptionId */})
const currentStep = ref('page-1')
const transitionName = ref('collapse-down')

const steps = computed(() => [
  ...(props.assessment?.pages ?? []).map((_, index) => `page-${index + 1}`),
  'review'
])

const totalQuestions = computed(() => (props.assessment?.pages ?? []).reduce((count, page) => count + (page?.['questions']?.length ?? 0), 0))

const answeredCount = computed(() => {
  let count = 0;
  (props.assessment?.pages ?? []).forEach(p =>
    (p?.['questions'] ?? []).forEach(q => {
      const ans = responses.value?.[q.id]
      if (ans !== null && ans !== undefined && ans !== '') count++
    })
  )
  return count
})

const allQuestionsAnswered = computed(() => totalQuestions.value > 0 && answeredCount.value === totalQuestions.value)

const isPageComplete = pageNumber => {
  const page = (props.assessment?.pages ?? [])[pageNumber - 1]
  if (!page || !Array.isArray(page?.['questions'])) return true

  return page?.['questions'].every(q => {
    const ans = responses.value?.[q.id]
    return ans !== null && ans !== undefined && ans !== ''
  })
}

const goPrev = () => {
  const idx = steps.value.indexOf(currentStep.value)
  if (idx <= 0) return
  currentStep.value = steps.value[idx - 1]
}

const goNext = () => {
  const idx = steps.value.indexOf(currentStep.value)
  if (idx === -1 || idx >= steps.value.length - 1) return
  currentStep.value = steps.value[idx + 1]
}

const submit = () => {
  const assessmentId = props.assessment?.id
  const startTime = $q.localStorage.getItem(`assessment:${assessmentId}:startTime`)
  $q.dialog({
    title: 'Submit your answers?',
    message: 'Once submitted, you cannot make further changes.',
    ok: {
      label: 'Submit',
      color: 'primary',
      iconRight: 'send',
      padding: '5px 16px'
    },
    cancel: {
      label: 'Cancel',
      flat: true
    },
    persistent: true
  }).onOk(() => {
    loading.value = 'submit'
    api()
      .post(`/assessments/${route.params['uuid']}/submit`, {
        answers: Object.entries(responses.value).map(([questionId, responseOptionId]) => ({
          questionId,
          responseOptionId
        })),
        startedAt: startTime ? Number(startTime) : null,
        meta: buildMeta()
      })
      .then(r => {
        $q.localStorage.removeItem(`assessment:${assessmentId}:startTime`)
        router.replace({name: 'Assessment Feedback', params: {uuid: route.params['uuid'], submissionUuid: r.data.uuid}})
        responses.value = {}
      })
      .finally(() => loading.value = '')
  })
}

// Load responses from localStorage when assessment ID becomes available
watch(() => props.assessment?.id, v => {
    if (!v) return
    const savedResponses = $q.localStorage.getItem(`assessment:${v}:responses`)
    if (savedResponses) responses.value = savedResponses
  },
  {immediate: true}
)

// Detect first user response → save startTime once
watch(() => responses.value, v => {
    const assessmentId = props.assessment?.id
    if (!assessmentId) return;
    if (!$q.localStorage.getItem(`assessment:${assessmentId}:startTime`) && Object.values(v).length) {
      $q.localStorage.setItem(`assessment:${assessmentId}:startTime`, Date.now())
    }
    $q.localStorage.setItem(`assessment:${assessmentId}:responses`, v)
  },
  {deep: true}
)

// don't animate the page after currentStep changed
watch(() => currentStep.value, () => transitionName.value = 'none')
</script>

<style lang="scss" scoped>
:deep(.q-stepper__header) {
  &.q-stepper__header--contracted {
    min-height: 36px !important;
  }
  .q-stepper__tab {
    padding: 4px !important;
    min-height: 0 !important;

    .q-stepper__dot * {
      color: $primary !important;
    }

    .q-stepper__line:before, .q-stepper__line:after {
      background: rgba(255, 255, 255, 0.275) !important;
    }
  }
}

:deep(.q-stepper__content) {
  .q-stepper__step-inner {
    padding: 0 !important;
    margin: 0 !important;
  }
}

.toolbar-skeleton {
  position: relative;
  height: 48px;
}

.toolbar-line {
  margin: 0 !important;
  position: absolute;
  width: 100% !important;
  left: 0;
  right: 0;
  top: 50%;
  height: 1px;
  transform: translateY(-50%);
  pointer-events: none;
}

.skeleton-wrapper {
  position: relative;
  z-index: 2;
  display: flex;
  justify-content: center;
}


</style>
