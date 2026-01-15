import { describe, it, expect } from "@jest/globals";
import { LRUCache, LRUCacheOptions } from "../src/lru-cache";

describe("LRUCache", () => {
  describe("initialization", () => {
    it("should initialize with the correct max items", () => {
      const cache = new LRUCache<string, number>({ maxItems: 3 });
      expect(cache.size).toBe(0);
      expect(cache.isEmpty()).toBe(true);
      expect(cache.memoryUsage).toBe(0);
    });

    it("should initialize with options object", () => {
      const options: LRUCacheOptions<number> = { maxItems: 5 };
      const cache = new LRUCache<string, number>(options);
      expect(cache.size).toBe(0);
      expect(cache.isEmpty()).toBe(true);
    });

    it("should initialize with memory limit", () => {
      const options: LRUCacheOptions<number> = { maxMemory: 1000 };
      const cache = new LRUCache<string, number>(options);
      expect(cache.size).toBe(0);
      expect(cache.memoryUsage).toBe(0);
    });

    it("should initialize with both item and memory limits", () => {
      const options: LRUCacheOptions<number> = { maxItems: 5, maxMemory: 1000 };
      const cache = new LRUCache<string, number>(options);
      expect(cache.size).toBe(0);
      expect(cache.memoryUsage).toBe(0);
    });

    it("should throw an error when initialized with invalid max items", () => {
      expect(() => new LRUCache<string, number>({ maxItems: 0 })).toThrow();
      expect(() => new LRUCache<string, number>({ maxItems: -1 })).toThrow();
    });

    it("should throw an error when initialized with invalid max memory", () => {
      expect(() => new LRUCache<string, number>({ maxMemory: 0 })).toThrow();
      expect(() => new LRUCache<string, number>({ maxMemory: -1 })).toThrow();
    });

    it("should throw an error when initialized without any limits", () => {
      expect(
        () => new LRUCache<string, number>({} as LRUCacheOptions<number>)
      ).toThrow();
    });
  });

  describe("set and get operations", () => {
    it("should store and retrieve values", () => {
      const cache = new LRUCache<string, number>({ maxItems: 3 });

      cache.set("a", 1);
      cache.set("b", 2);
      cache.set("c", 3);

      expect(cache.size).toBe(3);
      expect(cache.get("a")).toBe(1);
      expect(cache.get("b")).toBe(2);
      expect(cache.get("c")).toBe(3);
    });

    it("should return undefined for non-existent keys", () => {
      const cache = new LRUCache<string, number>({ maxItems: 3 });
      expect(cache.get("a")).toBeUndefined();
    });

    it("should update existing keys", () => {
      const cache = new LRUCache<string, number>({ maxItems: 3 });

      cache.set("a", 1);
      cache.set("a", 10);

      expect(cache.size).toBe(1);
      expect(cache.get("a")).toBe(10);
    });
  });

  describe("LRU eviction policy with max items", () => {
    it("should evict the least recently used item when capacity is exceeded", () => {
      const cache = new LRUCache<string, number>({ maxItems: 3 });

      cache.set("a", 1);
      cache.set("b", 2);
      cache.set("c", 3);

      // 'a' is now the least recently used

      // Adding a new item should evict 'a'
      cache.set("d", 4);

      expect(cache.size).toBe(3);
      expect(cache.has("a")).toBe(false);
      expect(cache.get("a")).toBeUndefined();
      expect(cache.has("b")).toBe(true);
      expect(cache.has("c")).toBe(true);
      expect(cache.has("d")).toBe(true);
    });

    it("should update access order when getting items", () => {
      const cache = new LRUCache<string, number>({ maxItems: 3 });

      cache.set("a", 1);
      cache.set("b", 2);
      cache.set("c", 3);

      // Access 'a' to make it the most recently used
      cache.get("a");

      // Now 'b' is the least recently used, adding a new item should evict 'b'
      cache.set("d", 4);

      expect(cache.size).toBe(3);
      expect(cache.has("a")).toBe(true);
      expect(cache.has("b")).toBe(false);
      expect(cache.has("c")).toBe(true);
      expect(cache.has("d")).toBe(true);
    });

    it("should update access order when setting existing items", () => {
      const cache = new LRUCache<string, number>({ maxItems: 3 });

      cache.set("a", 1);
      cache.set("b", 2);
      cache.set("c", 3);

      // Update 'a' to make it the most recently used
      cache.set("a", 10);

      // Now 'b' is the least recently used, adding a new item should evict 'b'
      cache.set("d", 4);

      expect(cache.size).toBe(3);
      expect(cache.has("a")).toBe(true);
      expect(cache.has("b")).toBe(false);
      expect(cache.has("c")).toBe(true);
      expect(cache.has("d")).toBe(true);
    });
  });

  describe("delete operation", () => {
    it("should delete existing items", () => {
      const cache = new LRUCache<string, number>({ maxItems: 3 });

      cache.set("a", 1);
      cache.set("b", 2);

      expect(cache.delete("a")).toBe(true);
      expect(cache.size).toBe(1);
      expect(cache.has("a")).toBe(false);
      expect(cache.has("b")).toBe(true);
    });

    it("should return false when deleting non-existent items", () => {
      const cache = new LRUCache<string, number>({ maxItems: 3 });

      cache.set("a", 1);

      expect(cache.delete("b")).toBe(false);
      expect(cache.size).toBe(1);
    });
  });

  describe("clear operation", () => {
    it("should remove all items from the cache", () => {
      const cache = new LRUCache<string, number>({ maxItems: 3 });

      cache.set("a", 1);
      cache.set("b", 2);
      cache.set("c", 3);

      cache.clear();

      expect(cache.size).toBe(0);
      expect(cache.isEmpty()).toBe(true);
      expect(cache.has("a")).toBe(false);
      expect(cache.has("b")).toBe(false);
      expect(cache.has("c")).toBe(false);
    });
  });

  describe("Memory-based eviction policy", () => {
    it("should track memory usage correctly", () => {
      const cache = new LRUCache<string, string>({ maxMemory: 100 });

      cache.set("a", "small"); // ~10 bytes
      expect(cache.memoryUsage).toBeGreaterThan(0);
      const initialUsage = cache.memoryUsage;

      cache.set("b", "larger value here"); // ~34 bytes
      expect(cache.memoryUsage).toBeGreaterThan(initialUsage);
    });

    it("should evict items when memory limit is exceeded", () => {
      // Create a cache with a small memory limit and a custom size calculator
      // to make the test more predictable
      const cache = new LRUCache<string, string>({
        maxMemory: 20,
        sizeCalculator: (value) => value.length,
      });

      // Add first item (5 bytes)
      cache.set("a", "small");
      expect(cache.size).toBe(1);
      expect(cache.memoryUsage).toBe(5);

      // Add second item (6 bytes) - total now 11 bytes
      cache.set("b", "medium");
      expect(cache.size).toBe(2);
      expect(cache.memoryUsage).toBe(11);

      // Access 'a' to make 'b' the least recently used
      cache.get("a");

      // Add third item (12 bytes) - should evict 'b' to stay under memory limit
      cache.set("c", "large_value");

      // Verify 'b' was evicted but 'a' and 'c' remain
      expect(cache.has("a")).toBe(true);
      expect(cache.has("b")).toBe(false);
      expect(cache.has("c")).toBe(true);
      expect(cache.size).toBe(2);
      expect(cache.memoryUsage).toBe(16); // 5 + 11 = 16
    });

    it("should not add items that exceed the memory limit", () => {
      const cache = new LRUCache<string, string>({ maxMemory: 20 });

      // This value is too large to fit in the cache
      cache.set(
        "a",
        "this is a very large value that exceeds the memory limit"
      );

      expect(cache.size).toBe(0);
      expect(cache.has("a")).toBe(false);
    });

    it("should update memory usage when deleting items", () => {
      const cache = new LRUCache<string, string>({ maxMemory: 100 });

      cache.set("a", "value1");
      cache.set("b", "value2");

      const usageBeforeDelete = cache.memoryUsage;
      cache.delete("a");

      expect(cache.memoryUsage).toBeLessThan(usageBeforeDelete);
    });

    it("should reset memory usage when clearing the cache", () => {
      const cache = new LRUCache<string, string>({ maxMemory: 100 });

      cache.set("a", "value1");
      cache.set("b", "value2");

      expect(cache.memoryUsage).toBeGreaterThan(0);

      cache.clear();

      expect(cache.memoryUsage).toBe(0);
    });
  });

  describe("Combined item and memory limits", () => {
    it("should respect both item and memory limits", () => {
      const cache = new LRUCache<string, string>({
        maxItems: 5,
        maxMemory: 50,
      });

      // Add items until we hit the memory limit (before item limit)
      cache.set("a", "small");
      cache.set("b", "medium sized value");
      cache.set("c", "another value");

      // We should have evicted at least one item due to memory constraints
      expect(cache.size).toBeLessThan(3);

      // Clear and test item limit
      cache.clear();

      // Add small items to hit item limit
      cache.set("a", "a");
      cache.set("b", "b");
      cache.set("c", "c");
      cache.set("d", "d");
      cache.set("e", "e");
      cache.set("f", "f"); // This should evict 'a'

      expect(cache.size).toBe(5);
      expect(cache.has("a")).toBe(false);
      expect(cache.has("f")).toBe(true);
    });

    it("should use custom size calculator if provided", () => {
      // Custom size calculator that counts each character as 1 byte
      const sizeCalculator = (value: string) => value.length;

      const cache = new LRUCache<string, string>({
        maxMemory: 10,
        sizeCalculator,
      });

      cache.set("a", "12345"); // 5 bytes
      expect(cache.memoryUsage).toBe(5);

      cache.set("b", "123456"); // 6 bytes, should evict 'a'

      expect(cache.has("a")).toBe(false);
      expect(cache.has("b")).toBe(true);
      expect(cache.memoryUsage).toBe(6);
    });
  });

  describe("complex operations", () => {
    it("should handle a sequence of operations correctly", () => {
      const cache = new LRUCache<string, number>({ maxItems: 3 });

      cache.set("a", 1);
      cache.set("b", 2);
      cache.set("c", 3);

      expect(cache.get("b")).toBe(2); // b is now most recently used
      expect(cache.get("a")).toBe(1); // a is now most recently used

      cache.set("d", 4); // should evict c

      expect(cache.has("c")).toBe(false);
      expect(cache.has("d")).toBe(true);

      cache.set("b", 20); // update b, now most recently used

      cache.set("e", 5); // should evict a

      expect(cache.has("a")).toBe(false);
      expect(cache.has("b")).toBe(true);
      expect(cache.has("d")).toBe(true);
      expect(cache.has("e")).toBe(true);

      expect(cache.get("b")).toBe(20);
      expect(cache.get("d")).toBe(4);
      expect(cache.get("e")).toBe(5);
    });
  });
});
