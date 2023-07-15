export class KeyboardState {
    constructor() {
      this.keys = {};
  
      // Add event listeners for keydown and keyup events
      window.addEventListener('keydown', this.onKeyDown.bind(this));
      window.addEventListener('keyup', this.onKeyUp.bind(this));
    }
  
    // Event handler for keydown event
    onKeyDown(event) {
      this.keys[event.code] = true;
    }
  
    // Event handler for keyup event
    onKeyUp(event) {
      this.keys[event.code] = false;
    }
  
    // Check if a specific key is currently pressed
    isKeyPressed(keyCode) {
      return !!this.keys[keyCode];
    }

    push_handler(object) {
      window.addEventListener('keydown', object.onKeyDown.bind(object));
      window.addEventListener('keyup', object.onKeyUp.bind(object));
    }
  }
  