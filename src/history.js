class KgHistory {
  constructor(cy) {
      this.stacks = [];
      this.curStep = 0;
      this.cy = cy;
      this.push(cy.json());
      this.events = null;
  }

  push(json) {
      this.stacks = this.stacks.slice(0, this.curStep + 1);
      if (this.stacks.length + 1 > 20) {
          this.stacks.shift();
      }
      this.stacks.push(json);
      this.curStep = this.stacks.length - 1;
      !!this.events && this.events.emit('undo', true);
  }

  pushSnapshot() {
      this.push(this.cy.json());
  }

  getSnapshot() {
      return this.cy.json();
  }

  undo() {
      if (this.curStep > 0) {
          this.curStep--;
          const json = this.stacks[this.curStep];
          json.layout = {
              name: 'preset'
          };
          this.cy.batch(() => {
              this.cy.json(json);
          });
          !!this.events && this.events.emit('back');
      }
      if (this.stacks.length > 0 && this.curStep < this.stacks.length - 1) {
          !!this.events && this.events.emit('redo', true);
      }
      if (this.curStep === 0) {
          !!this.events && this.events.emit('undo', false);
      }
  }

  redo() {
      if (this.curStep < this.stacks.length - 1) {
          this.curStep++;
          const json = this.stacks[this.curStep];
          json.layout = {
              name: 'preset'
          };
          this.cy.batch(() => {
              this.cy.json(json);
          });
          !!this.events && this.events.emit('back');
      }
      if (this.curStep === this.stacks.length - 1) {
          !!this.events && this.events.emit('redo', false);
      }
      if (this.curStep > 0 && this.stacks.length > 0) {
          !!this.events && this.events.emit('undo', true);
      }
  }
}

export default KgHistory;
