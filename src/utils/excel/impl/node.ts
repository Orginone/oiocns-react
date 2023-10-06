/**
 * 节点
 */
export class Node<T extends { [key: string]: any }> {
  id: string;
  parentId?: string;
  index: number;
  readonly children: Node<T>[];
  public data: T;

  constructor(id: string, data: T, index: number, parentId?: string) {
    this.id = id;
    this.parentId = parentId;
    this.data = data;
    this.index = index;
    this.children = [];
  }

  public addChild(node: Node<T>) {
    this.children.push(node);
  }
}

/**
 * 树
 */
export class Tree<T extends { [key: string]: any }> {
  /**
   * root 顶级虚拟节点,
   * nodeMap 存储当前节点，
   * freeMap 存储游离的节点，
   * 处理先进来的子节点找不到父类的问题
   */
  readonly root: Node<T>;
  readonly nodeMap: Map<string, Node<T>>;
  readonly freeMap: Map<string, Node<T>>;
  private seed: number;

  constructor(
    nodeData: T[],
    id: (node: T) => string,
    parentId: (node: T) => string | undefined,
    root?: T,
  ) {
    this.nodeMap = new Map();
    this.freeMap = new Map();
    this.seed = 0;
    if (root) {
      this.root = new Node(id(root), root, -1, undefined);
    } else {
      this.root = new Node('root_', {} as T, -1, undefined);
    }
    this.nodeMap.set(this.root.id, this.root);
    nodeData.forEach((item, index) =>
      this.addNode(id(item), item, index, parentId(item)),
    );
  }

  /**
   * 加入节点
   * @param id 节点 ID
   * @param parentId 父节点 ID
   * @param data 节点数据
   */
  addNode(id: string, data: T, index?: number, parentId?: string) {
    if (id == null) return;
    if (this.nodeMap.has(id)) return;
    let node: Node<T> = new Node<T>(id, data, index ?? this.seed++, parentId);
    if (!parentId) this.root.addChild(node);
    else {
      let parentNode: Node<T> | undefined = this.nodeMap.get(parentId);
      if (!parentNode) {
        this.freeMap.set(id, node);
      } else {
        parentNode.addChild(node);
      }
    }
    this.nodeMap.set(id, node);
  }

  /**
   * 清空游离的节点
   */
  clearFree() {
    if (this.freeMap.size !== 0) {
      let hasParent: string[] = [];
      this.freeMap.forEach((value, key) => {
        let freeNodeParentId: string = value.parentId!;
        if (this.nodeMap.has(freeNodeParentId)) {
          let parentNode: Node<T> = this.nodeMap.get(freeNodeParentId)!;
          parentNode.addChild(value);
          hasParent.push(key);
        }
      });
      hasParent.forEach((nodeKey) => this.freeMap.delete(nodeKey));
    }
  }
}
