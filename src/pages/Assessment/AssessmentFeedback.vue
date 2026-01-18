<template>
  <div class="column q-mx-auto" style="max-width:650px">
    <div class="col-auto header-card q-py-xs-sm q-py-md-md q-pr-md">
      <q-item v-if="!checkSubmissionLoading">
        <q-item-section avatar>
          <q-avatar class="success-badge" size="48px">
            <q-icon color="white" name="verified" size="36px"/>
          </q-avatar>
        </q-item-section>
        <q-item-section class="text-white">
          <transition appear mode="out-in" name="reveal-x">
            <q-item-label :key="submitted ? 'submitted-title' : 'initial-title'" class="text-h5 text-bold header-line header-title">
              {{ submitted ? 'Thank you for your feedback!' : 'Thank you for completing the assessment!' }}
            </q-item-label>
          </transition>
          <transition appear mode="out-in" name="reveal-x">
            <q-item-label :key="submitted ? 'submitted-sub' : 'initial-sub'" class="text-subtitle2 header-line header-sub-delayed">
              {{ submitted ? 'We truly appreciate you taking the time to share your thoughts' : 'Your feedback helps us improve' }}
            </q-item-label>
          </transition>
        </q-item-section>
      </q-item>

      <q-item v-else dense>
        <q-item-section avatar>
          <q-skeleton type="QAvatar" size="48px" animation="pulse" />
        </q-item-section>
        <q-item-section>
          <q-skeleton type="text" square width="80%" height="36px" animation="fade" />
          <q-skeleton type="text" square width="40%" height="26px" animation="fade" />
        </q-item-section>
      </q-item>
    </div>

    <q-card v-if="!checkSubmissionLoading" bordered class="col overflow-auto">
      <q-card-section class="q-pa-xs-lg q-pa-md-xl">
        <transition appear mode="out-in" name="collapse-down">
          <div v-if="!submitted" key="form">
            <div class="text-center">
              <div class="text-body1 text-grey-8 q-mb-sm">
                If you have a moment, we'd love to hear about your experience.
              </div>
              <div class="text-caption text-grey-6">
                Takes less than 1 minute
              </div>
            </div>

            <!-- Satisfaction Rating -->
            <div class="q-mt-xl">
              <q-item dense>
                <q-item-section thumbnail top>
                  <q-icon color="grey-7" name="star"/>
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-subtitle1 text-bold">Overall satisfaction</q-item-label>
                  <q-item-label class="text-caption text-grey-7">How satisfied were you with this assessment?
                  </q-item-label>
                </q-item-section>
              </q-item>

              <div class="rating-container q-my-md q-py-lg q-px-xs-sm q-px-md-xl">
                <q-rating
                  v-model="rating"
                  :color-selected="selectedRating.color"
                  :icon="ratingIcons"
                  :icon-selected="ratingIcons[rating - 1]"
                  class="rating-stars"
                  color="grey-4"
                  max="5"
                  name="satisfaction"
                  size="3.5em"
                />
                <transition name="fade">
                  <div
                    v-if="rating"
                    :class="`text-${selectedRating.color}`"
                    class="text-subtitle2 text-center text-bold q-mt-sm"
                  >
                    {{ selectedRating.label }}
                  </div>
                </transition>
              </div>
            </div>

            <!-- Quick Reasons -->
            <div class="q-mt-xl">
              <q-item dense>
                <q-item-section thumbnail top>
                  <q-icon color="grey-7" name="check_circle"/>
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-subtitle1 text-bold">What describes your experience?</q-item-label>
                  <q-item-label class="text-caption text-grey-7">Select all that apply (optional).</q-item-label>
                </q-item-section>
              </q-item>

              <div class="q-px-lg q-my-md">
                <!-- Question Clarity Group -->
                <div class="q-px-lg q-my-md">
                  <div class="text-caption text-grey-7 q-mb-sm">Question clarity</div>
                  <q-option-group
                    v-model="clarity"
                    :options="clarityOptions"
                    color="primary"
                    dense
                    size="md"
                    type="radio"
                  />
                </div>

                <!-- Assessment Length Group -->
                <div class="q-px-lg q-my-md">
                  <div class="text-caption text-grey-7 q-mb-sm">Assessment length</div>
                  <q-option-group
                    v-model="length"
                    :options="lengthOptions"
                    color="primary"
                    dense
                    size="md"
                    type="radio"
                  />
                </div>

                <!-- Other Options (checkbox) -->
                <div class="q-px-lg q-my-md">
                  <div class="text-caption text-grey-7 q-mb-sm">Other aspects</div>
                  <q-option-group
                    v-model="otherReasons"
                    :options="otherOptions"
                    color="primary"
                    dense
                    size="md"
                    type="checkbox"
                  />
                </div>
              </div>
            </div>

            <!-- Comment Box -->
            <div class="q-mt-xl">
              <q-item dense>
                <q-item-section thumbnail top>
                  <q-icon color="grey-7" name="chat"/>
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-subtitle1 text-bold">Additional comments</q-item-label>
                  <q-item-label class="text-caption text-grey-7">Optional, but your insights help us improve.
                  </q-item-label>
                </q-item-section>
              </q-item>

              <div class="q-my-lg">
                <q-input
                  v-model="comment"
                  :maxlength="500"
                  autogrow
                  bg-color="grey-1"
                  class="comment-input"
                  counter
                  name="feedback"
                  outlined
                  placeholder="What worked well? What could be improved?"
                  rows="3"
                  type="textarea"
                />
              </div>
            </div>

            <!-- Actions -->
            <q-separator class="q-my-md"/>
            <div class="row justify-between items-center">
              <q-btn :disable="loading" color="grey-7" flat no-caps @click="goHome">
                <q-icon name="chevron_left" /> Back To Home
              </q-btn>

              <q-btn
                :disable="!rating || loading"
                :loading="loading"
                color="primary"
                icon-right="send"
                label="Send feedback"
                no-caps
                unelevated
                @click="sendFeedback"
              />
            </div>

            <div class="text-center q-mt-md">
              <div class="text-caption text-grey-6">
                <q-icon class="q-mr-xs" name="lock" size="14px"/>
                Your feedback is anonymous and confidential
              </div>
            </div>
          </div>

          <div v-else key="confirmation">
            <transition appear name="fade-up">
              <AssessmentConfirmation @home="goHome"/>
            </transition>
          </div>
        </transition>
      </q-card-section>
    </q-card>

    <q-card v-else style="min-height:50vh;max-height:calc(100vh - 242px)">
      <q-card-actions align="center">
        <q-inner-loading class="transparent" showing transition-duration="500" style="max-height:80vh">
          <template v-slot:default>
            <div class="text-center">
              <q-spinner-hourglass color="grey-7" size="1.5em"/>
              <div class="text-grey-7">Loading, Please wait...</div>
            </div>
          </template>
        </q-inner-loading>
      </q-card-actions>
    </q-card>
  </div>
