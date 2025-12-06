<template>
  <div>
    <div class="page-header q-mb-md">
      <div class="row items-center justify-between q-mb-sm">
        <div>
          <div class="text-h6">Page {{ currentPage?.position ?? pageId }}</div>
          <div class="text-caption text-grey-6">
            {{ (currentPage?.questions || []).length }} questions on this page
          </div>
        </div>
      </div>
      <q-separator/>
    </div>
    <q-list v-if="currentPage?.['questions']">
      <QuestionItem
        v-for="(question, i) in currentPage['questions']"
        :key="question.id"
        :index="i + 1"
        :model-value="modelValue[question.id] ?? null"
        :question="question"
        @update:model-value="val => onResponseChange(question.id, val)"
      />
    </q-list>
  </div>
</template>

<script setup>
import {computed} from "vue"
import {useRoute} from "vue-router"
import QuestionItem from "pages/Assessment/QuestionItem.vue"

const props = defineProps({
  assessment: {
    type: Object,
    default: () => ({pages: []})
  },
  modelValue: {
    /** responses: { [questionId]: responseOptionId } */
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update:modelValue'])

const route = useRoute()
const pageId = computed(() => {
  const raw = route.params?.['pageId']
  const n = Number(raw)
  return Number.isFinite(n) ? n : 1
})

const currentPage = computed(() => (props.assessment?.pages ?? [])[pageId.value - 1] ?? {})

function onResponseChange(questionId, optionId) {
  // emit a new object (keeps things immutable / devtools-friendly)
  emit('update:modelValue', {
    ...props.modelValue,
    [questionId]: optionId
  })
}
</script>

<style lang="scss" scoped>
.page-wrapper {
  max-width: 1100px;
  margin: 0 auto;
}
</style>
