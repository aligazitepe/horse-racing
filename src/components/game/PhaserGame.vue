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
import { onMounted, onUnmounted, ref, computed, watch } from 'vue';
import { useMainStore } from '@/store';
import { storeToRefs } from 'pinia';
import Phaser from 'phaser';
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
  const MainScene = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize: function MainScene() {
      Phaser.Scene.call(this, { key: 'MainScene' });
    },
    preload: function () {
      this.load.image('horse', '/assets/star.png');
      this.load.image('background', '/assets/bg.png');
      this.load.spritesheet('character', '/assets/horse_test.png', {
        frameWidth: 64,
        frameHeight: 64
      });
    },
    create: function () {
      this.add.image(512, 384, 'background');
      this.anims.create({
        key: 'run',
        frames: this.anims.generateFrameNumbers('character', { start: 12, end: 17 }),
        frameRate: 10,
        repeat: -1
      });
      this.anims.create({
        key: 'stop',
        frames: this.anims.generateFrameNumbers('character', { start: 18, end: 21 }),
        frameRate: 10,
        repeat: 0
      });
      this.anims.create({
        key: 'cheer',
        frames: this.anims.generateFrameNumbers('character', { start: 23, end: 30 }),
        frameRate: 10,
        repeat: -1
      });

      this.horses = currentRace.value?.horses.map((horse, index) => {
        if (horse.name.split(" ")[1] === "Gazitepe") {
          horse.condition = 1000;
        }
        const sprite = this.add.sprite(50, 100 + index * 50, 'character');
        const text = this.add.text(-150, 100 + index * 50, horse.name, { color: '#fff', fontSize: '16px' });
        sprite.anims.play('run');
        const tintColor = Phaser.Display.Color.HexStringToColor(horse.color).color;
        sprite.setTint(tintColor);
        sprite.horseData = horse;
        return { sprite, text };
      });

      this.finishLine = 740;
      this.raceFinished = false;
      this.results = [];
    },
    update: function () {
      if (this.raceFinished) return;

      this.horses.forEach(({ sprite, text }: { sprite: any, text: any }) => {
        if (sprite.x >= this.finishLine) {
          if (!this.results.includes(sprite.horseData)) {
            sprite.anims.play("stop");
            const badge = this.add.rectangle(sprite.x + 40, sprite.y + 8, 20, 20, 0x000000);
            const text = this.add.text(sprite.x + 30, sprite.y, this.results.length + 1, { color: '#fff', fontSize: '16px' });
            Phaser.Display.Align.In.Center(text, badge);

            if (this.results.length == 0) {
              sprite.anims.play("cheer");
            }
            this.results.push(sprite.horseData);
          }
        } else {
          const moveBy = 2 + ((Math.log(sprite.horseData.condition) - Math.log(1)) / (Math.log(10) - Math.log(1))) * 1;
          sprite.x += moveBy;
          text.x += moveBy;
        }
      });

      if (this.results.length === this.horses.length) {
        this.raceFinished = true;
        store.finishRace({ data: this.results });
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
  watch(currentRace, (newVal) => {
    if (newVal?.started) {
      createGame();
    }
  }, { immediate: true });

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
