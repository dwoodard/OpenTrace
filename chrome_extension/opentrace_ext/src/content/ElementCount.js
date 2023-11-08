class ElementCount {
  constructor() {
    this.previousCounts = new Map();
    this.currentCounts = new Map();
    this.elementWithMaxGrowth = null;
    this.maxGrowth = 0;
    this.interval = 1000;
    this.timer = null;
  }

  start() {
    if (!this.timer) {
      this.timer = setInterval(this.updateAndFindMaxGrowth.bind(this), this.interval);
    }
  }

  stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  updateAndFindMaxGrowth() {
    this.currentCounts.clear();
    this.maxGrowth = 0;
    this.elementWithMaxGrowth = null;

    this.countChildNodes(document.body);

    this.previousCounts = new Map(this.currentCounts);

    if (this.elementWithMaxGrowth) {
      console.log('Element with max growth:', this.elementWithMaxGrowth, 'Growth:', this.maxGrowth);
    }
  }

  countChildNodes(node) {
    const count = node.childNodes.length;
    this.currentCounts.set(node, count);

    if (this.previousCounts.has(node)) {
      const growth = count - this.previousCounts.get(node);
      if (growth > this.maxGrowth) {
        this.maxGrowth = growth;
        this.elementWithMaxGrowth = node;
      }
    }

    node.childNodes.forEach(child => this.countChildNodes(child));
  }

  getElementWithMaxGrowth() {
    return this.elementWithMaxGrowth;
  }
}

export default ElementCount;
