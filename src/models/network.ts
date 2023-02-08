export default class Network {
    public readonly nodes: Set<string>;

    constructor() {
      this.nodes = new Set();
    }

    public addNode(node: string) {
      this.nodes.add(node);
    }
}