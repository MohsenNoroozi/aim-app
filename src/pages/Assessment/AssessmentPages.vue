<template>
  <q-stepper
    v-model="currentStep"
    :contracted="$q.screen.lt.md"
    animated
    color="red"
    active-icon="lens"
    active-color="white"
    done-color="grey-3"
    inactive-color="grey-2"
    :header-nav="true"
    alternative-labels
    keep-alive
    flat
    class="transparent"
    header-class="q-mb-sm"
  >
    <q-step
      v-for="(page, index) in assessment?.['pages'] || []"
      :key="page.id || index"
      :done="isPageComplete(index + 1)"
      :disable="!isPageComplete(index)"
      :name="'page-' + (index + 1)"
      :title="'Page ' + (index + 1)"
    >
      <q-card class="page-card">
        <q-card-section >
          <PageComponent
            v-model="responses"
            :assessment="assessment"
            :page-index="index"
          />
        </q-card-section>
        <q-card-actions align="right" class="q-mb-md">
          <q-btn v-if="currentStep !== 'page-1'" class="q-ml-sm" color="primary" flat label="Back" @click="goPrev"/>
          <q-btn color="primary" label="Continue" icon-right="arrow_circle_right" padding="5px 16px" :disable="!isPageComplete(index + 1)" @click="goNext" />
        </q-card-actions>
      </q-card>
    </q-step>

    <q-step
      :disable="!allQuestionsAnswered"
      name="review"
      title="Review"
    >
      <q-card>
        <q-card-section class="page-card">
          <AssessmentReview
            :assessment="assessment"
            :responses="responses"
            :all-answered="allQuestionsAnswered"
            :submitting="loading === 'submit'"
            @edit-page="pageIndex => currentStep = 'page-' + pageIndex"
            @submit="submit"
          />
        </q-card-section>
      </q-card>
    </q-step>
  </q-stepper>
</template>

<script setup>
import {computed, ref, watch} from 'vue'
import {useRoute} from 'vue-router'
import {useQuasar} from 'quasar'
import {api} from 'boot/xhr.js'
import {buildMeta} from "boot/helper.js"
import PageComponent from "pages/Assessment/PageComponent.vue"
import AssessmentReview from "pages/Assessment/AssessmentReview.vue"

const props = defineProps({
  assessment: {
    type: Object,
    required: true,
  }
})

const $q = useQuasar()
const route = useRoute()
const loading = ref('')
const responses = ref({ /* [questionId]: responseOptionId */})
const currentStep = ref('page-1')

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
  const pages = props.assessment?.pages ?? []
  const page = pages[pageNumber - 1]
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
        answers: Object.entries(responses.value).map(([questionId, responseOptionId]) => ({questionId, responseOptionId})),
        startedAt: startTime ? Number(startTime) : null,
        meta: buildMeta()
      })
      .then(() => {
        // $q.localStorage.removeItem(`assessment:${assessmentId}:startTime`)
        // $q.localStorage.removeItem(`assessment:${assessmentId}:responses`)
        // responses.value = {}
        $q.notify({type: 'positive', message: 'Your responses have been submitted.'})
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

</script>

<style lang="scss">
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
.q-stepper__step-inner {
  padding: 0 !important;
  margin: 0 !important;
}
.page-card {
  height: calc(100vh - 196px) !important;
  overflow-y: auto;
  margin-top: 8px;
  margin-bottom: 8px;
}
</style>
