<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container class="page-container-bg">
      <router-view v-slot="{ Component }">
        <component :is="Component"/>
      </router-view>
    </q-page-container>
  </q-layout>
</template>

<style lang="scss" scoped>
.page-container-bg {
  position: relative;
}

.page-container-bg::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 350px;
  background-image: url("/images/header-bg.jpg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  z-index: -1;
}
</style>
<script lang="ts" setup>
</script>
