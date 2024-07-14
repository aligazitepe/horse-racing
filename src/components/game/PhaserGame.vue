<template>
  <div id="game-container"></div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, computed, watch } from 'vue';
import { useMainStore } from '@/store';
import { storeToRefs } from 'pinia';
import Phaser from 'phaser';
import { MainMenuScene } from './scenes/MainMenuScene';
import { MainScene } from './scenes/MainScene';
import { TransitionScene } from './scenes/TransitionScene';
import { GameOverScene } from './scenes/GameOverScene';
import { EventBus } from './EventBus';

const scene = ref();
const game = ref();

const emit = defineEmits(['current-active-scene']);

const store = useMainStore();
const { getCurrentRace, currentRaceIndex, races } = storeToRefs(store);

const currentRace = computed(() => getCurrentRace.value);

const startNextRace = async () => {
  await store.startNextRace();
  if (currentRace.value) {
    currentRace.value.started = true;
  }
};

const createGame = () => {
  const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: [MainMenuScene, MainScene, TransitionScene, GameOverScene],
    parent: 'game-container',
  };

  game.value = new Phaser.Game(config);
};

onMounted(() => {
  createGame();


  EventBus.on('current-scene-ready', (currentScene: any) => {
    emit('current-active-scene', currentScene);
    scene.value = currentScene;
  });

  EventBus.on('race-finished', (results: any) => {
    console.log('Race finished:', results);
  });
});

onUnmounted(() => {
  if (game.value) {
    game.value.destroy(true);
    game.value = null;
  }
});

defineExpose({ scene, game, currentRace, currentRaceIndex, races, startNextRace });
</script>
