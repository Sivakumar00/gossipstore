import { DoublyLinkedList, ListNode } from '../components/linked-list';

/**
 * Options for configuring the LRUCache
 */
export interface LRUCacheOptions<V> {
  /** Maximum number of items to store in the cache */
  maxItems?: number;

  /** Maximum memory usage in bytes */
  maxMemoryBytes?: number;

  /** Function to calculate the memory size of a value */
  sizeCalculator?: (value: V) => number;
}

/**
 * LRUCache implementation with O(1) operations for get/set
 * Uses a combination of a HashMap and DoublyLinkedList to achieve constant time complexity
 */
export class LRUCache<K, V> {
  private readonly maxItems: number | undefined;
  private readonly maxMemoryBytes: number;
  private readonly sizeCalculator: ((value: V) => number) | undefined;
  private currentMemoryUsage: number = 0;
  private cache: Map<K, ListNode<[K, V]>>;
  private list: DoublyLinkedList<[K, V]>;

  // Default to half of available heap memory
  private static getDefaultMemoryLimit(): number {
    return Math.floor(process.memoryUsage().heapTotal / 2);
  }

  /**
   * Create a new LRUCache with the specified options
   * @param options Configuration options
   */
  constructor(options: LRUCacheOptions<V>) {
    this.maxItems = options.maxItems;

    // Use provided maxMemoryBytes or default to half of heap
    this.maxMemoryBytes =
      options.maxMemoryBytes !== undefined
        ? options.maxMemoryBytes
        : LRUCache.getDefaultMemoryLimit();

    this.sizeCalculator = options.sizeCalculator;

    // Validate options
    if (this.maxItems !== undefined && this.maxItems <= 0) {
      throw new Error('Maximum items must be a positive number');
    }

    if (this.maxMemoryBytes <= 0) {
      throw new Error('Maximum memory must be a positive number');
    }

    this.cache = new Map<K, ListNode<[K, V]>>();
    this.list = new DoublyLinkedList<[K, V]>();
  }

  /**
   * Get the current size of the cache (number of items)
   */
  get size(): number {
    return this.cache.size;
  }

  /**
   * Get the current memory usage of the cache in bytes
   */
  get memoryUsage(): number {
    return this.currentMemoryUsage;
  }

  /**
   * Check if the cache is empty
   */
  isEmpty(): boolean {
    return this.cache.size === 0;
  }

  /**
   * Check if the cache contains a key
   * @param key The key to check
   */
  has(key: K): boolean {
    return this.cache.has(key);
  }

  /**
   * Get a value from the cache
   * @param key The key to retrieve
   * @returns The value or undefined if not found
   */
  get(key: K): V | undefined {
    const node = this.cache.get(key);

    if (!node) {
      return undefined;
    }

    // Move to front (most recently used)
    this.list.moveToFront(node);

    return node.value[1];
  }

  /**
   * Calculate the size of a value in bytes
   */
  private calculateSize(value: V): number {
    if (this.sizeCalculator) {
      return this.sizeCalculator(value);
    }

    if (value === null || value === undefined) return 0;
    if (typeof value === 'boolean') return 4;
    if (typeof value === 'number') return 8;
    if (typeof value === 'string') return value.length * 2;
    if (value instanceof Date) return 8;
    if (Array.isArray(value)) return 40 + value.length * 8;

    if (typeof value === 'object') {
      try {
        return Buffer.byteLength(JSON.stringify(value), 'utf8');
      } catch {
        return 1024;
      }
    }

    return 100;
  }

  /**
   * Evict items until we're under the memory and item limits
   */
  private evictIfNeeded(requiredSpace: number = 0): void {
    // Check if we need to evict based on item count
    const needToEvictItems = this.maxItems !== undefined && this.cache.size >= this.maxItems;

    // Check if we need to evict based on memory usage
    const needToEvictMemory = this.currentMemoryUsage + requiredSpace > this.maxMemoryBytes;

    while ((needToEvictItems || needToEvictMemory) && !this.isEmpty()) {
      const lastNode = this.list.getLast();
      if (!lastNode) break;

      const [oldKey, oldValue] = lastNode.value;
      this.cache.delete(oldKey);
      this.list.remove(lastNode);

      this.currentMemoryUsage -= this.calculateSize(oldValue);

      // Check if we can stop evicting
      const underItemLimit = !this.maxItems || this.cache.size < this.maxItems;
      const underMemoryLimit = this.currentMemoryUsage + requiredSpace <= this.maxMemoryBytes;

      if ((underItemLimit && !needToEvictMemory) || (underMemoryLimit && !needToEvictItems)) {
        break;
      }
    }
  }

  /**
   * Set a value in the cache
   */
  set(key: K, value: V): this {
    const valueSize = this.calculateSize(value);

    // Update existing item
    if (this.cache.has(key)) {
      const node = this.cache.get(key)!;
      const oldValue = node.value[1];

      this.currentMemoryUsage -= this.calculateSize(oldValue);
      this.currentMemoryUsage += valueSize;

      node.value = [key, value];
      this.list.moveToFront(node);
      return this;
    }

    // Skip if item is too large
    if (valueSize > this.maxMemoryBytes) {
      return this;
    }

    // Make room for new item
    this.evictIfNeeded(valueSize);

    // Add new item
    const newNode = this.list.addFront([key, value]);
    this.cache.set(key, newNode);

    this.currentMemoryUsage += valueSize;

    return this;
  }

  /**
   * Remove an item from the cache
   * @param key The key to remove
   * @returns True if the item was removed, false if it didn't exist
   */
  delete(key: K): boolean {
    const node = this.cache.get(key);

    if (!node) {
      return false;
    }

    // Update memory usage
    this.currentMemoryUsage -= this.calculateSize(node.value[1]);

    this.list.remove(node);
    return this.cache.delete(key);
  }

  /**
   * Clear all items from the cache
   */
  clear(): void {
    this.cache.clear();
    // Create a new list instead of trying to clear the existing one
    this.list = new DoublyLinkedList<[K, V]>();
    // Reset memory usage
    this.currentMemoryUsage = 0;
  }
}
