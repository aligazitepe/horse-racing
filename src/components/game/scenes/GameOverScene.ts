import Phaser from 'phaser'
import { EventBus } from '../EventBus'
import { useMainStore } from '@/store'
import { storeToRefs } from 'pinia'
import { watch } from 'vue'

export class GameOverScene extends Phaser.Scene {
  private races: any
  constructor() {
    super('GameOverScene')
  }

  preload() {
    this.load.image('background', '/assets/bg.png')
  }

  create() {
    this.store = useMainStore()
    const { races } = storeToRefs(this.store)
    this.races = races
    this.add.image(400, 300, 'background')
    this.add.text(400, 200, 'No more Races', { fontSize: '32px', color: '#fff' }).setOrigin(0.5)

    watch(this.races, (newVal) => {
      if (newVal.length > 0) {
        this.scene.start('MainMenuScene')
      }
    })
    this.add
      .text(400, 300, 'Generate a Schedule to start the simulation', {
        fontSize: '24px',
        color: '#fff'
      })
      .setOrigin(0.5)

    EventBus.emit('current-scene-ready', this)
  }
}
