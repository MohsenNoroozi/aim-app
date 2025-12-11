<template>
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
</template>

<script setup>
import {computed} from "vue"
import QuestionItem from "pages/Assessment/QuestionItem.vue"

const props = defineProps({
  assessment: {
    type: Object,
    default: () => ({pages: []})
  },
  pageIndex: {
    type: Number,
  },
  modelValue: {
    /** responses: { [questionId]: responseOptionId } */
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update:modelValue'])

const currentPage = computed(() => (props.assessment?.pages ?? [])[props.pageIndex] ?? {})

const onResponseChange = (questionId, optionId) => emit('update:modelValue', {
  ...props.modelValue,
  [questionId]: optionId
})
</script>
