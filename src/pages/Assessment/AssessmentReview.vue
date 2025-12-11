<template>
  <div class="column fit">
    <div class="col">
      <div class="column fit">
        <div class="col-auto row items-center q-mb-md">
          <div class="col">
            <div class="text-h6">Review your answers</div>
            <div class="text-caption text-grey-7">
              {{ answeredCount }} / {{ totalQuestions }} questions answered
            </div>
          </div>

          <div class="col-auto">
            <q-chip :color="allAnswered ? 'positive' : 'warning'" text-color="white" icon="task_alt">
              {{ allAnswered ? 'All questions answered' : 'Some questions are missing' }}
            </q-chip>
          </div>
        </div>

        <q-list class="col overflow-auto">
          <q-expansion-item v-for="(page, pageIndex) in assessment.pages || []" :key="page.id || pageIndex" default-opened class="bg-grey-2 rounded-borders q-mb-md">
            <template #header>
              <q-item-section>
                <q-item-label class="text-h6">{{ `Page ${pageIndex + 1}` }}</q-item-label>
                <q-item-label caption>{{ pageCaption(page, pageIndex) }}</q-item-label>
              </q-item-section>

              <q-item-section side>
                <q-btn outline size="sm" color="primary" icon="edit" label="EDIT PAGE" @click.stop="$emit('edit-page', pageIndex + 1)"/>
              </q-item-section>
            </template>

            <div class="q-pa-sm">
            <q-list bordered class="bg-white" separator>
              <q-item v-for="(question, j) in page?.['questions'] || []" :key="question.id" class="q-py-xs" clickable>
                <q-item-section thumbnail>
                  <q-avatar :text-color="responses[question.id] ? 'grey' : 'orange'" size="md" rounded class="q-px-sm">
                    <div class="text-subtitle1 text-bold">{{ j + 1 }}</div>
                  </q-avatar>
                </q-item-section>

                <q-item-section>
                  <q-item-label class="text-body2">{{ question.text }}</q-item-label>
                </q-item-section>

                <q-item-section side>
                  <q-item-label caption>
                    <template v-if="responses[question.id]">
                      <q-chip color="grey-2" text-color="primary">
                        {{ getAnswerLabel(question) }}
                      </q-chip>
                    </template>
                    <template v-else>
                      <span class="text-orange">No answer provided</span>
                    </template>
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
            </div>
            </q-expansion-item>
        </q-list>
      </div>
    </div>

    <div class="col-auto q-pt-md">
      <div class="row items-center justify-between">
        <div class="text-body2 text-grey-7">
          You can still change your answers by editing pages above.
        </div>
        <q-btn
          color="primary"
          icon-right="send"
          label="Submit answers"
          :disable="!allAnswered || submitting"
          :loading="submitting"
          @click="emit('submit')"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  assessment: {
    type: Object,
    required: true
  },
  // { [questionId]: value }
  responses: {
    type: Object,
    required: true
  },
  // parent tells us whether everything is answered
  allAnswered: {
    type: Boolean,
    default: false
  },
  submitting: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['edit-page', 'submit'])

const totalQuestions = computed(() =>
  (props.assessment?.pages ?? []).reduce(
    (count, page) => count + (page?.questions?.length ?? 0),
    0
  )
)

const answeredCount = computed(() => {
  const pages = props.assessment?.pages ?? []
  let count = 0

  pages.forEach(page => {
    ;(page?.questions ?? []).forEach(q => {
      const ans = props.responses?.[q.id]
      if (ans !== null && ans !== undefined && ans !== '') {
        count++
      }
    })
  })

  return count
})

function pageAnsweredCount(pageIndex) {
  const page = props.assessment?.pages?.[pageIndex]
  if (!page || !Array.isArray(page.questions)) return 0

  return page.questions.reduce((acc, q) => {
    const ans = props.responses?.[q.id]
    return acc + (ans !== null && ans !== undefined && ans !== '' ? 1 : 0)
  }, 0)
}

function pageCaption(page, pageIndex) {
  const total = page?.questions?.length || 0
  const answered = pageAnsweredCount(pageIndex)
  if (!total) return 'No questions'
  return `${answered} / ${total} answered`
}

function getAnswerLabel(question) {
  const raw = props.responses?.[question.id]
  if (raw == null || raw === '') return ''

  // Try to resolve option label if question has options
  const options = question.responseOptions || question.options || []
  if (Array.isArray(options) && options.length) {
    const found = options.find(
      opt => opt.id === raw || opt.value === raw
    )
    if (found) {
      return found.label || found.text || String(raw)
    }
  }

  // Fallback to raw value
  if (Array.isArray(raw)) {
    return raw.join(', ')
  }
  return String(raw)
}
</script>

<style scoped lang="scss">
.q-expansion-item {
  border: none !important;
}
</style>
