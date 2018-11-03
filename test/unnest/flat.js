// @flow

import test from 'ava';
import unnest from '../../src/unnest';

test('maps a single input', (t) => {
  const input = {
    '@date': 'foo',
    '@time': 'bar'
  };

  const template = {
    date: '@date',
    time: '@time'
  };

  const expected = {
    date: 'foo',
    time: 'bar'
  };

  t.deepEqual(unnest(input, template), expected);
});

test('unnests an array value (depth 1)', (t) => {
  const input = {
    '@date': 'foo',
    descendents: [
      {
        '@time': 'bar0'
      },
      {
        '@time': 'bar1'
      }
    ]
  };

  const template = {
    date: '@date',
    time: '@time'
  };

  const expected = [
    {
      date: 'foo',
      time: 'bar0'
    },
    {
      date: 'foo',
      time: 'bar1'
    }
  ];

  t.deepEqual(unnest(input, template), expected);
});

test('unnests an array value (depth 2)', (t) => {
  const input = {
    '@location': 'foo',
    children: [
      {
        '@date': 'bar0',
        children: [
          {
            '@time': 'baz0'
          },
          {
            '@time': 'baz1'
          }
        ]
      },
      {
        '@date': 'bar1',
        children: [
          {
            '@time': 'baz2'
          },
          {
            '@time': 'baz3'
          }
        ]
      }
    ]
  };

  const template = {
    date: '@date',
    location: '@location',
    time: '@time'
  };

  const expected = [
    {
      date: 'bar0',
      location: 'foo',
      time: 'baz0'
    },
    {
      date: 'bar0',
      location: 'foo',
      time: 'baz1'
    },
    {
      date: 'bar1',
      location: 'foo',
      time: 'baz2'
    },
    {
      date: 'bar1',
      location: 'foo',
      time: 'baz3'
    }
  ];

  t.deepEqual(unnest(input, template), expected);
});
