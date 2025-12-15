<template>
  <q-btn flat dense no-caps padding="0 24px" :href="landingUrl" class="text-grey">
    Powered by <strong class="q-px-xs text-grey-7">{{ appName }}</strong>
  </q-btn>
</template>

<script setup>
const landingUrl = import.meta.env?.['VITE_APP_LANDING_URL'] ?? import.meta.env?.['VITE_APP_BASE_URL'] ?? '#'
const appName = import.meta.env?.['VITE_APP_NAME'] ?? 'AIM'
</script>
