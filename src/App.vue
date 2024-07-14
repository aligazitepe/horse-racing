<script setup lang="ts">
import { ref, toRaw } from 'vue';
import Phaser from 'phaser';
import Horses from './components/Horses.vue';
import RaceScheduler from './components/RaceScheduler.vue';
import RaceResults from './components/RaceResults.vue';
import PhaserGame from './components/game/PhaserGame.vue';
import Tabs from './components/MainTabs.vue';

const tabs = ref(['RaceScheduler', 'RaceResults']);
</script>
<template>
  <div class="w-screen h-screen flex flex-row justify-around mt-5 ">
    <Horses />
    <div class=" flex items-center p-5 rounded-lg relative">
      <!-- <PhaserGame ref="phaserRef" @current-active-scene="currentScene" /> -->
      <div class="w-[808px] h-[608px] absolute border-8 border-black rounded-lg translate-x-[-2px] pointer-events-none">
      </div>
      <PhaserGame ref="phaserRef" class="" />
    </div>
    <Tabs :tabs="tabs" class="h-screen overflow-y-scroll">
      <template #RaceScheduler>
        <RaceScheduler />
      </template>
      <template #RaceResults>
        <RaceResults />
      </template>
    </Tabs>
  </div>
</template>

<style scoped>
.btn {
  @apply bg-green-500 text-white py-2 px-4 rounded hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed;
}
</style>
