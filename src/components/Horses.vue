<template>
  <div class="max-h-[800px] w-[350px] overflow-y-scroll px-5">
    <h2 class="text-2xl font-bold mb-4 text-white">Horses</h2>
    <ul class="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4">
      <li v-for="horse in horses" :key="horse.id" class="p-4 bg-white rounded-lg shadow-md">
        <div class="flex flex-row items-center gap-2">
          <div :style="{ backgroundColor: horse.color }" class="w-4 h-4 rounded-full "></div>
          <div class="text-lg font-semibold">{{ horse.name }}</div>
        </div>
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