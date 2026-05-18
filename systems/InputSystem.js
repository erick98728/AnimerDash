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

    // Estrutura preparada para controles mobile touch no futuro.
    // Por enquanto, tudo fica falso e o teclado continua sendo o controle principal.
    this.touch = {
      left: false,
      right: false,
      jump: false,
      attack: false,
      dash: false,
      projectile: false,
    };
  }

  getHorizontalDirection() {
    const leftPressed = this.cursors.left.isDown || this.keys.left.isDown || this.touch.left;
    const rightPressed = this.cursors.right.isDown || this.keys.right.isDown || this.touch.right;

    if (leftPressed && !rightPressed) return -1;
    if (rightPressed && !leftPressed) return 1;
    return 0;
  }

  wantsJump() {
    const keyboardJump = Phaser.Input.Keyboard.JustDown(this.cursors.space) || Phaser.Input.Keyboard.JustDown(this.keys.up);
    const touchJump = this.consumeTouchAction('jump');
    return keyboardJump || touchJump;
  }

  wantsAttack() {
    const keyboardAttack = Phaser.Input.Keyboard.JustDown(this.keys.attack);
    const touchAttack = this.consumeTouchAction('attack');
    return keyboardAttack || touchAttack;
  }

  wantsDash() {
    const keyboardDash = Phaser.Input.Keyboard.JustDown(this.keys.dash);
    const touchDash = this.consumeTouchAction('dash');
    return keyboardDash || touchDash;
  }

  wantsProjectile() {
    const keyboardProjectile = Phaser.Input.Keyboard.JustDown(this.keys.projectile);
    const touchProjectile = this.consumeTouchAction('projectile');
    return keyboardProjectile || touchProjectile;
  }

  // Este método será útil quando botões na tela forem adicionados.
  setTouchDirection(direction, isPressed) {
    if (direction === 'left') this.touch.left = isPressed;
    if (direction === 'right') this.touch.right = isPressed;
  }

  // Este método permite que futuros botões mobile disparem ações únicas.
  triggerTouchAction(action) {
    if (Object.prototype.hasOwnProperty.call(this.touch, action)) {
      this.touch[action] = true;
    }
  }

  consumeTouchAction(action) {
    if (!this.touch[action]) return false;

    this.touch[action] = false;
    return true;
  }
}
