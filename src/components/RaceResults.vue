<template>
    <div class="p-4">
      <h2 class="text-2xl font-bold mb-4">Race Results</h2>
      <div v-if="races.length > 0">
        <div v-for="race in races" :key="race.id" class="p-4 bg-white rounded-lg shadow-md mb-4">
          <h3 class="text-xl font-bold">Race {{ race.id }} Results</h3>
          <ul class="mt-2 space-y-1">
            <li v-for="horse in race.results" :key="horse.id">
               {{ horse.name }} (Condition: {{ horse.condition }})
            </li>
          </ul>
        </div>
      </div>
      <p v-else>No results available. Generate a race schedule and start races to see results.</p>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent } from 'vue';
  import { useMainStore } from '@/store';
  import { storeToRefs } from 'pinia';
  
  export default defineComponent({
    name: 'RaceResults',
    setup() {
      const store = useMainStore();
      const { races } = storeToRefs(store);
  
      return {
        races,
      };
    },
  });
  </script>
  