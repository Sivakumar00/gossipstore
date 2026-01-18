import { describe, it, expect } from '@jest/globals';
import { DoublyLinkedList, ListNode } from '../src/components/linked-list';

describe('ListNode', () => {
  it('should create a node with the correct value', () => {
    const node = new ListNode<number>(42);
    expect(node.value).toBe(42);
    expect(node.next).toBeNull();
    expect(node.prev).toBeNull();
  });
});

describe('DoublyLinkedList', () => {
  it('should initialize as empty', () => {
    const list = new DoublyLinkedList<number>();
    expect(list.size).toBe(0);
    expect(list.isEmpty()).toBe(true);
    expect(list.getFirst()).toBeNull();
    expect(list.getLast()).toBeNull();
  });

  describe('addFront', () => {
    it('should add a node to the front of an empty list', () => {
      const list = new DoublyLinkedList<number>();
      const node = list.addFront(42);

      expect(list.size).toBe(1);
      expect(list.isEmpty()).toBe(false);
      expect(list.getFirst()).toBe(node);
      expect(list.getLast()).toBe(node);
      expect(node.value).toBe(42);
    });

    it('should add a node to the front of a non-empty list', () => {
      const list = new DoublyLinkedList<number>();
      list.addFront(1);
      const node = list.addFront(2);

      expect(list.size).toBe(2);
      expect(list.getFirst()).toBe(node);
      expect(list.getFirst()?.value).toBe(2);
      expect(list.getLast()?.value).toBe(1);
    });
  });

  describe('addBack', () => {
    it('should add a node to the back of an empty list', () => {
      const list = new DoublyLinkedList<number>();
      const node = list.addBack(42);

      expect(list.size).toBe(1);
      expect(list.isEmpty()).toBe(false);
      expect(list.getFirst()).toBe(node);
      expect(list.getLast()).toBe(node);
      expect(node.value).toBe(42);
    });

    it('should add a node to the back of a non-empty list', () => {
      const list = new DoublyLinkedList<number>();
      list.addBack(1);
      const node = list.addBack(2);

      expect(list.size).toBe(2);
      expect(list.getLast()).toBe(node);
      expect(list.getFirst()?.value).toBe(1);
      expect(list.getLast()?.value).toBe(2);
    });
  });

  describe('remove', () => {
    it('should remove the only node in the list', () => {
      const list = new DoublyLinkedList<number>();
      const node = list.addFront(42);
      const value = list.remove(node);

      expect(value).toBe(42);
      expect(list.size).toBe(0);
      expect(list.isEmpty()).toBe(true);
      expect(list.getFirst()).toBeNull();
      expect(list.getLast()).toBeNull();
    });

    it('should remove the first node in a multi-node list', () => {
      const list = new DoublyLinkedList<number>();
      const node1 = list.addBack(1);
      list.addBack(2);
      list.addBack(3);

      const value = list.remove(node1);

      expect(value).toBe(1);
      expect(list.size).toBe(2);
      expect(list.getFirst()?.value).toBe(2);
    });

    it('should remove a middle node in a multi-node list', () => {
      const list = new DoublyLinkedList<number>();
      list.addBack(1);
      const node2 = list.addBack(2);
      list.addBack(3);

      const value = list.remove(node2);

      expect(value).toBe(2);
      expect(list.size).toBe(2);
      expect(list.getFirst()?.value).toBe(1);
      expect(list.getLast()?.value).toBe(3);
    });

    it('should remove the last node in a multi-node list', () => {
      const list = new DoublyLinkedList<number>();
      list.addBack(1);
      list.addBack(2);
      const node3 = list.addBack(3);

      const value = list.remove(node3);

      expect(value).toBe(3);
      expect(list.size).toBe(2);
      expect(list.getLast()?.value).toBe(2);
    });
  });

  describe('moveToFront', () => {
    it('should do nothing if node is already at the front', () => {
      const list = new DoublyLinkedList<number>();
      const node = list.addFront(42);
      list.moveToFront(node);

      expect(list.size).toBe(1);
      expect(list.getFirst()).toBe(node);
    });

    it('should move a middle node to the front', () => {
      const list = new DoublyLinkedList<number>();
      list.addBack(1);
      const node2 = list.addBack(2);
      list.addBack(3);

      list.moveToFront(node2);

      expect(list.size).toBe(3);
      expect(list.getFirst()).toBe(node2);
      expect(list.getFirst()?.value).toBe(2);
      expect(list.getLast()?.value).toBe(3);
    });

    it('should move the last node to the front', () => {
      const list = new DoublyLinkedList<number>();
      list.addBack(1);
      list.addBack(2);
      const node3 = list.addBack(3);

      list.moveToFront(node3);

      expect(list.size).toBe(3);
      expect(list.getFirst()).toBe(node3);
      expect(list.getFirst()?.value).toBe(3);
      expect(list.getLast()?.value).toBe(2);
    });
  });

  describe('removeFirst and removeLast', () => {
    it('should return null when removing from an empty list', () => {
      const list = new DoublyLinkedList<number>();

      expect(list.removeFirst()).toBeNull();
      expect(list.removeLast()).toBeNull();
    });

    it('should remove the only node with removeFirst', () => {
      const list = new DoublyLinkedList<number>();
      list.addBack(42);

      expect(list.removeFirst()).toBe(42);
      expect(list.size).toBe(0);
      expect(list.isEmpty()).toBe(true);
    });

    it('should remove the only node with removeLast', () => {
      const list = new DoublyLinkedList<number>();
      list.addBack(42);

      expect(list.removeLast()).toBe(42);
      expect(list.size).toBe(0);
      expect(list.isEmpty()).toBe(true);
    });

    it('should remove the first node with removeFirst', () => {
      const list = new DoublyLinkedList<number>();
      list.addBack(1);
      list.addBack(2);
      list.addBack(3);

      expect(list.removeFirst()).toBe(1);
      expect(list.size).toBe(2);
      expect(list.getFirst()?.value).toBe(2);
    });

    it('should remove the last node with removeLast', () => {
      const list = new DoublyLinkedList<number>();
      list.addBack(1);
      list.addBack(2);
      list.addBack(3);

      expect(list.removeLast()).toBe(3);
      expect(list.size).toBe(2);
      expect(list.getLast()?.value).toBe(2);
    });
  });
});
