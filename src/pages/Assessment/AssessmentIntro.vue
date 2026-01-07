<template>
  <div class="q-mx-auto" style="max-width:650px">
    <div class="header-card q-py-xs-sm q-py-md-md q-pr-md">
      <q-item dense class="items-center">
        <q-item-section avatar>
          <q-avatar class="intro-badge" size="52px">
            <q-icon color="white" name="rocket_launch" size="34px"/>
          </q-avatar>
        </q-item-section>

        <q-item-section class="text-white">
          <transition appear mode="out-in" name="reveal-x">
            <q-item-label key="intro-title" class="text-h5 text-bold header-line header-title">
              Before you start
            </q-item-label>
          </transition>
          <transition appear mode="out-in" name="reveal-x">
            <q-item-label key="intro-sub" class="text-subtitle2 header-line header-sub-delayed">
              A quick preview of the journey ahead
            </q-item-label>
          </transition>
        </q-item-section>
      </q-item>
    </div>

    <q-card v-if="!assessmentLoading" bordered>
      <q-card-section class="q-pa-lg q-pa-md-xl">
        <transition appear mode="out-in" name="collapse-down">
          <div key="intro-main">
            <div class="text-center q-mb-xl">
              <div class="text-subtitle1 text-grey-6 q-mb-xs">Welcome to</div>
              <div class="text-h5 text-grey-9 text-bold q-mb-xs">{{ assessment?.['title'] ?? '' }}</div>
              <q-chip class="assessment-meta-chip" color="blue-1" text-color="blue-9" size="md">
                <div class="subtitle-chips"><q-icon name="quiz" size="16px" class="q-mr-sm"/>{{ totalQuestions }} questions</div>
                <q-separator vertical spaced color="white" />
                <div class="subtitle-chips"><q-icon name="schedule" size="16px" class="q-mr-sm"/>{{ estimatedDuration }} minutes</div>
              </q-chip>
            </div>

            <div v-if="assessment?.['tips']?.length" class="q-mb-xl">
              <q-item dense class="q-mb-md">
                <q-item-section thumbnail top>
                  <q-icon color="amber" name="tips_and_updates" size="28px"/>
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-subtitle1 text-bold">Helpful context</q-item-label>
                  <q-item-label class="text-caption text-grey-7">Important insights to maximize your results</q-item-label>
                </q-item-section>
              </q-item>
              <q-list bordered class="rounded-borders tips-card q-mb-md">
                <q-item v-for="(tip, index) in assessment.tips" :key="index" class="q-py-md">
                  <q-item-section avatar top>
                    <q-avatar class="mini-avatar" size="36px">
                      <q-icon name="task_alt" size="24px"/>
                    </q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-body2">{{ tip.title }}</q-item-label>
                    <q-item-label v-if="tip?.body" class="text-caption text-grey-7"><div v-html="tip.body"></div></q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </div>

            <!-- Overview block -->
            <div class="q-mb-xl">
              <q-item dense class="q-mb-md">
                <q-item-section thumbnail top>
                  <q-icon name="info"/>
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-subtitle1 text-bold">What to expect</q-item-label>
                  <q-item-label class="text-caption text-grey-7">A few helpful notes to keep things smooth.</q-item-label>
                </q-item-section>
              </q-item>

              <q-list bordered class="rounded-borders bg-grey-1 q-mb-md">
                <q-item class="q-py-md">
                  <q-item-section avatar>
                    <q-avatar class="mini-avatar" size="36px">
                      <q-icon name="access_time_filled" size="24px"/>
                    </q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-body2">Estimated time</q-item-label>
                    <q-item-label class="text-caption text-grey-7">
                      Estimated <b>{{ estimatedDuration ?? 5 }}</b> minutes. There is no time limit.
                    </q-item-label>
                  </q-item-section>
                </q-item>

                <q-separator inset/>

                <q-item class="q-py-md">
                  <q-item-section avatar>
                    <q-avatar class="mini-avatar" size="36px">
                      <q-icon name="check_box" size="24px"/>
                    </q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-body2">Question format</q-item-label>
                    <q-item-label class="text-caption text-grey-7">
                      Multiple-choice — choose the option that fits best.
                    </q-item-label>
                  </q-item-section>
                </q-item>

                <q-separator inset/>

                <q-item class="q-py-md">
                  <q-item-section avatar>
                    <q-avatar class="mini-avatar" size="36px">
                      <q-icon name="psychology" size="30px"/>
                    </q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-body2">Answer honestly</q-item-label>
                    <q-item-label class="text-caption text-grey-7">
                      Your best results come from your real answers, not the “perfect” ones.
                    </q-item-label>
                  </q-item-section>
                </q-item>

                <q-separator inset/>

                <q-item class="q-py-md">
                  <q-item-section avatar>
                    <q-avatar class="mini-avatar" size="36px">
                      <q-icon name="bookmark_added" size="24px"/>
                    </q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-body2">Auto-save</q-item-label>
                    <q-item-label class="text-caption text-grey-7">
                      Your progress saves as you go. You can safely refresh or come back.
                    </q-item-label>
                  </q-item-section>
                </q-item>

                <q-separator inset/>

                <q-item class="q-py-md">
                  <q-item-section avatar>
                    <q-avatar class="mini-avatar" size="36px">
                      <q-icon name="mail_lock" size="24px"/>
                    </q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-body2">One-time submission</q-item-label>
                    <q-item-label class="text-caption text-grey-7">
                      Once submitted, answers can’t be edited — review before you finish.
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>

              <!-- Privacy -->
              <q-list class="privacy-banner rounded-borders">
                <q-item class="q-py-md">
                  <q-item-section avatar top>
                    <q-avatar class="mini-avatar" size="36px" color="blue-1">
                      <q-icon name="lock_person" size="24px" color="primary"/>
                    </q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-body2 text-primary">Your privacy is protected</q-item-label>
                    <q-item-label class="text-caption text-grey-10">
                      All responses are encrypted and stored securely. Your results are used
                      solely for evaluation purposes and won't be shared without your consent.
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </div>

            <q-separator class="q-my-lg"/>

            <!-- Actions -->
            <div class="row items-center justify-between q-col-gutter-sm">
              <div class="col-12 col-sm-auto">
                <q-btn
                  color="grey-7"
                  flat
                  no-caps
                  @click="goHome"
                >
                  <q-icon name="chevron_left" class="q-mr-xs"/>
                  Back to home
                </q-btn>
              </div>

              <div class="col-12 col-sm-auto">
                <q-btn
                  color="primary"
                  icon-right="play_arrow"
                  label="Start assessment"
                  unelevated
                  push
                  glossy
                  rounded
                  size="16px"
                  @click="startAssessment"
                />
              </div>
            </div>

            <div v-if="!uuid" class="text-caption text-negative q-mt-sm">
              Missing assessment ID — please return to home and open the assessment again.
            </div>
          </div>
        </transition>
      </q-card-section>
    </q-card>

    <q-card v-else style="height:calc(100vh - 236px)">
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
import { computed, inject } from 'vue'
import { useRoute, useRouter } from 'vue-router'

