import { describe, expect, it } from '@jest/globals';
import { LRUCache } from '../src';

describe('LRUCache', () => {
  it('should create a new LRUCache instance', () => {
    const cache = new LRUCache<string, number>({ maxItems: 3 });
    expect(cache).toBeInstanceOf(LRUCache);
  });
});
