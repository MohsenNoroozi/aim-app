<template>
  <div class="intro-container q-mx-auto" style="max-width:650px">
    <!-- Header Section -->
    <div class="intro-header q-py-sm q-pr-md q-mb-lg">
      <q-item class="items-center">
        <q-item-section avatar>
          <q-avatar class="intro-avatar" size="60px">
            <q-icon color="white" name="rocket_launch" size="36px"/>
          </q-avatar>
        </q-item-section>

        <q-item-section class="text-white">
          <transition appear mode="out-in" name="reveal-x">
            <q-item-label key="intro-title" class="text-h5 text-bold header-title">
              Before You Begin
            </q-item-label>
          </transition>
          <transition appear mode="out-in" name="reveal-x">
            <q-item-label key="intro-sub" class="text-subtitle2 header-subtitle">
              Quick overview of what to expect
            </q-item-label>
          </transition>
        </q-item-section>
      </q-item>
    </div>

    <!-- Main Content Card -->
    <q-card bordered flat class="intro-content-card">
      <q-card-section class="q-pa-lg q-pa-md-xl">
        <transition appear mode="out-in" name="fade">
          <div key="intro-content">
            <!-- Assessment Title Section -->
            <div class="text-center q-mb-lg">
              <div class="text-subtitle1 text-grey-7 q-mb-xs">Welcome to</div>
              <div class="text-h4 text-grey-9 text-weight-bold q-mb-sm">
                {{ assessment?.title || 'Assessment' }}
              </div>

              <transition appear name="scale">
                <q-chip class="assessment-stats-chip" color="blue-1" text-color="blue-9" size="md">
                  <div class="stat-item">
                    <q-icon name="quiz" size="16px" class="q-mr-sm"/>
                    {{ totalQuestions || 0 }} questions
                  </div>
                  <q-separator vertical spaced color="white" />
                  <div class="stat-item">
                    <q-icon name="schedule" size="16px" class="q-mr-sm"/>
                    {{ estimatedDuration || 0 }} minutes
                  </div>
                </q-chip>
              </transition>
            </div>

            <!-- Loading State -->
            <div v-if="loading" class="q-mb-lg">
              <q-skeleton type="text" width="40%" class="q-mb-sm"/>
              <q-skeleton type="text" width="65%"/>
              <div class="row q-mt-lg">
                <q-skeleton type="circle" size="40px" class="q-mr-md"/>
                <q-skeleton type="text" width="70%"/>
              </div>
            </div>

            <!-- Tips Section (Admin Defined) -->
            <div v-if="hasTips" class="q-mb-xl">
              <q-item dense class="q-mb-md">
                <q-item-section avatar top>
                  <q-icon color="amber" name="lightbulb" size="28px"/>
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-subtitle1 text-weight-bold text-amber-9">
                    Helpful Tips
                  </q-item-label>
                  <q-item-label class="text-caption text-grey-7">
                    Important insights to maximize your results
                  </q-item-label>
                </q-item-section>
              </q-item>

              <q-card flat bordered class="tips-card q-mb-md">
                <q-card-section class="q-pa-md">
                  <div v-for="(tip, index) in formattedTips" :key="index"
                       class="tip-item q-pb-sm q-pt-xs">
                    <div class="row items-start">
                      <q-icon name="circle" size="8px" class="q-mt-xs q-mr-sm text-primary"/>
                      <div class="text-body2 text-grey-8">{{ tip }}</div>
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </div>

            <!-- Overview Section -->
            <div class="q-mb-lg">
              <q-item dense class="q-mb-md">
                <q-item-section avatar top>
                  <q-icon color="primary" name="info" size="28px"/>
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-subtitle1 text-weight-bold">
                    What to Expect
                  </q-item-label>
                  <q-item-label class="text-caption text-grey-7">
                    Key details to ensure a smooth experience
                  </q-item-label>
                </q-item-section>
              </q-item>

              <q-list bordered class="rounded-borders overview-list">
                <q-item class="overview-item q-py-md">
                  <q-item-section avatar>
                    <q-avatar class="overview-icon" size="36px" color="blue-1">
                      <q-icon name="schedule" color="blue-7" size="18px"/>
                    </q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-body2 text-weight-medium">
                      Time Commitment
                    </q-item-label>
                    <q-item-label class="text-caption text-grey-7">
                      Approximately <span class="text-bold">{{ estimatedDuration || 0 }} minutes</span>.
                      Take your time — there's no time limit per question.
                    </q-item-label>
                  </q-item-section>
                </q-item>

                <q-separator inset/>

                <q-item class="overview-item q-py-md">
                  <q-item-section avatar>
                    <q-avatar class="overview-icon" size="36px" color="green-1">
                      <q-icon name="quiz" color="green-7" size="18px"/>
                    </q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-body2 text-weight-medium">
                      Question Format
                    </q-item-label>
                    <q-item-label class="text-caption text-grey-7">
                      Multiple-choice questions — select the option that best represents your perspective.
                    </q-item-label>
                  </q-item-section>
                </q-item>

                <q-separator inset/>

                <q-item class="overview-item q-py-md">
                  <q-item-section avatar>
                    <q-avatar class="overview-icon" size="36px" color="orange-1">
                      <q-icon name="psychology" color="orange-7" size="18px"/>
                    </q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-body2 text-weight-medium">
                      Honest Responses
                    </q-item-label>
                    <q-item-label class="text-caption text-grey-7">
                      For accurate results, answer naturally. Don't overthink — there are no right or wrong answers.
                    </q-item-label>
                  </q-item-section>
                </q-item>

                <q-separator inset/>

                <q-item class="overview-item q-py-md">
                  <q-item-section avatar>
                    <q-avatar class="overview-icon" size="36px" color="purple-1">
                      <q-icon name="sync" color="purple-7" size="18px"/>
                    </q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-body2 text-weight-medium">
                      Auto-save & Progress
                    </q-item-label>
                    <q-item-label class="text-caption text-grey-7">
                      Your answers are saved automatically. You can pause and resume anytime.
                    </q-item-label>
                  </q-item-section>
                </q-item>

                <q-separator inset/>

                <q-item class="overview-item q-py-md">
                  <q-item-section avatar>
                    <q-avatar class="overview-icon" size="36px" color="red-1">
                      <q-icon name="lock_clock" color="red-7" size="18px"/>
                    </q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-body2 text-weight-medium">
                      Final Submission
                    </q-item-label>
                    <q-item-label class="text-caption text-grey-7">
                      Once submitted, answers cannot be changed. Review carefully before finishing.
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </div>

            <!-- Privacy Section -->
            <div class="q-mb-xl">
              <q-card flat bordered class="privacy-card">
                <q-card-section class="q-pa-md">
                  <div class="row items-center q-mb-sm">
                    <q-icon name="lock" color="primary" size="24px" class="q-mr-sm"/>
                    <div class="text-subtitle2 text-weight-medium text-primary">
                      Your Privacy is Protected
                    </div>
                  </div>
                  <div class="text-caption text-grey-7">
                    All responses are encrypted and stored securely. Your assessment results are
                    confidential and will only be used for evaluation purposes with your explicit consent.
                    No personal data is shared with third parties.
                  </div>
                </q-card-section>
              </q-card>
            </div>

            <!-- Action Buttons -->
            <div class="row items-center justify-between q-col-gutter-md">
              <div class="col-12 col-sm-6">
                <q-btn
                  :disable="loading"
                  color="grey-7"
                  flat
                  no-caps
                  class="full-width action-btn"
                  @click="goHome"
                >
                  <template v-slot:default>
                    <q-icon name="arrow_back" class="q-mr-sm"/>
                    Return to Home
                  </template>
                </q-btn>
              </div>

              <div class="col-12 col-sm-6">
                <q-btn
                  :disable="loading || !isValidAssessment"
                  :loading="loading"
                  color="primary"
                  unelevated
                  no-caps
                  class="full-width action-btn start-button"
                  @click="startAssessment"
                >
                  <template v-slot:default>
                    <span class="text-weight-medium">Start Assessment</span>
                    <q-icon name="play_arrow" class="q-ml-sm"/>
                  </template>
                  <template v-slot:loading>
                    <q-spinner size="20px" class="q-mr-sm"/>
                    Loading...
                  </template>
                </q-btn>
              </div>
            </div>

            <!-- Error Message -->
            <div v-if="!isValidAssessment" class="text-caption text-negative q-mt-md">
              <q-icon name="error" size="16px" class="q-mr-xs"/>
              Unable to load assessment details. Please return to home and try again.
            </div>

            <!-- Completion Estimate -->
            <div v-if="isValidAssessment" class="text-center q-mt-xl">
              <div class="text-caption text-grey-6">
                <q-icon name="timeline" size="14px" class="q-mr-xs"/>
                Complete this assessment in one sitting for best results
              </div>
            </div>
          </div>
        </transition>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { computed, inject, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { api } from 'boot/xhr.js'

// Props/Context
const totalQuestions = inject('totalQuestions', null)
const estimatedDuration = inject('estimatedDuration', null)

// State
const route = useRoute()
const router = useRouter()
const loading = ref(false)
const assessment = ref(null)

// Computed Properties
const uuid = computed(() => route.params?.uuid || route.params?.assessmentUuid || null)
const isValidAssessment = computed(() => uuid.value && assessment.value)

// Tips handling - assuming tips are stored in assessment.tips as array or string
const formattedTips = computed(() => {
  if (!assessment.value?.tips) return []

  if (Array.isArray(assessment.value.tips)) {
    return assessment.value.tips.filter(tip => tip && tip.trim().length > 0)
  }

  // If tips is a string, split by newlines or commas
  if (typeof assessment.value.tips === 'string') {
    return assessment.value.tips
      .split(/[\n,]/)
      .map(tip => tip.trim())
      .filter(tip => tip.length > 0)
  }

  return []
})

const hasTips = computed(() => formattedTips.value.length > 0)

// Methods
const startAssessment = () => {
  if (isValidAssessment.value) {
    router.push({
      name: 'AssessmentPages',
      params: { uuid: uuid.value },
      query: { started: new Date().getTime() } // Add timestamp for tracking
    })
  }
}

const goHome = () => router.replace({ name: 'Home' })

// Lifecycle
onMounted(() => {
  if (!uuid.value) return

  loading.value = true
  api()
    .get(`/assessments/${uuid.value}`)
    .then(response => {
      const data = response?.data ?? response
      assessment.value = {
        ...data,
        // Ensure tips are properly formatted
        tips: data.tips || [
          'This is Tip 1',
          'This is Tip 2',
        ]
      }
    })
    .catch(error => {
      console.error('Failed to load assessment:', error)
      assessment.value = null
    })
    .finally(() => {
      loading.value = false
    })
})
</script>

<style lang="scss" scoped>
.intro-container {
  padding: 16px;
}

.intro-header {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(37, 99, 235, 0.25);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.intro-avatar {
  background: linear-gradient(135deg, #ffffff 0%, #dbeafe 100%);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);

  .q-icon {
    color: #3b82f6 !important;
  }
}

.header-title {
  line-height: 1.3;
  margin-bottom: 4px;
}

.header-subtitle {
  opacity: 0.9;
  font-weight: 400;
}

.intro-content-card {
  border-radius: 20px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
  border: 1px solid #e5e7eb;
}

.assessment-stats-chip {
  border-radius: 12px;
  padding: 8px 12px;
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.1);

  .stat-item {
    min-width: 120px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: 500;
  }
}

.tips-card {
  background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
  border-color: #fbbf24;
  border-radius: 12px;

  .tip-item {
    border-bottom: 1px solid rgba(251, 191, 36, 0.2);

    &:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }
  }
}

.overview-list {
  background: white;
  border-radius: 12px;
  overflow: hidden;

  .q-separator {
    margin-left: 60px;
  }
}

.overview-item {
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #f9fafb;
  }
}

.overview-icon {
  transition: transform 0.2s ease;

  .overview-item:hover & {
    transform: scale(1.1);
  }
}

.privacy-card {
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  border-color: #3b82f6;
  border-radius: 12px;
}

.action-btn {
  height: 48px;
  border-radius: 12px;
  font-size: 15px;
  transition: all 0.2s ease;
}

.start-button {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(37, 99, 235, 0.4);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }
}

// Animation classes
.reveal-x-enter-active,
.reveal-x-leave-active {
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.reveal-x-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}

.reveal-x-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.scale-enter-active {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.scale-enter-from {
  opacity: 0;
  transform: scale(0.9);
}

// Responsive adjustments
@media (max-width: 600px) {
  .intro-container {
    padding: 8px;
  }

  .assessment-stats-chip {
    .stat-item {
      min-width: 100px;
      font-size: 13px;
    }
  }

  .intro-content-card {
    border-radius: 16px;
  }
}
</style>
