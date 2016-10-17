
const ColorCoder = {
  colorHash: {},
  colorCounter: 0,
  colorLibrary: ['#91D3E2', '#92E0BF', '#D4DD92', '#e0b092',
                 '#c392e0', '#E94949', '#7097DA', '#79998B',
                 '#F2755F', '#FCB34D', '#52B889', '#A8D45F',
                 '#F87FAB', '#5281AB'],
  resolveColor: function resolveColor(moduleCode) {
    if (!this.colorHash[moduleCode]) {
      if (this.colorCounter >= this.colorLibrary.length) this.colorCounter = 0;
      this.colorHash[moduleCode] = this.colorLibrary[this.colorCounter];
      this.colorCounter += 1;
    }
    return this.colorHash[moduleCode];
  }
};

export default ColorCoder;
