<template>
    <div class="p-4">
      <h2 class="text-2xl font-bold mb-4">Horses</h2>
      <ul class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <li v-for="horse in horses" :key="horse.id" class="p-4 bg-white rounded-lg shadow-md">
          <div :style="{ backgroundColor: horse.color }" class="w-16 h-16 rounded-full mb-4"></div>
          <div class="text-lg font-semibold">{{ horse.name }}</div>
          <div>Condition: {{ horse.condition }}</div>
        </li>
      </ul>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent } from 'vue';
  import { useMainStore } from '@/store';
  import { storeToRefs } from 'pinia';
  
  export default defineComponent({
    name: 'HorsesComp',
    setup() {
      const store = useMainStore();
      const { horses } = storeToRefs(store);
  
      return {
        horses,
      };
    },
  });
  </script>
  