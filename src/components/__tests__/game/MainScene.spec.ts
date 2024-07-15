import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { MainScene } from '../../game/scenes/MainScene' // Adjust the import path as needed
import { useMainStore } from '../../../store' // Adjust the import path as needed

describe('MainScene', () => {
  let scene: MainScene
  let game: Phaser.Game

  beforeEach(async () => {
    const Phaser = await vi.importActual<typeof import('phaser')>('phaser')

    class MockGame extends Phaser.Game {
      constructor(config: Phaser.Types.Core.GameConfig) {
        super(config)
      }
      destroy() {}
    }

    vi.doMock('phaser', () => ({
      ...Phaser,
      Game: MockGame
    }))

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.CANVAS,
      width: 800,
      height: 600,
      scene: [MainScene],
      parent: 'phaser-container',
      autoFocus: false
    }

    const pinia = createPinia()
    setActivePinia(pinia)

    game = new Phaser.Game(config)
    scene = game.scene.getScene('MainScene') as MainScene
    game.scene.start('MainScene')
  })

  afterEach(() => {
    game.destroy(true)
  })

  it('should create the scene and initialize correctly', () => {
    const store = useMainStore()
    expect(store.currentRaceIndex).toBe(0)
  })

  it('should generate horses and races correctly', () => {
    const store = useMainStore()
    store.initializeHorses()
    store.generateRaceSchedule()
    expect(store.horses.length).toBe(20)
    expect(store.races.length).toBe(6)
    store.races.forEach((race) => {
      expect(race.horses.length).toBe(10)
    })
  })

  it('should follow the leading horse', () => {
    const store = useMainStore()
    store.initializeHorses()
    store.generateRaceSchedule()
    game.scene.start('MainScene') // Ensure the scene is started
    const leadingHorse = scene.getHorses()[0]
    leadingHorse.sprite.x = scene.getFinishLine() / 2
    scene.update()
    expect(scene.cameras.main.scrollX).toBeGreaterThan(0)
  })

  it('should finish the race correctly', () => {
    const store = useMainStore()
    store.initializeHorses()
    store.generateRaceSchedule()
    store.startNextRace()
    game.scene.start('MainScene') // Ensure the scene is started
    scene.getHorses().forEach(({ sprite }) => {
      sprite.x = scene.getFinishLine() + 1
    })
    scene.update()
    expect(store.currentRaceIndex).toBe(1)
    expect(store.races[0].results.length).toBe(10)
  })
})
