# Tempo ID

[![pub package](https://img.shields.io/npm/v/tempoid.svg)](https://www.npmjs.com/package/tempoid)
![ci](https://github.com/temporal-id/tempoid-js/actions/workflows/ci.yml/badge.svg)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

IDs with temporal ordering and short length.

A library to generate URL-friendly, unique, and short IDs that are sortable by time. Inspired by nanoid and UUIDv7.

See [tempoid.dev](https://tempoid.dev) for more information.

## Motivation

- **URL-friendly**: The IDs are URL-friendly and can be used in web applications.
- **Unique**: The IDs are practically unique and can be used in distributed systems.
- **Short**: The IDs are shorter than UUIDs because they are encoded with a larger alphabet.
- **Sortable**: The IDs are sortable by time because a timestamp is encoded in the beginning of the ID.

Example ID:

```text
0uoVxkjTFsrRX30O5B9fX
<------><----------->
  Time     Random
```

## Collisions

- **Same millisecond**: There can be only a collision if two IDs are generated in the same millisecond.
- **Low probability**: Even if two IDs are generated in the same millisecond, the probability of a collision is very low.

The 13 random characters exceed the randomness of UUIDv7 (≈10^23 vs ≈10^22).

## Getting Started

Add the package to your project:

```bash
npm install tempoid
```

## Usage

```javascript
import { tempoId, Alphabet } from 'tempoid';

const id = tempoId();
console.log('Generated TempoId:', id);
```
