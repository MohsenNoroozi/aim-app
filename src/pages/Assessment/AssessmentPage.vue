<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="row">
      <div class="col-11 col-md-10 col-lg-9 col-xl-8 q-mx-auto q-px-none">
        <q-toolbar style="height:80px">
          <img :src="assessment?.organisation?.logo ?? '/images/logo.png'" alt=" " height="64px" />
        </q-toolbar>
        <q-separator color="grey" />
      </div>
    </q-header>
    <q-page-container class="bg-light-page">
      <div class="relative-position">
        <div class="absolute row full-width" style="z-index:9999;margin-top:-270px">
          <div class="col-11 col-md-10 col-lg-9 col-xl-8 q-mx-auto">

            <q-page>
              <q-item class="q-my-sm">
                <q-item-section>
                  <q-item-label class="text-h6 text-white">{{ assessment?.title }}</q-item-label>
                  <q-item-label class="text-subtitle2 text-grey-5">3 pages / {{ totalQuestions }} questions / ~{{ estimatedDurationMinutes }} minutes</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-pagination
                    v-model="currentPage"
                    :max="maxPage"
                    :min="1"
                    :max-pages="7"
                    direction-links
                    rounded
                    color="transparent"
                    text-color="white"
                    active-color="primary"
                  />
                </q-item-section>
              </q-item>
              <q-card flat bordered>
                <q-card-section class="overflow-auto q-my-sm q-py-none" style="height:calc(100vh - 210px);overflow-x:hidden !important">
                  <router-view v-slot="{ Component, route }">
                    <Transition :name="transitionName" mode="out-in">
                      <component
                        :is="Component"
                        :key="route.params.pageId"
                        :assessment="assessment"
                        v-model="responses"
                      />
                    </transition>
                  </router-view>
                </q-card-section>
              </q-card>
              <div class="fixed-bottom text-caption text-center q-pa-sm">
                <span class="text-grey">Powered by</span> AIM
              </div>
            </q-page>

          </div>
        </div>
      </div>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import {computed, onMounted, ref, watch} from "vue"
import {useRoute, useRouter} from "vue-router"
import {api} from "boot/xhr.js"

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const assessment = ref({})
const responses = ref({
  // [questionId]: responseOptionId
  // e.g. 1: 4, 2: 10, ...
})
const transitionName = ref('slide-left')

const maxPage = computed(() => assessment.value?.pages?.length || 1)
const currentPage = computed({
  get() {
    return Number(route.params.pageId || 1)
  },
  set(val) {
    // keep it in range just in case
    const page = Math.min(Math.max(1, val), maxPage.value)
    router.replace({name: 'Assessment Page', params: {id: route.params.id, pageId: page}})
  }
})

const totalQuestions = computed(() => (assessment.value?.pages ?? []).reduce((count, page) => count + (page?.['questions']?.length ?? 0), 0))

const estimatedDurationMinutes = computed(() => {
  let total = 0;
  (assessment.value?.pages ?? []).forEach(p => {
    (p?.['questions'] ?? []).forEach(q => total += 0.5 * (q.weight || 1))
  })
  return Math.round(total / 2) * 2
})

watch(() => currentPage.value, (newVal, oldVal) =>
  (oldVal == null) || (transitionName.value = newVal > oldVal ? 'slide-left' : 'slide-right')
)

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

.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform 0.15s ease, opacity 0.15s ease;
  overflow: hidden !important;
}

.slide-left-enter-from,
.slide-right-leave-to {
  transform: translateX(24px);
  opacity: 0;
}

.slide-left-leave-to,
.slide-right-enter-from {
  transform: translateX(-24px);
  opacity: 0;
}
</style>
