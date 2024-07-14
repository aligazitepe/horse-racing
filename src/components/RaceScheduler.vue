<template>
  <div class="p-4">
    <h2 class="text-2xl font-bold mb-4">Race Scheduler</h2>
    <button @click="generateSchedule" class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700">
      Generate Race Schedule
    </button>
    <ul v-if="races.length > 0" class="space-y-4 mt-4">
      <li v-for="race in races" :key="race.id" class="p-4 bg-white rounded-lg shadow-md">
        <div class="text-lg font-semibold">Race {{ race.id }}</div>
        <ul class="mt-2 space-y-1">
          <li v-for="horse in race.horses" :key="horse.id">
            <div class="flex flex-row items-center gap-2">
              <div :style="{ backgroundColor: horse.color }" class="w-4 h-4 rounded-full "></div>
              {{ horse.name }} (Condition: {{ horse.condition }})
            </div>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useMainStore } from '@/store';
import { storeToRefs } from 'pinia';

export default defineComponent({
  name: 'RaceScheduler',
  setup() {
    const store = useMainStore();
    const { races } = storeToRefs(store);

    const generateSchedule = () => {
      store.generateRaceSchedule();
    };

    return {
      races,
      generateSchedule,
    };
  },
});
</script>