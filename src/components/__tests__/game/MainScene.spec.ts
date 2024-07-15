import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import Phaser from 'phaser'
import { MainScene } from '../../game/scenes/MainScene'
import { MainMenuScene } from '../../game/scenes/MainMenuScene'
import { TransitionScene } from '../../game/scenes/TransitionScene'
import { GameOverScene } from '../../game/scenes/GameOverScene'
import { useMainStore } from '../../../store'

vi.mock('../../../store', () => ({
  useMainStore: vi.fn(() => ({
    initializeHorses: vi.fn(),
    generateRaceSchedule: vi.fn(),
    startNextRace: vi.fn(),
    currentRaceIndex: 0,
    horses: [],
    races: []
  }))
}))

describe('MainScene', () => {
  let game: Phaser.Game

  const sceneKey = 'MainScene'

  const waitForSceneCreate = (scene: Phaser.Scene) => {
    return new Promise<void>((resolve) => {
      scene.events.once(Phaser.Scenes.Events.CREATE, resolve)
    })
  }

  beforeEach(() => {
    setActivePinia(createPinia())

    const config = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: 'game-container',
      scene: [MainMenuScene, MainScene, TransitionScene, GameOverScene]
    }

    game = new Phaser.Game(config)

    // Wait for the game to boot and run
    return new Promise<void>((resolve) => {
      game.events.once('ready', resolve)
    })
  })

  afterEach(() => {
    game.destroy(true)
  })

  it('should create the scene and initialize correctly', async () => {
    console.log('Adding scene', sceneKey)
    game.scene.add(sceneKey, MainScene)
    console.log('Starting scene', sceneKey)
    game.scene.start(sceneKey)

    const scene = game.scene.getScene(sceneKey) as MainScene
    if (!scene) {
      throw new Error(`Scene ${sceneKey} not found after adding and starting it.`)
    }

    await waitForSceneCreate(scene)
    const store = useMainStore()

    // Check if the store's startNextRace action has been called
    expect(store.currentRaceIndex).toBe(0)
  })

  it('should generate horses and races correctly', async () => {
    game.scene.add(sceneKey, MainScene)
    game.scene.start(sceneKey)

    const scene = game.scene.getScene(sceneKey) as MainScene
    if (!scene) {
      throw new Error(`Scene ${sceneKey} not found after adding and starting it.`)
    }

    await waitForSceneCreate(scene)
    const store = useMainStore()
    store.initializeHorses()
    store.generateRaceSchedule()

    expect(store.horses.length).toBe(20)
    expect(store.races.length).toBe(6)
    store.races.forEach((race) => {
      expect(race.horses.length).toBe(10)
    })
  })

  it('should follow the leading horse', async () => {
    game.scene.add(sceneKey, MainScene)
    game.scene.start(sceneKey)

    const scene = game.scene.getScene(sceneKey) as MainScene
    if (!scene) {
      throw new Error(`Scene ${sceneKey} not found after adding and starting it.`)
    }

    await waitForSceneCreate(scene)
    const store = useMainStore()
    store.initializeHorses()
    store.generateRaceSchedule()

    // Simulate leading horse movement
    const leadingHorse = scene.getHorses()[0]
    leadingHorse.sprite.x = scene.getFinishLine() / 2
    scene.update()

    expect(scene.cameras.main.scrollX).toBeGreaterThan(0)
  })

  it('should finish the race correctly', async () => {
    game.scene.add(sceneKey, MainScene)
    game.scene.start(sceneKey)

    const scene = game.scene.getScene(sceneKey) as MainScene
    if (!scene) {
      throw new Error(`Scene ${sceneKey} not found after adding and starting it.`)
    }

    await waitForSceneCreate(scene)
    const store = useMainStore()
    store.initializeHorses()
    store.generateRaceSchedule()
    store.startNextRace()

    // Simulate all horses reaching the finish line
    scene.getHorses().forEach(({ sprite }) => {
      sprite.x = scene.getFinishLine() + 1
    })
    scene.update()

    expect(store.currentRaceIndex).toBe(1)
    expect(store.races[0].results.length).toBe(10)
  })
})
