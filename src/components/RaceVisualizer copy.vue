<script lang="ts">
import { defineComponent, watch, ref, nextTick } from 'vue';
import { useMainStore } from '@/store';
import { storeToRefs } from 'pinia';
import PhaserGame from "./game/PhaserGame.vue;"
import * as PIXI from 'pixi.js';

export default defineComponent({
  name: 'RaceVisualizer',
  setup() {
    const store = useMainStore();
    const { getCurrentRace, currentRaceIndex, races } = storeToRefs(store);

    const animateRace = () => {
      if (!getCurrentRace.value || !app) return;

      app.stage.removeChildren();

      const trackHeight = 50;
      const padding = 10;
      const totalHeight = (trackHeight + padding) * getCurrentRace.value.horses.length;
      app.renderer.resize(raceContainer.value?.clientWidth || 800, totalHeight);

      getCurrentRace.value.horses.forEach((horse, index) => {
        const horseSprite = new PIXI.Graphics();
        horseSprite.beginFill(PIXI.utils.string2hex(horse.color));
        horseSprite.drawRect(0, 0, 50, trackHeight);
        horseSprite.endFill();
        horseSprite.y = index * (trackHeight + padding);
        app.stage.addChild(horseSprite);

        const speed = horse.condition / 50;
        app.ticker.add(() => {
          horseSprite.x += speed;
          if (horseSprite.x >= app.renderer.width) {
            horseSprite.x = 0;
          }
        });
      });
    };

    const startNextRace = () => {
      store.startNextRace();
    };

    return {
      currentRace: getCurrentRace,
      currentRaceIndex,
      races,
      startNextRace,
      raceContainer,
    };
  },
});
</script>

<template>
  <div class="p-4">
    <h2 class="text-2xl font-bold mb-4">Race Visualizer</h2>
    <div v-if="currentRace" class="p-4">
      <h3 class="text-xl font-bold mb-4">Race {{ currentRace.id }}</h3>
      <PhaserGame />
      <div class="race-container" ref="raceContainer"></div>
      <button @click="startNextRace" class="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700">
        {{ currentRaceIndex === 0 ? 'Start First Race' : 'Start Next Race' }}
      </button>
    </div>
    <div v-else class="p-4">
      <p v-if="races.length === 0">No races available. Generate a race schedule to start.</p>
      <p v-else>No more races to run.</p>
    </div>
  </div>
</template>



<style scoped>
.race-container {
  width: 100%;
  height: 400px;
  border: 1px solid #ccc;
  margin-bottom: 20px;
}
</style>
