/**
 * Generic ListNode implementation for a doubly linked list
 */
export class ListNode<T> {
  public value: T;
  public next: ListNode<T> | null = null;
  public prev: ListNode<T> | null = null;

  constructor(value: T) {
    this.value = value;
  }
}

/**
 * DoublyLinkedList implementation with O(1) operations for head/tail access
 */
export class DoublyLinkedList<T> {
  private head: ListNode<T> | null = null;
  private tail: ListNode<T> | null = null;
  private _size: number = 0;

  /**
   * Get the number of nodes in the list
   */
  get size(): number {
    return this._size;
  }

  /**
   * Check if the list is empty
   */
  isEmpty(): boolean {
    return this._size === 0;
  }

  /**
   * Add a new node to the front of the list
   * @param value The value to add
   * @returns The newly created node
   */
  addFront(value: T): ListNode<T> {
    const newNode = new ListNode<T>(value);

    if (this.isEmpty()) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      newNode.next = this.head;
      this.head!.prev = newNode;
      this.head = newNode;
    }

    this._size++;
    return newNode;
  }

  /**
   * Add a new node to the end of the list
   * @param value The value to add
   * @returns The newly created node
   */
  addBack(value: T): ListNode<T> {
    const newNode = new ListNode<T>(value);

    if (this.isEmpty()) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      newNode.prev = this.tail;
      this.tail!.next = newNode;
      this.tail = newNode;
    }

    this._size++;
    return newNode;
  }

  /**
   * Remove a node from the list
   * @param node The node to remove
   * @returns The value of the removed node
   */
  remove(node: ListNode<T>): T {
    if (node === this.head) {
      this.head = node.next;
    } else {
      node.prev!.next = node.next;
    }

    if (node === this.tail) {
      this.tail = node.prev;
    } else {
      node.next!.prev = node.prev;
    }

    this._size--;
    return node.value;
  }

  /**
   * Move a node to the front of the list
   * @param node The node to move
   */
  moveToFront(node: ListNode<T>): void {
    if (node === this.head) return;

    // Remove the node from its current position
    if (node === this.tail) {
      this.tail = node.prev;
      this.tail!.next = null;
    } else {
      node.prev!.next = node.next;
      node.next!.prev = node.prev;
    }

    // Add to front
    node.prev = null;
    node.next = this.head;
    this.head!.prev = node;
    this.head = node;
  }

  /**
   * Get the first node in the list
   * @returns The first node or null if empty
   */
  getFirst(): ListNode<T> | null {
    return this.head;
  }

  /**
   * Get the last node in the list
   * @returns The last node or null if empty
   */
  getLast(): ListNode<T> | null {
    return this.tail;
  }

  /**
   * Remove and return the first node in the list
   * @returns The value of the removed node or null if empty
   */
  removeFirst(): T | null {
    if (this.isEmpty()) return null;

    const value = this.head!.value;

    if (this.head === this.tail) {
      this.head = null;
      this.tail = null;
    } else {
      this.head = this.head!.next;
      this.head!.prev = null;
    }

    this._size--;
    return value;
  }

  /**
   * Remove and return the last node in the list
   * @returns The value of the removed node or null if empty
   */
  removeLast(): T | null {
    if (this.isEmpty()) return null;

    const value = this.tail!.value;

    if (this.head === this.tail) {
      this.head = null;
      this.tail = null;
    } else {
      this.tail = this.tail!.prev;
      this.tail!.next = null;
    }

    this._size--;
    return value;
  }
}
