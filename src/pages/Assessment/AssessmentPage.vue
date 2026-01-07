<template>
  <q-page>
    <div class="row">
      <div class="col-11 col-md-10 col-lg-9 col-xl-8 q-mx-auto">

        <q-item v-if="!loading" class="q-px-none" style="height:80px">
          <q-item-section avatar>
            <img :src="assessment?.['organisation']?.['logo'] ?? '/images/logo.png'" alt=" " height="64px"/>
          </q-item-section>
          <q-item-section class="text-right">
            <q-item-label class="text-h6 text-white ellipsis">
              <router-link :to="{name: 'Assessment Introduction', params: {uuid: assessment.uuid}}" class="no-decoration">
                {{ assessment?.title }}
              </router-link>
            </q-item-label>
            <q-item-label class="text-subtitle2 text-grey-5 ellipsis">{{ assessment?.pages?.length ?? 1 }} pages / {{ totalQuestions }} questions / ~{{ estimatedDuration }} minutes</q-item-label>
          </q-item-section>
        </q-item>

        <q-item v-else class="q-px-none" style="height:80px">
          <q-item-section avatar>
            <q-skeleton type="QAvatar" size="64px" animation="pulse" />
          </q-item-section>
          <q-item-section>
            <div>
              <q-skeleton type="text" square width="320px" animation="fade" class="q-ml-auto" />
              <q-skeleton type="text" square width="220px" height="12px" animation="fade" class="q-ml-auto" />
            </div>
          </q-item-section>
        </q-item>

        <div style="margin-bottom:36px">
          <router-view v-slot="{ Component }">
            <component :is="Component" :assessment="assessment" :assessment-loading="loading" />
          </router-view>
        </div>
        <div class="absolute-bottom text-caption text-center q-py-sm">
          <PoweredLink />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import {computed, onMounted, provide, readonly, ref} from "vue"
import {useRoute} from "vue-router"
import {api} from "boot/xhr.js"
import PoweredLink from "components/PoweredLink.vue"

const route = useRoute()
const loading = ref(false)
const assessment = ref({})

const totalQuestions = computed(() => (assessment.value?.pages ?? []).reduce((count, page) => count + (page?.['questions']?.length ?? 0), 0))
const estimatedDuration = computed(() => {
  const t = assessment.value?.['estimatedDuration'] ?? ''
  if (t > 5) return t
  let total = 0;
  (assessment.value?.pages ?? []).forEach(p => (p?.['questions'] ?? []).forEach(q => total += 0.32 + ((q.weight || 1) * .1)))
  return  Math.max(5, Math.round(total))
})

provide('totalQuestions', readonly(totalQuestions))
provide('estimatedDuration', readonly(estimatedDuration))

onMounted(() => {
  loading.value = true
  api()
    .get(`/assessments/${route.params.uuid}`)
    .then(r => assessment.value = r.data)
    .finally(() => loading.value = false)
})
</script>


press_photos
