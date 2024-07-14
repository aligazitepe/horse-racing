<script setup lang="ts">
import { ref, toRaw } from 'vue';
import Phaser from 'phaser';
import Horses from './components/Horses.vue';
import RaceScheduler from './components/RaceScheduler.vue';
import RaceVisualizer from './components/RaceVisualizer.vue';
import RaceResults from './components/RaceResults.vue';
import PhaserGame from './components/game/PhaserGame.vue';

// The sprite can only be moved in the MainMenu Scene
const canMoveSprite = ref(false);

// References to the PhaserGame component (game and scene are exposed)
const phaserRef = ref();
const spritePosition = ref({ x: 0, y: 0 });

const changeScene = () => {
  const scene = toRaw(phaserRef.value.scene);
  if (scene) {
    scene.changeScene();
  }
};

const moveSprite = () => {
  const scene = toRaw(phaserRef.value.scene);
  if (scene) {
    scene.moveLogo(({ x, y }) => {
      spritePosition.value = { x, y };
    });
  }
};

const addSprite = () => {
  const scene = toRaw(phaserRef.value.scene);
  if (scene) {
    const x = Phaser.Math.Between(64, scene.scale.width - 64);
    const y = Phaser.Math.Between(64, scene.scale.height - 64);
    const star = scene.add.sprite(x, y, 'star');
    scene.add.tween({
      targets: star,
      duration: 500 + Math.random() * 1000,
      alpha: 0,
      yoyo: true,
      repeat: -1,
    });
  }
};

// This event is emitted from the PhaserGame component:
const currentScene = (scene) => {
  canMoveSprite.value = (scene.scene.key !== 'MainMenu');
};
</script>

<template>
  <div class="container mx-auto p-4 space-y-4">
    <div class="">
      <div class="space-y-4">
        <Horses />
        <RaceScheduler />
        <RaceResults />
      </div>

      <div class="space-y-4">
        <PhaserGame ref="phaserRef" @current-active-scene="currentScene" />
        <div class="space-y-2">
          <button class="btn" @click="changeScene">Change Scene</button>
          <button :disabled="canMoveSprite" class="btn" @click="moveSprite">Toggle Movement</button>
          <button class="btn" @click="addSprite">Add New Sprite</button>
        </div>
        <div class="mt-4 p-2 bg-gray-100 rounded">
          Sprite Position: <pre>{{ spritePosition }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.btn {
  @apply bg-green-500 text-white py-2 px-4 rounded hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed;
}
</style>
