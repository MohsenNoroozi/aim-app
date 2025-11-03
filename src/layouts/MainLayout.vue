<template>
  <q-layout view='lHh Lpr lFf'>
    <q-page-container>
      <div class="column fullscreen bg-gradient">
        <div class="col">
          <router-view/>
        </div>
        <div class="col-auto">
          <svg class="waves" xmlns="http://www.w3.org/2000/svg" viewBox="0 24 150 28" preserveAspectRatio="none" shape-rendering="auto">
            <defs>
              <path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s58 18 88 18 58-18 88-18 58 18 88 18v44h-352z" />
            </defs>
            <g class="parallax">
              <use xlink:href="#gentle-wave" x="48" y="0" class="wave wave1" />
              <use xlink:href="#gentle-wave" x="48" y="3" class="wave wave2" />
              <use xlink:href="#gentle-wave" x="48" y="5" class="wave wave3" />
              <use xlink:href="#gentle-wave" x="48" y="7" class="wave wave4" />
            </g>
          </svg>
          <div class="bg-white text-caption text-center q-pa-md">
            <span class="text-grey">Powered by</span> AIM
          </div>
        </div>
      </div>
    </q-page-container>
  </q-layout>
</template>

<script setup>

</script>

<style lang="scss" scoped>
.bg-gradient {
  background: linear-gradient(60deg, rgba(84,58,183,1) 0%, rgba(0,172,193,1) 100%);
  //background: linear-gradient(-45deg, #371561, #13024F);
  //background-size: 400% 400%;
}

.waves {
  position:relative;
  width: 100%;
  height:15vh;
  margin-bottom:-10px; /*Fix for safari gap*/
  min-height:100px;
  max-height:150px;
}

.wave1 { fill: rgba(255, 255, 255, 0.7); }
.wave2 { fill: rgba(255, 255, 255, 0.5); }
.wave3 { fill: rgba(255, 255, 255, 0.3); }
.wave4 { fill: rgba(255, 255, 255, 1); }

.parallax > use {
  animation: move-forever 25s cubic-bezier(.55,.5,.45,.5)     infinite;
}
.parallax > use:nth-child(1) {
  animation-delay: -2s;
  animation-duration: 7s;
}
.parallax > use:nth-child(2) {
  animation-delay: -3s;
  animation-duration: 10s;
}
.parallax > use:nth-child(3) {
  animation-delay: -4s;
  animation-duration: 13s;
}
.parallax > use:nth-child(4) {
  animation-delay: -5s;
  animation-duration: 20s;
}
@keyframes move-forever {
  0% {
    transform: translate3d(-90px,0,0);
  }
  100% {
    transform: translate3d(85px,0,0);
  }
}
@media (max-width: 768px) {
  .waves {
    height:64px;
    min-height:64px;
  }
}
</style>
