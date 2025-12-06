<template>
  <q-item class="q-pa-none q-mb-md">
    <q-card class="question-card">
      <q-card-section class="bg-grey-2">
        <q-item>
          <q-item-section thumbnail>
            <q-avatar color="grey-4" text-color="grey">
              <div class="text-h5 text-bold">{{ index }}</div>
            </q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-subtitle1">
              {{ question?.['text'] ?? '' }}
              <q-btn v-if="question?.['helpText']" color="grey-5" flat icon="help_outline" round size="xs">
                <q-tooltip max-width="250px" anchor="bottom right" self="top right" :offset="[64,6]">{{ question['helpText'] }}</q-tooltip>
              </q-btn>
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <div v-if="!question.responseOptions?.length" class="text-grey-6 text-caption">
          No response options defined.
        </div>

        <template v-else>
          <div class="row q-col-gutter-sm">
            <div
              v-for="opt in question.responseOptions"
              :key="opt.id"
              :class="optionColClass"
            >
              <q-item
                clickable
                v-ripple
                class="option-pill q-pa-sm"
                :class="{ 'option-pill--selected': localValue === opt.id }"
                @click="localValue = opt.id"
              >
                <q-item-section avatar>
                  <q-radio
                    v-model="localValue"
                    :val="opt.id"
                    :name="opt.id + '_' + opt.label"
                    size="sm"
                  />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ opt.label }}</q-item-label>
                </q-item-section>
              </q-item>
            </div>
          </div>
        </template>
      </q-card-section>
    </q-card>
  </q-item>
</template>

<script setup>
import { computed } from 'vue'

const LONG_LABEL_THRESHOLD = 40

const props = defineProps({
  question: {
    type: Object,
    required: true
  },
  /** selected responseOption id for this question */
  modelValue: {
    type: [Number, String, null],
    default: null
  },
  index: {type: Number, required: true},
})

const emit = defineEmits(['update:modelValue'])

const localValue = computed({
  get: () => props.modelValue,
  set: val => emit('update:modelValue', val)
})

const optionColClass = computed(() => {
  if ((props.question?.responseOptions ?? []).some(o => (o.label ?? '').length > LONG_LABEL_THRESHOLD)) return 'col-12'
  const count = props.question?.responseOptions?.length || 0
  if (count <= 2) return 'col-12 col-sm-6'
  if (count === 3) return 'col-12 col-sm-4'
  if (count === 4) return 'col-12 col-sm-6 col-md-3'
  if (count >= 5) return 'col-12 col-sm-6 col-md-4'
  return 'col-12'
})
</script>

<style lang="scss" scoped>
.question-card {
  width: 100% !important;
  border-radius: 12px;
}
.option-pill {
  border-radius: 999px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  transition: background-color 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease;
}

.option-pill:hover {
  border-color: rgba(0, 0, 0, 0.12);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.option-pill--selected {
  background: rgba(33, 150, 243, 0.06); // primary tint
  border-color: #2196f3;
}
</style>
