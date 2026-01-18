# GossipStore

![Tests](https://github.com/sivakumar00/gossipstore/actions/workflows/tests.yml/badge.svg)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node Version](https://img.shields.io/badge/node-24.x-brightgreen.svg)](https://nodejs.org/)
[![codecov](https://codecov.io/gh/sivakumar00/gossipstore/branch/main/graph/badge.svg)](https://codecov.io/gh/sivakumar00/gossipstore)

A distributed key-value store using Gossip Protocols and Vector Clocks for eventual consistency.

> **⚠️ DEVELOPMENT STATUS**: This project is currently in early development stage. It is not feature-complete and NOT READY FOR PRODUCTION USE. APIs may change without notice.

## Features

- **Distributed Architecture**: Resilient to node failures with no single point of failure
- **Eventual Consistency**: Using Vector Clocks for conflict resolution
- **Efficient Memory Management**: LRU Cache with configurable memory limits
- **High Performance**: Optimized data structures for read/write operations

## Installation

```bash
# Clone the repository
git clone https://github.com/Sivakumara/gossipstore.git
cd gossipstore

# Install dependencies
pnpm install

# Build all packages
pnpm build
```

## Packages

This monorepo includes the following packages:

- `@gossipstore/core`: Core data structures and algorithms including LRU Cache implementation
- `@repo/eslint-config`: ESLint configurations for code quality
- `@repo/typescript-config`: TypeScript configurations used throughout the monorepo

Each package is written in 100% [TypeScript](https://www.typescriptlang.org/).

### Utilities

This Turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting

## Development

### Build

```bash
# Build all packages
pnpm build

# Build a specific package
pnpm build --filter=@gossipstore/core
```

### Test

```bash
# Run all tests
pnpm test

# Run tests for a specific package
pnpm test --filter=@gossipstore/core
```

### Lint & Format

```bash
# Lint all code
pnpm lint

# Format all code
pnpm format
```

## Usage

```typescript
import { LRUCache } from '@gossipstore/core';

// Create a new LRU cache with a maximum of 100 items
// and a memory limit of 10MB
const cache = new LRUCache<string, any>({
  maxItems: 100,
  maxMemoryBytes: 10 * 1024 * 1024, // 10MB
});

// Set a value
cache.set('key1', { name: 'John', age: 30 });

// Get a value
const value = cache.get('key1');
console.log(value); // { name: 'John', age: 30 }

// Check if a key exists
const exists = cache.has('key1'); // true

// Delete a key
cache.delete('key1');

// Clear the cache
cache.clear();
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## References

- [How to Design a Distributed Key-Value Store](https://nikasakana.medium.com/how-to-design-a-distributed-key-value-store-cfd83248541b)
- [Gossip Protocol](https://en.wikipedia.org/wiki/Gossip_protocol)
- [Vector Clocks](https://en.wikipedia.org/wiki/Vector_clock)
