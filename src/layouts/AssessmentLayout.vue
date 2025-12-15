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
  background-color: #f8fafc;
  background-image:
    linear-gradient(to bottom, rgba(0, 0, 0, 0.015), rgba(0, 0, 0, 0.03)),
    radial-gradient(rgba(30, 136, 229, 0.15) 1px, transparent 1px
    );
  background-size: 100% 100%, 24px 24px;
}

.page-container-bg::before {
  content: "";
  position: absolute;
  inset: 0 0 auto 0;
  height: 350px;
  z-index: 0;

  background-image: url("/images/header-bg.jpg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.page-container-bg > * {
  position: relative;
  z-index: 1;
}
</style>
