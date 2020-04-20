class NodeSet {
  list = [];

  get size() {
    return this.list.length;
  }

  add(value) {
    for (let i = 0; i < this.list.length; i++) {
      if (
        this.list[i].node === value.node &&
        this.list[i].object === value.object
      ) {
        this.list[i] = value;
        return;
      }
    }
    this.list.push(value);
  }

  pop() {
    return this.list.pop();
  }
}

let processQueue = new NodeSet();
let renderQueue = new Set();

export { processQueue, renderQueue };
