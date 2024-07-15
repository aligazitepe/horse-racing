import { defineStore } from 'pinia'
import generateHorseName from '../utils/generateHorseName'
export interface Horse {
  id: number
  name: string
  color: string
  condition: number
}

export interface Race {
  id: number
  started: boolean
  horses: Horse[]
  results: Horse[]
}

export interface RootState {
  horses: Horse[]
  races: Race[]
  currentRaceIndex: number | null
  colorPalette: { [key: number]: string }
}

export const useMainStore = defineStore('main', {
  state: (): RootState => ({
    horses: [],
    races: [],
    currentRaceIndex: null,
    colorPalette: {
      1: '#FF5733', // Vibrant Orange
      2: '#33FF57', // Bright Green
      3: '#3357FF', // Bright Blue
      4: '#FF33A8', // Bright Pink
      5: '#FFC300', // Bright Yellow
      6: '#DAF7A6', // Light Green
      7: '#900C3F', // Dark Red
      8: '#581845', // Dark Purple
      9: '#C70039', // Red
      10: '#8DFF33', // Lime Green
      11: '#33FFE6', // Aqua
      12: '#E6FF33', // Lemon Yellow
      13: '#33D1FF', // Sky Blue
      14: '#FF3380', // Hot Pink
      15: '#8033FF', // Purple
      16: '#FF33FF', // Magenta
      17: '#33FFC1', // Aquamarine
      18: '#FF8D33', // Coral
      19: '#5733FF', // Indigo
      20: '#33FF8D' // Mint Green
    }
  }),
  actions: {
    initializeHorses() {
      const horses: Horse[] = []
      for (let i = 1; i <= 20; i++) {
        horses.push({
          id: i,
          color: this.colorPalette[i],
          condition: Math.floor(Math.random() * 100) + 1,
          name: generateHorseName(horses)
        })
      }
      this.horses = horses
      console.log('Horses initialized:', this.horses)
    },
    generateRaceSchedule() {
      const races: Race[] = []
      const numRaces = 6
      for (let i = 1; i <= numRaces; i++) {
        const selectedHorses: Horse[] = []
        const horsePool = [...this.horses]
        while (selectedHorses.length < 10) {
          const randomIndex = Math.floor(Math.random() * horsePool.length)
          selectedHorses.push(horsePool.splice(randomIndex, 1)[0])
        }
        races.push({ id: i, horses: selectedHorses, results: [], started: false })
      }
      this.races = races
      this.currentRaceIndex = 0
      console.log('Race schedule generated:', this.races)
    },
    startNextRace() {
      if (this.currentRaceIndex !== null && this.currentRaceIndex < this.races.length) {
        this.races[this.currentRaceIndex] = { ...this.races[this.currentRaceIndex], started: true } // Update the entire object
      }
    },
    finishRace({
      data
    }: {
      data: { id: number; color: string; condition: number; name: string }[]
    }) {
      if (this.currentRaceIndex !== null && this.currentRaceIndex <= this.races.length) {
        const currentRace = this.races[this.currentRaceIndex]
        currentRace.results = data
        this.currentRaceIndex++
        this.startNextRace()
      }
    }
  },
  getters: {
    getHorses: (state) => state.horses,
    getRaces: (state) => state.races,
    getCurrentRace: (state) => {
      if (state.currentRaceIndex !== null && state.currentRaceIndex < state.races.length) {
        return state.races[state.currentRaceIndex]
      }
      return null
    },
    getRaceResults: (state) => (raceId: number) => {
      return state.races.find((race) => race.id === raceId)?.results || []
    }
  }
})