defineProps({
  assessment: {
    type: Object,
    required: true,
  },
  assessmentLoading: {
    type: Boolean,
    default: false,
  }
})

const totalQuestions = inject('totalQuestions', null)
const estimatedDuration = inject('estimatedDuration', null)

const route = useRoute()
const router = useRouter()

const uuid = computed(() => route.params?.uuid || route.params?.assessmentUuid || null)

const startAssessment = () => router.push({ name: 'Assessment Pages', params: { uuid: uuid.value } })

const goHome = () => router.replace({ name: 'Home' })
</script>

<style lang="scss" scoped>
.subtitle-chips {
  width: 112px;
  text-align: center;
}

.header-card {
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  margin: 8px 0 16px;
}

.intro-badge {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  box-shadow: 0 10px 25px rgba(37, 99, 235, 0.25);
}

.tips-card {
  background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
  border-color: #fbbf24;
}

.meta-chip {
  display: flex;
  align-items: center;
  border-radius: 12px;
  padding: 8px 10px;
  color: rgba(255, 255, 255, 0.92);
  background: rgba(255, 255, 255, 0.10);
  border: 1px solid rgba(255, 255, 255, 0.14);
  gap: 6px;
}

.soft-chip {
  border-radius: 999px;
}

.mini-avatar {
  background: rgba(0, 0, 0, 0.04);
  color: rgba(0, 0, 0, 0.65);
}

.privacy-banner {
  background: rgba(59, 130, 246, 0.05);
  border: 1px solid rgba(59, 130, 246, 0.1);
}

.privacy-avatar {
  background: rgba(59, 130, 246, 0.12);
  color: rgba(37, 99, 235, 1);
}
</style>
