// @flow

import test from 'ava';
import flatten from '../src/flatten';

test('creates a cartesian product of pointer values', (t) => {
  const input = {
    '@date': 'foo',
    '@time': 'bar'
  };

  const expected = input;

  t.deepEqual(flatten(input), expected);
});

test('creates a cartesian product of pointer values (depth 1)', (t) => {
  const input = {
    '@date': 'foo',
    children: [
      {
        '@time': 'bar0'
      },
      {
        '@time': 'bar1'
      }
    ]
  };


  const expected = [
    {
      '@date': 'foo',
      '@time': 'bar0'
    },
    {
      '@date': 'foo',
      '@time': 'bar1'
    }
  ];

  t.deepEqual(flatten(input), expected);
});

test('creates a cartesian product of pointer values (depth 2)', (t) => {
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

  const expected = [
    {
      '@date': 'bar0',
      '@location': 'foo',
      '@time': 'baz0'
    },
    {
      '@date': 'bar0',
      '@location': 'foo',
      '@time': 'baz1'
    },
    {
      '@date': 'bar1',
      '@location': 'foo',
      '@time': 'baz2'
    },
    {
      '@date': 'bar1',
      '@location': 'foo',
      '@time': 'baz3'
    }
  ];

  t.deepEqual(flatten(input), expected);
});

test('does not unnest non-pointer arrays', (t) => {
  const input = {
    '@location': 'foo',
    children: [
      {
        '@date': [
          {
            'time': 'baz0'
          },
          {
            'time': 'baz1'
          }
        ]
      },
      {
        '@date': [
          {
            'time': 'baz2'
          },
          {
            'time': 'baz3'
          }
        ]
      }
    ]
  };

  const expected = [
    {
      '@date': [
        {
          'time': 'baz0'
        },
        {
          'time': 'baz1'
        }
      ],
      '@location': 'foo'
    },
    {
      '@date': [
        {
          'time': 'baz2'
        },
        {
          'time': 'baz3'
        }
      ],
      '@location': 'foo'
    }
  ];

  t.deepEqual(flatten(input), expected);
});

test('throws an error if input property does not have a value pointer', (t) => {
  const input = {
    '@date': 'foo',
    '@time': 'bar',
    baz: 'qux'
  };

  t.throws(() => {
    flatten(input);
  }, 'Input property must have a value pointer.');
});

test('throws an error if input property has multiple value pointers', (t) => {
  const input = {
    '@date': {
      '@time': 'foo'
    }
  };

  t.throws(() => {
    flatten(input);
  }, 'Input property cannot have multiple value pointers.');
});
