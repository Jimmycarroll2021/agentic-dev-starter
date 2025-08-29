#!/usr/bin/env node

/**
 * Basic smoke test for the example webapp.
 * This demonstrates the testing approach that agents should follow.
 */

function test(name, fn) {
  try {
    fn();
    console.log(`✓ ${name}`);
  } catch (error) {
    console.error(`✗ ${name}: ${error.message}`);
    process.exit(1);
  }
}

function assertEquals(actual, expected, message = '') {
  if (actual !== expected) {
    throw new Error(`Expected ${expected}, got ${actual}. ${message}`);
  }
}

// Example tests
test('Basic math operations', () => {
  assertEquals(2 + 2, 4, 'Addition should work');
  assertEquals(5 * 3, 15, 'Multiplication should work');
});

test('String operations', () => {
  assertEquals('hello'.toUpperCase(), 'HELLO', 'String transformation should work');
});

console.log('\n🎉 All smoke tests passed!');