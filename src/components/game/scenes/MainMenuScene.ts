import Phaser from 'phaser'
import { EventBus } from '../EventBus'
import { useMainStore } from '@/store'
import { storeToRefs } from 'pinia'
import { watch } from 'vue'

export class MainMenuScene extends Phaser.Scene {
  private store: any
  private races: any

  constructor() {
    super('MainMenuScene')
  }

  preload() {
    this.load.image('background', '/assets/bg.png')
  }

  create() {
    this.store = useMainStore()
    const { races } = storeToRefs(this.store)
    this.races = races

    this.add.image(400, 300, 'background')
    this.add.text(400, 200, 'Horse Racing Game', { fontSize: '32px', color: '#fff' }).setOrigin(0.5)
    this.add.text(400, 300, 'Click to Start', { fontSize: '24px', color: '#fff' }).setOrigin(0.5)

    this.input.once('pointerdown', () => {
      if (this.races.value.length > 0) {
        this.scene.start('MainScene')
      } else {
        alert('Please create a race schedule first.')
      }
    })

    EventBus.emit('current-scene-ready', this)

    // Watch for changes in the races array
    watch(
      this.races,
      (newVal) => {
        if (newVal.length > 0) {
          this.input.once('pointerdown', () => {
            this.scene.start('MainScene')
          })
        }
      },
      { deep: true }
    )
  }
}
