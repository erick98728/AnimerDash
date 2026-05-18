export default class InputSystem {
  constructor(scene) {
    this.scene = scene;
    this.cursors = scene.input.keyboard.createCursorKeys();
    this.keys = scene.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      attack: Phaser.Input.Keyboard.KeyCodes.J,
      dash: Phaser.Input.Keyboard.KeyCodes.K,
      projectile: Phaser.Input.Keyboard.KeyCodes.L,
      pause: Phaser.Input.Keyboard.KeyCodes.ESC,
    });
  }

  getHorizontalDirection() {
    const leftPressed = this.cursors.left.isDown || this.keys.left.isDown;
    const rightPressed = this.cursors.right.isDown || this.keys.right.isDown;

    if (leftPressed && !rightPressed) return -1;
    if (rightPressed && !leftPressed) return 1;
    return 0;
  }

  wantsJump() {
    return Phaser.Input.Keyboard.JustDown(this.cursors.space) || Phaser.Input.Keyboard.JustDown(this.keys.up);
  }

  wantsAttack() {
    return Phaser.Input.Keyboard.JustDown(this.keys.attack);
  }

  wantsDash() {
    return Phaser.Input.Keyboard.JustDown(this.keys.dash);
  }

  wantsProjectile() {
    return Phaser.Input.Keyboard.JustDown(this.keys.projectile);
  }
}