</template>

<script setup>
import {computed, onMounted, ref} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {api} from 'boot/xhr.js'
import AssessmentConfirmation from "pages/Assessment/AssessmentConfirmation.vue"

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const checkSubmissionLoading = ref(false)
const submitted = ref(false)

const rating = ref(0)
const clarity = ref(null)
const length = ref(null)
const otherReasons = ref([])
const comment = ref('')

const clarityOptions = [
  {label: 'Questions were clear', value: 'clarity_good'},
  {label: 'Questions were confusing', value: 'clarity_bad'},
  {label: 'Neither / No opinion', value: 'clarity_neutral'}
]

const lengthOptions = [
  {label: 'Good length', value: 'good_length'},
  {label: 'Too long', value: 'too_long'},
  {label: 'Too short', value: 'too_short'}
]

const otherOptions = [
  {label: 'Technical issues', value: 'technical_issues'},
  {label: 'Helpful for learning', value: 'helpful_learning'},
  {label: 'Would recommend to others', value: 'would_recommend'}
]

const ratingIcons = [
  'sentiment_very_dissatisfied',
  'sentiment_dissatisfied',
  'sentiment_neutral',
  'sentiment_satisfied_alt',
  'sentiment_very_satisfied'
]

const selectedRating = computed(() => {
  switch (rating.value) {
    case 1:
      return {label: 'Very dissatisfied', color: 'red-8'}
    case 2:
      return {label: 'Dissatisfied', color: 'deep-orange-6'}
    case 3:
      return {label: 'Neutral', color: 'amber-6'}
    case 4:
      return {label: 'Satisfied', color: 'light-green-6'}
    case 5:
      return {label: 'Very satisfied', color: 'green-7'}
    default:
      return {label: '', color: 'grey'}
  }
})

const goHome = () => router.replace({name: 'Home'})

const sendFeedback = () => {
  loading.value = true
  api()
    .put(`/assessments/${route.params['uuid']}/submissions/${route.params['submissionUuid']}`, {
      satisfaction: rating.value,
      feedback: (comment.value ?? '').trim() || null,
      experience: {
        clarity: clarity.value,
        length: length.value,
        otherReasons: [...otherReasons.value].filter(Boolean)
      }
    })
    .then(() => submitted.value = true)
    .catch(err => {
      if (err.status === 409) router.replace({name: 'Home'})
    })
    .finally(() => loading.value = false)
}

onMounted(() => {
  checkSubmissionLoading.value = true
  api()
    .get(`/assessments/${route.params['uuid']}/submissions/${route.params['submissionUuid']}`)
    .then(r => {
      if (r?.data?.satisfaction) {
        submitted.value = true
      }
    })
    .catch(() => router.replace({name: 'Home'}))
    .finally(() => checkSubmissionLoading.value = false)
})
</script>

<style lang="scss" scoped>
.header-card {
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  margin: 8px 0 16px;
}

.success-badge {
  background: linear-gradient(135deg, #22c55e, #16a34a);
}

.rating-container {
  text-align: center !important;
  background: $grey-1;
  border-radius: 12px;
  border: 1px solid #e9ecef;
}

.comment-input :deep(.q-field__control) {
  min-height: 120px;
  border-radius: 8px;
}

.comment-input :deep(textarea) {
  line-height: 1.5;
}

/* ===== Animations ===== */

/* Header Title */
.header-line {
  display: inline-block;
  overflow: hidden;
  max-width: 100%;
}

/* Base reveal animation */

</style>
