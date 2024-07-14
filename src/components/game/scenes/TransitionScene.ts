import Phaser from 'phaser'

export class TransitionScene extends Phaser.Scene {
  constructor() {
    super('TransitionScene')
  }

  create() {
    this.cameras.main.setBackgroundColor(0x000000)
    this.add
      .text(400, 300, 'Transitioning to the next race...', {
        fontSize: '32px',
        color: '#ffffff'
      })
      .setOrigin(0.5)

    this.time.delayedCall(
      3000,
      () => {
        this.scene.start('MainScene')
      },
      [],
      this
    )
  }
}
