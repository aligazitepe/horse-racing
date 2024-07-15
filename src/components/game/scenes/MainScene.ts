import Phaser from 'phaser'
import { EventBus } from '../EventBus'
import { useMainStore } from '@/store'
import { storeToRefs } from 'pinia'
import { type Horse } from '@/store' // Ensure that Horse interface is exported from the store

interface HorseSprite {
  sprite: Phaser.GameObjects.Sprite
  text: Phaser.GameObjects.Text
  horseData: Horse
}

export class MainScene extends Phaser.Scene {
  private horses: HorseSprite[]
  private finishLine: number
  private raceFinished: boolean
  private results: Horse[]
  private raceLengths: number[]
  private background!: Phaser.GameObjects.TileSprite
  private finishLineGraphic!: Phaser.GameObjects.Line

  constructor() {
    super('MainScene')
    this.horses = []
    this.finishLine = 0
    this.raceFinished = false
    this.results = []
    this.raceLengths = [1200, 1400, 1600, 1800, 2000, 2200] // Define race lengths
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
    const { getCurrentRace, currentRaceIndex } = storeToRefs(store)
    store.startNextRace()

    this.finishLine = this.raceLengths[currentRaceIndex.value || 0] // Set the finish line based on the current race index

    this.background = this.add.tileSprite(0, 0, this.finishLine + 1024, 768, 'background')
    this.background.setOrigin(0, 0)

    this.createAnimations()

    this.horses =
      getCurrentRace.value?.horses.map((horse, index) => {
        const sprite = this.add.sprite(50, 100 + index * 50, 'character')
        const text = this.add.text(-150, 100 + index * 50, horse.name, {
          color: '#fff',
          fontSize: '16px'
        })
        sprite.anims.play('run')
        const tintColor = Phaser.Display.Color.HexStringToColor(horse.color).color
        sprite.setTint(tintColor)
        return { sprite, text, horseData: horse }
      }) ?? []

    this.cameras.main.setBounds(0, 0, this.finishLine + 200, 600) // Set camera bounds
    this.cameras.main.startFollow(this.horses[0].sprite, true, 0.08, 0.08) // Start following the leading horse

    // Add a vertical line at the finish line
    this.finishLineGraphic = this.add
      .line(this.finishLine, 0, 0, 0, 0, 600, 0xff0000)
      .setOrigin(0, 0)
      .setLineWidth(2, 2)

    EventBus.emit('current-scene-ready', this)
  }

  update() {
    if (this.raceFinished) return

    let leadingHorse = this.horses[0]

    this.horses.forEach(({ sprite, text, horseData }) => {
      if (sprite.x >= this.finishLine) {
        if (!this.results.includes(horseData)) {
          sprite.anims.play('stop')
          const badge = this.add.rectangle(sprite.x + 40, sprite.y + 8, 20, 20, 0x000000)
          const resultText = this.add.text(
            sprite.x + 30,
            sprite.y,
            (this.results.length + 1).toString(),
            {
              color: '#fff',
              fontSize: '16px'
            }
          )
          Phaser.Display.Align.In.Center(resultText, badge)

          if (this.results.length === 0) {
            sprite.anims.play('cheer')
          }
          this.results.push(horseData)
        }
      } else {
        const moveBy =
          2 + ((Math.log(horseData.condition) - Math.log(1)) / (Math.log(10) - Math.log(1))) * 1
        sprite.x += moveBy
        text.x += moveBy
      }

      // Check if the current horse is leading
      if (sprite.x > leadingHorse.sprite.x) {
        leadingHorse = { sprite, text, horseData }
      }
    })

    // Update the camera to follow the leading horse
    this.cameras.main.startFollow(leadingHorse.sprite, true, 0.08, 0.08)

    // Scroll the background to match the leading horse's position
    this.background.tilePositionX = leadingHorse.sprite.x * 0.5

    // Update the finish line position relative to the camera's world view
    this.finishLineGraphic.setPosition(this.finishLine, this.cameras.main.worldView.y)

    if (this.results.length === this.horses.length) {
      this.raceFinished = true
      const store = useMainStore()
      store.finishRace({ data: this.results })
      EventBus.emit('race-finished', this.results)

      // Move the winner sprite and text to the finish line
      const winnerSprite = this.add.sprite(this.finishLine - 350, 300, 'character')
      winnerSprite.setScale(2)
      const winnerText = this.add.text(this.finishLine - 420, 375, this.results[0].name, {
        color: '#fff',
        fontSize: '16px'
      })
      winnerSprite.anims.play('climbOff')
      const winnerTintColor = Phaser.Display.Color.HexStringToColor(this.results[0].color).color
      winnerSprite.setTint(winnerTintColor)

      setTimeout(() => {
        if (store.getRaces.filter((race) => race.results.length < 10).length === 0) {
          this.scene.start('GameOverScene')
        } else {
          this.scene.start('MainScene')
        }
      }, 5000)
    }
  }

  resetRaceState() {
    this.horses = []
    this.finishLine = 0 // Reset finish line
    this.raceFinished = false
    this.results = []
    this.children.removeAll() // Remove all children to clean up the previous race assets
  }

  private createAnimations() {
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
  }
  public getFinishLine(): number {
    return this.finishLine
  }
  public getHorses(): HorseSprite[] {
    return this.horses
  }
}
