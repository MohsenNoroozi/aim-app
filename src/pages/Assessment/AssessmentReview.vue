<template>
  <div class="column fit">
    <div class="col-auto q-mb-sm full-width">
      <q-item class="q-pa-none">
        <q-item-section>
          <q-item-label lines="1" class="text-h6">Review your answers</q-item-label>
          <q-item-label caption lines="1">{{ answeredCount }} / {{ totalQuestions }} questions answered</q-item-label>
        </q-item-section>
        <q-item-section side class="gt-sm">
          <q-chip :color="allAnswered ? 'positive' : 'warning'" text-color="white" icon="task_alt">
            {{ allAnswered ? 'All questions answered' : 'Some questions are missing' }}
          </q-chip>
        </q-item-section>
      </q-item>
    </div>

    <div class="col full-width">
      <q-separator inset />
      <q-list id="pages-wrapper">
        <q-expansion-item v-for="(page, pageIndex) in assessment.pages || []" :key="page.id || pageIndex" default-opened class="bg-grey-2 rounded-borders q-my-md">
          <template #header>
            <q-item-section>
              <q-item-label class="text-h6">{{ `Page ${pageIndex + 1}` }}</q-item-label>
              <q-item-label caption>{{ pageCaption(page, pageIndex) }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-btn outline size="sm" color="grey-7" icon="edit" label="EDIT PAGE" @click.stop="$emit('edit-page', pageIndex + 1)"/>
            </q-item-section>
          </template>

          <div class="q-pa-sm">
            <q-list bordered class="bg-white" separator>
              <q-item v-for="(question, j) in page?.['questions'] || []" :key="question.id" class="q-py-sm" clickable>
                <q-item-section thumbnail>
                  <q-avatar text-color="grey" size="sm" rounded class="q-px-sm">
                    <div class="text-subtitle1 text-bold">{{ j + 1 }}</div>
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-body2 q-px-sm">{{ question.text }}</q-item-label>
                  <q-item-label caption class="full-width">
                    <q-chip v-if="responses[question.id]" color="grey-2">
                      <q-avatar size="sm" rounded color="grey-3" text-color="grey-7">
                        {{ (getAnswer(question)?.index ?? 0) + 1 }}
                      </q-avatar>
                      <div class="text-caption text-grey-9 ellipsis">{{ getAnswer(question)?.label ?? '' }}</div>
                    </q-chip>
                    <span v-else class="text-orange">No answer provided</span>
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
        </q-expansion-item>
      </q-list>
      <q-separator inset />
    </div>

    <div class="col-auto">
      <q-item dense>
        <q-item-section>
          <q-item-label lines="2" class="text-body2 text-grey-7 gt-xs">You can still change your answers by editing pages above.</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn
            color="primary"
            icon-right="send"
            label="Submit answers"
            :disable="!allAnswered || submitting"
            :loading="submitting"
            @click="emit('submit')"
            class="q-mt-sm"
          />
        </q-item-section>
      </q-item>
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
  responses: {
    type: Object,
    required: true
  },
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

function getAnswer(question) {
  const raw = props.responses?.[question.id]
  if (raw == null || raw === '') return ''

  const options = question.responseOptions || question.options || []
  if (Array.isArray(options) && options.length) {
    const index = options.findIndex(opt => opt.id === raw || opt.value === raw)
    return {label: options[index]?.label ?? String(raw), index}
  }
}
</script>

<style scoped lang="scss">
.q-expansion-item {
  border: none !important;
}
#pages-wrapper {
  max-height: calc(100vh - 324px);
  overflow-y: auto;
}
@media (max-width: 1024px) {
  #pages-wrapper {
    max-height: calc(100vh - 300px);
  }
}
</style>
