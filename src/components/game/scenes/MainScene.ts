import Phaser from 'phaser'
import { EventBus } from '../EventBus'
import { useMainStore } from '@/store'
import { storeToRefs } from 'pinia'

export class MainScene extends Phaser.Scene {
  private horses: any[]
  private finishLine: number
  private raceFinished: boolean
  private results: any[]

  constructor() {
    super('MainScene')
    this.horses = []
    this.finishLine = 740
    this.raceFinished = false
    this.results = []
  }

  preload() {
    this.load.image('horse', '/assets/star.png')
    this.load.image('background', '/assets/bg.png')
    this.load.spritesheet('character', '/assets/horse_test.png', {
      frameWidth: 64,
      frameHeight: 64
    })
  }

  create() {
    this.resetRaceState()

    const store = useMainStore()
    const { getCurrentRace } = storeToRefs(store)
    store.startNextRace()

    this.add.image(512, 384, 'background')
    this.anims.create({
      key: 'run',
      frames: this.anims.generateFrameNumbers('character', { start: 12, end: 17 }),
      frameRate: 10,
      repeat: -1
    })
    this.anims.create({
      key: 'stop',
      frames: this.anims.generateFrameNumbers('character', { start: 18, end: 21 }),
      frameRate: 10,
      repeat: 0
    })
    this.anims.create({
      key: 'cheer',
      frames: this.anims.generateFrameNumbers('character', { start: 23, end: 30 }),
      frameRate: 10,
      repeat: -1
    })
    this.anims.create({
      key: 'climbOff',
      frames: this.anims.generateFrameNumbers('character', { start: 33, end: 38 }),
      frameRate: 10,
      repeat: 0
    })

    this.horses = getCurrentRace.value?.horses.map((horse: any, index: number) => {
      const sprite = this.add.sprite(50, 100 + index * 50, 'character')
      const text = this.add.text(-150, 100 + index * 50, horse.name, {
        color: '#fff',
        fontSize: '16px'
      })
      sprite.anims.play('run')
      const tintColor = Phaser.Display.Color.HexStringToColor(horse.color).color
      sprite.setTint(tintColor)
      sprite.horseData = horse
      return { sprite, text }
    })

    EventBus.emit('current-scene-ready', this)
  }

  update() {
    if (this.raceFinished) return

    this.horses.forEach(({ sprite, text }) => {
      if (sprite.x >= this.finishLine) {
        if (!this.results.includes(sprite.horseData)) {
          sprite.anims.play('stop')
          const badge = this.add.rectangle(sprite.x + 40, sprite.y + 8, 20, 20, 0x000000)
          const text = this.add.text(sprite.x + 30, sprite.y, this.results.length + 1, {
            color: '#fff',
            fontSize: '16px'
          })
          Phaser.Display.Align.In.Center(text, badge)

          if (this.results.length === 0) {
            sprite.anims.play('cheer')
          }
          this.results.push(sprite.horseData)
        }
      } else {
        const moveBy =
          2 +
          ((Math.log(sprite.horseData.condition) - Math.log(1)) / (Math.log(10) - Math.log(1))) * 1
        sprite.x += moveBy
        text.x += moveBy
      }
    })

    if (this.results.length === this.horses.length) {
      this.raceFinished = true
      const store = useMainStore()
      store.finishRace({ data: this.results })
      EventBus.emit('race-finished', this.results)
      if (store.getRaces.filter((item) => item.results.length < 10).length === 0) {
        this.scene.start('GameOverScene')
      } else {
        console.log(this.results[0])
        const sprite = this.add.sprite(300, 300, 'character')
        sprite.setScale(2)
        const text = this.add.text(250, 400, this.results[0].name, {
          color: '#fff',
          fontSize: '16px'
        })
        sprite.anims.play('climbOff')
        const tintColor = Phaser.Display.Color.HexStringToColor(this.results[0].color).color
        sprite.setTint(tintColor)
        setTimeout(() => {
          this.scene.start('MainScene')
        }, 5000)
      }
    }
  }

  resetRaceState() {
    this.horses = []
    this.finishLine = 740
    this.raceFinished = false
    this.results = []
    this.children.removeAll() // Remove all children to clean up the previous race assets
  }
}
