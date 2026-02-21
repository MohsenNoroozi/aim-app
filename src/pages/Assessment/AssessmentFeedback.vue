<template>
  <div class="column q-mx-auto" style="max-width:650px">
    <div class="col-auto header-card q-py-xs-sm q-py-md-md q-pr-md">
      <q-item>
        <q-item-section avatar>
          <q-avatar class="success-badge" size="48px">
            <q-icon color="white" name="verified" size="36px"/>
          </q-avatar>
        </q-item-section>
        <q-item-section class="text-white">
          <transition appear mode="out-in" name="reveal-x">
            <q-item-label key="submitted-title" class="text-h5 text-bold header-line header-title">
              Thank you for completing the assessment!
            </q-item-label>
          </transition>
        </q-item-section>
      </q-item>
    </div>

    <q-card bordered class="col overflow-auto">
      <q-card-section class="q-pa-xs-lg q-pa-md-xl">
        <transition appear mode="out-in" name="collapse-down">
          <q-card bordered class="confirmation-card">
            <q-card-section class="q-pa-xs-sm q-pa-sm-md q-pa-md-xl">
              <p v-html="assessment?.['outro'] ?? '--'"></p>
              <div class="row justify-center q-mt-xl">
                <q-btn
                    unelevated
                    color="primary"
                    icon="task_alt"
                    label="Finish"
                    no-caps
                    size="md"
                    class="q-px-xl"
                    @click="finish"
                />
              </div>
            </q-card-section>
          </q-card>
        </transition>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import {useRouter} from "vue-router";

const props = defineProps({
  assessment: {
    type: Object,
    required: true,
  }
})

const router = useRouter(false)

const finish = () => {
  if (props.assessment?.['redirectUrl']) {
    window.location.href = props.assessment?.['redirectUrl']
  } else {
    router.replace({name: 'Home'})
  }
}
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
