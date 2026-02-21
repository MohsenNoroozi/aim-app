<template>
  <q-card bordered class="confirmation-card">
    <q-card-section class="q-pa-xs-sm q-pa-sm-md q-pa-md-xl">
      <div class="text-center q-mb-lg">
        <q-avatar size="86px" class="hero-avatar">
          <q-icon name="task_alt" size="46px" color="positive"/>
        </q-avatar>
      </div>

      <q-separator class="q-my-lg"/>

      <p v-html="assessment?.outro ?? '--'"></p>

      <q-separator class="q-my-lg"/>

      <div class="row justify-center">
        <q-btn
          unelevated
          color="primary"
          icon="home"
          label="Finish"
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
