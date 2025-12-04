<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="row">
      <div class="col-11 col-md-10 col-lg-9 col-xl-8 q-mx-auto q-px-none">
        <q-toolbar style="height:90px">
          <img :src="assessment?.organisation?.logo ?? '/images/logo.png'" alt=" " height="56px" />
        </q-toolbar>
        <q-separator color="grey" />
      </div>
    </q-header>
    <q-page-container class="bg-light-page">
      <div class="relative-position">
        <div class="absolute row full-width" style="z-index:9999;margin-top:-250px;">
          <div class="col-11 col-md-10 col-lg-9 col-xl-8 q-mx-auto">

            <q-page>
              <q-item class="q-my-md">
                <q-item-section>
                  <q-item-label class="text-h6 text-white">{{ assessment?.title }}</q-item-label>
                  <q-item-label class="text-subtitle2 text-grey-5">{{ totalQuestions }} questions - {{ estimatedDurationMinutes }} minutes</q-item-label>
                </q-item-section>
              </q-item>
              <q-card style="min-height: 300px">
                <q-card-section>
                  <router-view v-slot="{ Component }">
                    <keep-alive>
                      <component :is="Component" :assessment="assessment" />
                    </keep-alive>
                  </router-view>
                </q-card-section>
              </q-card>
            </q-page>

          </div>
        </div>
      </div>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import {computed, onMounted, ref} from "vue"
import {useRoute} from "vue-router"
import {api} from "boot/xhr.js"

const route = useRoute()
const loading = ref(false)
const assessment = ref({})

const totalQuestions = computed(() =>
  (assessment.value?.pages ?? []).reduce(
    (count, page) => count + (page?.['questions']?.length ?? 0),
    0
  )
)

const estimatedDurationMinutes = computed(() => {
  let total = 0;
  (assessment.value?.pages ?? []).forEach(page => {
    page.questions.forEach(q => {
      total += 0.5 * (q.weight || 1)
    })
  })
  return Math.round(total / 2) * 2
})

onMounted(() => {
  loading.value = true
  api()
    .get(`/assessments/${route.params.id}`)
    .then(r => assessment.value = r.data)
    .finally(() => loading.value = false)
})
</script>

<style lang="scss" scoped>
.q-header {
  background-image: url("/images/header-bg.jpg");
  height: 350px;
}
.bg-gradient {
  background: linear-gradient(60deg, rgba(84,58,183,1) 0%, rgba(0,172,193,1) 100%);
}
</style>
