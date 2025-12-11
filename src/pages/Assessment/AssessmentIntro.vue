<template>
  <div class="q-pa-md">
    <div class="text-h6 q-mb-sm">
      Welcome to {{ assessment?.title }}
    </div>
    <div class="text-body2 text-grey-8 q-mb-md">
      {{ assessment?.description || 'Please answer all questions carefully. You can review everything at the end before submitting.' }}
    </div>

    <q-btn
      color="primary"
      label="Start"
      @click="goNext"
    />
  </div>
</template>

<script setup lang="ts">

</script>

<style scoped lang="scss">

</style>
