<template>
  <div>
    <div>Page {{ pageId }}</div>
    <q-list v-if="page?.['questions']">
      <q-item v-for="question in page.questions" :key="question.id">
        <q-item-section>
          <q-item-label>{{ question?.text ?? '' }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script setup>
import {useRoute} from "vue-router"
import {ref, watch} from "vue"

const props = defineProps({
  assessment: {
    type: Object,
    default: () => ({pages: []})
  }
})

const route = useRoute()
const page = ref({questions: []})
const pageId = route.params?.['pageId'] ?? null

watch(() => props.assessment?.pages, v => {
  page.value = v?.[pageId - 1]
}, {immediate: true, deep: true})
</script>

<style lang="scss" scoped>

</style>
