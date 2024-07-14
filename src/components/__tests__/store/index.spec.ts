import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useMainStore } from '../../../store'
import generateHorseName from '../../../utils/generateHorseName'

// Mock the generateHorseName function
vi.mock('../../../utils/generateHorseName', () => {
  return {
    default: () => 'Mocked Horse Name'
  }
})

describe('Main Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('generates 20 horses when initializeHorses is called', () => {
    const mainStore = useMainStore()

    mainStore.initializeHorses()

    expect(mainStore.horses.length).toBe(20)
    mainStore.horses.forEach((horse, index) => {
      expect(horse).toEqual({
        id: index + 1,
        color: mainStore.colorPalette[index + 1],
        condition: expect.any(Number),
        name: 'Mocked Horse Name'
      })
      expect(horse.condition).toBeGreaterThanOrEqual(1)
      expect(horse.condition).toBeLessThanOrEqual(100)
    })
  })
  it('generates 6 races with 10 unique horses each when generateRaceSchedule is called', () => {
    const mainStore = useMainStore()

    mainStore.initializeHorses()
    mainStore.generateRaceSchedule()

    expect(mainStore.races.length).toBe(6)
    const allHorseIds = new Set(mainStore.horses.map((horse) => horse.id))
    mainStore.races.forEach((race) => {
      expect(race.horses.length).toBe(10)
      const raceHorseIds = new Set(race.horses.map((horse) => horse.id))
      expect(raceHorseIds.size).toBe(10)
      raceHorseIds.forEach((horseId) => {
        expect(allHorseIds.has(horseId)).toBe(true)
      })
    })
  })
  it('starts the next race when startNextRace is called', () => {
    const mainStore = useMainStore()

    mainStore.initializeHorses()
    mainStore.generateRaceSchedule()

    expect(mainStore.currentRaceIndex).toBe(0)

    mainStore.startNextRace()
    expect(mainStore.races[0].started).toBe(true)

    mainStore.currentRaceIndex = 1
    mainStore.startNextRace()
    expect(mainStore.races[1].started).toBe(true)

    // Ensure only the current race is started and not any future race
    for (let i = 2; i < mainStore.races.length; i++) {
      expect(mainStore.races[i].started).toBe(false)
    }
  })
  it('finishes the current race and starts the next one when finishRace is called', () => {
    const mainStore = useMainStore()

    mainStore.initializeHorses()
    mainStore.generateRaceSchedule()
    mainStore.startNextRace()

    const raceResults = mainStore.races[0].horses.map((horse) => ({
      id: horse.id,
      color: horse.color,
      condition: horse.condition,
      name: horse.name
    }))

    mainStore.finishRace({ data: raceResults })

    // Check that the results are correctly updated for the first race
    expect(mainStore.races[0].results).toEqual(raceResults)

    // Check that the currentRaceIndex is updated
    expect(mainStore.currentRaceIndex).toBe(1)

    // Check that the next race is started
    expect(mainStore.races[1].started).toBe(true)
  })
  it('getHorses getter returns the correct horses', () => {
    const mainStore = useMainStore()

    mainStore.initializeHorses()

    const horses = mainStore.getHorses
    expect(horses.length).toBe(20)
    horses.forEach((horse, index) => {
      expect(horse).toEqual({
        id: index + 1,
        color: mainStore.colorPalette[index + 1],
        condition: expect.any(Number),
        name: 'Mocked Horse Name'
      })
    })
  })

  it('getRaces getter returns the correct races', () => {
    const mainStore = useMainStore()

    mainStore.initializeHorses()
    mainStore.generateRaceSchedule()

    const races = mainStore.getRaces
    expect(races.length).toBe(6)
    races.forEach((race) => {
      expect(race.horses.length).toBe(10)
    })
  })

  it('getCurrentRace getter returns the current race', () => {
    const mainStore = useMainStore()

    mainStore.initializeHorses()
    mainStore.generateRaceSchedule()
    mainStore.startNextRace()

    const currentRace = mainStore.getCurrentRace
    expect(currentRace).toEqual(mainStore.races[0])

    mainStore.currentRaceIndex = 1
    const nextRace = mainStore.getCurrentRace
    expect(nextRace).toEqual(mainStore.races[1])
  })

  it('getRaceResults getter returns the correct results for a given race', () => {
    const mainStore = useMainStore()

    mainStore.initializeHorses()
    mainStore.generateRaceSchedule()
    mainStore.startNextRace()

    const raceResults = mainStore.races[0].horses.map((horse) => ({
      id: horse.id,
      color: horse.color,
      condition: horse.condition,
      name: horse.name
    }))

    mainStore.finishRace({ data: raceResults })

    const results = mainStore.getRaceResults(1)
    expect(results).toEqual(raceResults)

    const noResults = mainStore.getRaceResults(2)
    expect(noResults).toEqual([])
  })
})
