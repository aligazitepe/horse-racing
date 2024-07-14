<template>
    <div v-if="currentRace" class="p-4">
      <h3 class="text-xl font-bold mb-4">Race {{ currentRace.id }}</h3>
      <button @click="startNextRace" class="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700">
        {{ currentRaceIndex === 0 ? 'Start First Race' : 'Start Next Race' }}
      </button>
    </div>
    <div v-else class="p-4">
      <p v-if="races.length === 0">No races available. Generate a race schedule to start.</p>
      <p v-else>No more races to run.</p>
    </div>
    <div id="game-container"></div>
  </template>
  
  <script setup lang="ts">
  import { onMounted, onUnmounted, ref, computed,watch } from 'vue';
  import { useMainStore } from '@/store';
  import { storeToRefs } from 'pinia';
  import Phaser from 'phaser';
  import { EventBus } from './EventBus';
  
  // Save the current scene instance
  const scene = ref();
  const game = ref();
  
  const emit = defineEmits(['current-active-scene']);
  
  const store = useMainStore();
  const { getCurrentRace, currentRaceIndex, races } = storeToRefs(store);
  
  const currentRace = computed(() => getCurrentRace.value);
  
  const startNextRace = () => {
    store.startNextRace();
  };
  
  const createGame = () => {
    const MainScene = new Phaser.Class({
      Extends: Phaser.Scene,
      initialize: function MainScene() {
        Phaser.Scene.call(this, { key: 'MainScene'  });
      },
      preload: function() {
        this.load.image('horse', '/assets/star.png'); // Load horse image
        this.load.image('background', '/assets/bg.png'); // Load background image
      },
      create: function() {
        this.add.image(512, 384, 'background');
        this.horses = currentRace.value.horses.map((horse, index) => {
          const sprite = this.add.sprite(50, 100 + index * 50, 'horse');
          sprite.horseData = horse;
          return sprite; 
        });
  
        this.finishLine = 750;
        this.raceFinished = false;
        this.results = [];
      },
      update: function() {
        if (this.raceFinished) return;
  
        this.horses.forEach((sprite) => {
          if (sprite.x >= this.finishLine) {
            if (!this.results.includes(sprite.horseData)) {
              this.results.push(sprite.horseData);
            }
          } else {
            sprite.x += Math.log(sprite.horseData.condition);
          }
        });
  
        if (this.results.length === this.horses.length) {
          this.raceFinished = true;
          store.finishRace({data:this.results});
          EventBus.emit('race-finished', this.results);
        }
      },
    });
  
    const config = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      scene: MainScene,
      parent: 'game-container',
    };
  
    game.value = new Phaser.Game(config);
  };
  
  onMounted(() => {
    watch(currentRace, () => {
      if (currentRace.value) {
        createGame();
      }
    });
  
    EventBus.on('current-scene-ready', (currentScene) => {
      emit('current-active-scene', currentScene);
      scene.value = currentScene;
    });
  
    EventBus.on('race-finished', (results) => {
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
  