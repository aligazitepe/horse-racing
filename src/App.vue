<script setup lang="ts">
import { ref, toRaw } from 'vue';
import Phaser from 'phaser';
import Horses from './components/Horses.vue';
import RaceScheduler from './components/RaceScheduler.vue';
import RaceResults from './components/RaceResults.vue';
import PhaserGame from './components/game/PhaserGame.vue';
import Tabs from './components/MainTabs.vue';

const tabs = ref(['RaceScheduler', 'RaceResults']);

const changeScene = () => {

  const scene = toRaw(phaserRef.value.scene);

  if (scene) {
    //  Call the changeScene method defined in the `MainMenu`, `Game` and `GameOver` Scenes
    scene.changeScene();
  }

}
</script>

<template>
  <div class="w-screen overflow-hidden flex flex-row  ">
    <Horses />
    <div class="space-y-4">
      <!-- <PhaserGame ref="phaserRef" @current-active-scene="currentScene" /> -->
      <PhaserGame ref="phaserRef" />
    </div>
    <Tabs :tabs="tabs" class="max-h-screen overflow-y-scroll">
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
