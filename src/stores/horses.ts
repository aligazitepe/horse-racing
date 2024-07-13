// src/store/index.ts
import { defineStore } from 'pinia';

interface Horse {
  id: number;
  color: string;
  condition: number;
}

interface RootState {
  races: any[];
  results: any[];
  horses: Horse[];
  colorPalette: { [key: number]: string };
}

export const useMainStore = defineStore('main', {
  state: (): RootState => ({
    races: [],
    results: [],
    horses: [],
    colorPalette: {
      1: "#1F77B4",
      2: "#FF7F0E",
      3: "#2CA02C",
      4: "#D62728",
      5: "#9467BD",
      6: "#8C564B",
      7: "#E377C2",
      8: "#7F7F7F",
      9: "#BCBD22",
      10: "#17BECF",
      11: "#AEC7E8",
      12: "#FFBB78",
      13: "#98DF8A",
      14: "#FF9896",
      15: "#C5B0D5",
      16: "#C49C94",
      17: "#F7B6D2",
      18: "#C7C7C7",
      19: "#DBDB8D",
      20: "#9EDAE5"
    },
  }),
  actions: {
    generateRaceSchedule() {
      // Generate race schedule logic
      this.races = [/* race data */];
    },
    runRace(raceId: number) {
      // Run race logic and get results
      this.results = [/* results data */];
    },
    initializeHorses() {
      const horses: Horse[] = [];
      for (let i = 1; i <= 20; i++) {
        horses.push({
          id: i,
          color: this.colorPalette[i],
          condition: Math.floor(Math.random() * 100) + 1,
        });
      }
      this.horses = horses;
    }
  },
  getters: {
    getRaces: (state) => state.races,
    getResults: (state) => state.results,
    getHorses: (state) => state.horses,
    getColorPalette: (state) => state.colorPalette,
  },
});
