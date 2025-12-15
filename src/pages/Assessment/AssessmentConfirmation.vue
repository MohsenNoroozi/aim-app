<template>
  <q-card bordered class="confirmation-card">
    <q-card-section class="q-pa-xs-sm q-pa-sm-md q-pa-md-xl">
      <div class="text-center q-mb-lg">
        <q-avatar size="86px" class="hero-avatar">
          <q-icon name="feedback" size="46px" color="positive"/>
        </q-avatar>
        <div class="text-h6 text-bold q-my-lg">Feedback Submitted Successfully</div>
      </div>

      <q-separator class="q-my-lg"/>

      <q-list bordered class="rounded-borders bg-grey-1">
        <q-item>
          <q-item-section avatar>
            <q-icon name="task_alt" color="positive"/>
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-body2">Saved successfully</q-item-label>
            <q-item-label class="text-caption text-grey-7">No further action is needed.</q-item-label>
          </q-item-section>
        </q-item>

        <q-separator inset/>

        <q-item>
          <q-item-section avatar>
            <q-icon name="lock" color="grey-8"/>
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-body2">Anonymous and confidential</q-item-label>
            <q-item-label class="text-caption text-grey-7">
              Your responses are never linked to your identity.
            </q-item-label>
          </q-item-section>
        </q-item>

        <q-separator inset/>

        <q-item>
          <q-item-section avatar>
            <q-icon name="schedule" color="grey-7"/>
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-body2">Reviewed regularly</q-item-label>
            <q-item-label class="text-caption text-grey-7">
              Feedback is reviewed continuously to improve quality.
            </q-item-label>
          </q-item-section>
        </q-item>

        <q-separator inset/>

        <q-item>
          <q-item-section avatar>
            <q-icon name="insights" color="primary"/>
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-body2">Helps us improve</q-item-label>
            <q-item-label class="text-caption text-grey-7">
              Your input directly shapes future assessments.
            </q-item-label>
          </q-item-section>
        </q-item>

        <q-separator inset/>

        <q-item>
          <q-item-section avatar>
            <q-icon name="favorite" color="pink-5"/>
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-body2">We appreciate your time</q-item-label>
            <q-item-label class="text-caption text-grey-7">
              Thanks for helping us make things better.
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>

      <q-separator class="q-my-lg"/>

      <div class="row justify-center">
        <q-btn
          unelevated
          color="primary"
          icon="home"
          label="Back to Home"
          no-caps
          size="md"
          class="q-px-xl"
          @click="$emit('home')"
        />
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
defineEmits(['home'])
</script>

<style scoped lang="scss">
.hero-avatar {
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid #e9ecef;
  border-radius: 999px;
}

.confirmation-card {
  border-radius: 12px;
}

@media (max-width: 1024px) {
  .confirmation-card {
    border: none !important;
  }
}
</style>
