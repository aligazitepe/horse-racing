import { defineStore } from 'pinia';

interface Horse {
  id: number;
  color: string;
  condition: number;
}

interface Race {
  id: number;
  horses: Horse[];
  results: Horse[];
}

interface RootState {
  horses: Horse[];
  races: Race[];
  currentRaceIndex: number | null;
  colorPalette: { [key: number]: string };
}

export const useMainStore = defineStore('main', {
  state: (): RootState => ({
    horses: [],
    races: [],
    currentRaceIndex: null,
    colorPalette: {
      1: "#1F77B4",  // Blue
      2: "#FF7F0E",  // Orange
      3: "#2CA02C",  // Green
      4: "#D62728",  // Red
      5: "#9467BD",  // Purple
      6: "#8C564B",  // Brown
      7: "#E377C2",  // Pink
      8: "#7F7F7F",  // Gray
      9: "#BCBD22",  // Olive
      10: "#17BECF", // Teal
      11: "#AEC7E8", // Light Blue
      12: "#FFBB78", // Light Orange
      13: "#98DF8A", // Light Green
      14: "#FF9896", // Light Red
      15: "#C5B0D5", // Light Purple
      16: "#C49C94", // Light Brown
      17: "#F7B6D2", // Light Pink
      18: "#C7C7C7", // Light Gray
      19: "#DBDB8D", // Light Olive
      20: "#9EDAE5"  // Light Teal
    },
  }),
  actions: {
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
      console.log("Horses initialized:", this.horses);
    },
    generateRaceSchedule() {
      const races: Race[] = [];
      const numRaces = 6;
      for (let i = 1; i <= numRaces; i++) {
        const selectedHorses: Horse[] = [];
        const horsePool = [...this.horses];
        while (selectedHorses.length < 10) {
          const randomIndex = Math.floor(Math.random() * horsePool.length);
          selectedHorses.push(horsePool.splice(randomIndex, 1)[0]);
        }
        races.push({ id: i, horses: selectedHorses, results: [] });
      }
      this.races = races;
      this.currentRaceIndex = 0;
      console.log("Race schedule generated:", this.races);
    },
    startNextRace() {
      if (this.currentRaceIndex !== null && this.currentRaceIndex < this.races.length) {
        const currentRace = this.races[this.currentRaceIndex];
      }
    },
    finishRace({data}:{data:{id:number,color:string,condition:number}}) {
        if (this.currentRaceIndex !== null && this.currentRaceIndex <= this.races.length) {
            const currentRace = this.races[this.currentRaceIndex];
            currentRace.results = data;
            console.log(currentRace)
            this.currentRaceIndex++;
          }
    }
  },
  getters: {
    getHorses: (state) => state.horses,
    getRaces: (state) => state.races,
    getCurrentRace: (state) => {
      if (state.currentRaceIndex !== null && state.currentRaceIndex < state.races.length) {
        return state.races[state.currentRaceIndex];
      }
      return null;
    },
    getRaceResults: (state) => (raceId: number) => {
      return state.races.find(race => race.id === raceId)?.results || [];
    },
  },
});
