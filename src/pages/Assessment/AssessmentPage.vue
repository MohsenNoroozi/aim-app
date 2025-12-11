<template>
  <q-page>
    <div class="row">
      <div class="col-11 col-md-10 col-lg-9 col-xl-8 q-mx-auto">
        <q-item style="height:80px">
          <q-item-section avatar>
            <img :src="assessment?.['organisation']?.['logo'] ?? '/images/logo.png'" alt=" " height="64px"/>
          </q-item-section>
          <q-item-section class="text-right">
            <q-item-label class="text-h6 text-white ellipsis">{{ assessment?.title }}</q-item-label>
            <q-item-label class="text-subtitle2 text-grey-5">3 pages / {{ totalQuestions }} questions / ~{{ estimatedDurationMinutes }} minutes</q-item-label>
          </q-item-section>
        </q-item>
        <router-view v-slot="{ Component }">
          <component :is="Component" :assessment="assessment"/>
        </router-view>
        <div class="fixed-bottom text-caption text-center q-pa-sm">
          <span class="text-grey">Powered by</span> AIM
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import {computed, onMounted, ref} from "vue"
import {useRoute} from "vue-router"
import {api} from "boot/xhr.js"

const route = useRoute()
const loading = ref(false)
const assessment = ref({})

const totalQuestions = computed(() => (assessment.value?.pages ?? []).reduce((count, page) => count + (page?.['questions']?.length ?? 0), 0))
const estimatedDurationMinutes = computed(() => {
  let total = 0;
  (assessment.value?.pages ?? []).forEach(p => (p?.['questions'] ?? []).forEach(q => total += 0.5 * (q.weight || 1)))
  return Math.round(total / 2) * 2
})

onMounted(() => {
  loading.value = true
  api()
    .get(`/assessments/${route.params.uuid}`)
    .then(r => assessment.value = r.data)
    .finally(() => loading.value = false)
})
</script>
