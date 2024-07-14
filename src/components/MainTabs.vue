<template>
    <div>
      <div class="tabs">
        <button
          v-for="tab in tabs"
          :key="String(tab)"
          :class="{ 'active-tab': tab === selectedTab }"
          @click="selectTab(tab as string)"
        >
          {{ tab }}
        </button>
      </div>
      <div class="tab-content">
        <slot :name="selectedTab"></slot>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  
  const props = defineProps({
    tabs: {
      type: Array,
      required: true
    }
  });
  
  const selectedTab = ref(props.tabs[0]);
  
  const selectTab = (tab: string) => {
    selectedTab.value = tab;
  };
  
  defineExpose({ selectedTab });
  </script>
  
  <style scoped>
  .tabs {
    display: flex;
    border-bottom: 1px solid #ddd;
  }
  
  .tabs button {
    padding: 10px;
    cursor: pointer;
    background: none;
    border: none;
    outline: none;
  }
  
  .active-tab {
    font-weight: bold;
    border-bottom: 2px solid #000;
  }
  
  .tab-content {
    padding: 10px;
  }
  </style>
  