// @flow

import test from 'ava';
import unnest from '../../src/utilities/unnest';

test('produces an empty array out of the empty object', (t) => {
  const input = {};

  const expected = [];

  t.deepEqual(unnest(input), expected);
});

test('creates a cartesian product of pointer values', (t) => {
  const input = {
    '@date': 'foo',
    '@time': 'bar'
  };

  const expected = input;

  t.deepEqual(unnest(input), expected);
});

test('creates a cartesian product of pointer values (dot-notation)', (t) => {
  const input = {
    '@date.bar': 'bar',
    '@date.foo': 'foo'
  };

  const expected = input;

  t.deepEqual(unnest(input), expected);
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

  t.deepEqual(unnest(input), expected);
});

test('creates a cartesian product of pointer values (depth 2)', (t) => {
  const input = {
    '@location': 'foo',
    children0: [
      {
        '@date': 'bar0',
        children1: [
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
        children1: [
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

  t.deepEqual(unnest(input), expected);
});

test('strips parent non-pointer values', (t) => {
  const input = {
    member: {
      '@date': 'foo',
      children: [
        {
          '@time': 'bar0'
        },
        {
          '@time': 'bar1'
        }
      ]
    }
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

  t.deepEqual(unnest(input), expected);
});

test('does not unnest non-pointer arrays', (t) => {
  const input = {
    '@location': 'foo',
    children: [
      {
        '@date': [
          {
            time: 'baz0'
          },
          {
            time: 'baz1'
          }
        ]
      },
      {
        '@date': [
          {
            time: 'baz2'
          },
          {
            time: 'baz3'
          }
        ]
      }
    ]
  };

  const expected = [
    {
      '@date': [
        {
          time: 'baz0'
        },
        {
          time: 'baz1'
        }
      ],
      '@location': 'foo'
    },
    {
      '@date': [
        {
          time: 'baz2'
        },
        {
          time: 'baz3'
        }
      ],
      '@location': 'foo'
    }
  ];

  t.deepEqual(unnest(input), expected);
});

test('throws an error if input is an array', (t) => {
  const input = [
    {
      '@date': 'foo',
      children: [
        {
          '@time': 'bar0'
        },
        {
          '@time': 'bar1'
        }
      ]
    }
  ];

  t.throws(() => {
    unnest(input);
  }, 'Input must be a plain object.');
});

test('throws an error if input property does not have a value pointer', (t) => {
  const input = {
    '@date': 'foo',
    '@time': 'bar',
    baz: 'qux'
  };

  t.throws(() => {
    unnest(input);
  }, 'Input property must have a value pointer.');
});

test('throws an error if input property has multiple value pointers', (t) => {
  const input = {
    '@date': {
      '@time': 'foo'
    }
  };

  t.throws(() => {
    unnest(input);
  }, 'Input property cannot have multiple value pointers.');
});

test('maps different value-pointers at the same depth', (t) => {
  const input = {
    '@a': 'foo',
    children0: [
      {
        '@b': 'bar0'
      },
      {
        '@c': 'bar1'
      }
    ]
  };

  const expected = [
    {
      '@a': 'foo',
      '@b': 'bar0'
    },
    {
      '@a': 'foo',
      '@c': 'bar1'
    }
  ];

  t.deepEqual(unnest(input), expected);
});

test('ignores empty objects', (t) => {
  const input = {
    '@a': 'foo',
    children0: [
      {},
      {
        '@b': 'bar0'
      },
      {
        '@c': 'bar1'
      }
    ]
  };

  const expected = [
    {
      '@a': 'foo',
      '@b': 'bar0'
    },
    {
      '@a': 'foo',
      '@c': 'bar1'
    }
  ];

  t.deepEqual(unnest(input), expected);
});
