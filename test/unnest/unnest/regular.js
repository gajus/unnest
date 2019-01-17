// @flow

import test from 'ava';
import unnest from '../../../src/utilities/unnest';

test('exctacts heighest hierarchy member', (t) => {
  const actual = unnest(
    [
      {
        '@venue': 'foo'
      }
    ],
    {
      hierarchy: [
        {
          map: (result) => {
            return {
              guide: {},
              result
            };
          },
          pointer: 'venue'
        }
      ]
    }
  );

  t.deepEqual(actual, [
    {
      guide: {},
      result: 'foo'
    }
  ]);
});

test('creates descendents', (t) => {
  const actual = unnest(
    [
      {
        '@venue': 'foo0',
        movies: [
          {
            '@movie': 'bar0'
          },
          {
            '@movie': 'bar1'
          }
        ]
      },
      {
        '@venue': 'foo0',
        movies: [
          {
            '@movie': 'bar0'
          },
          {
            '@movie': 'bar1'
          }
        ]
      }
    ],
    {
      hierarchy: [
        {
          map: (result, descendents) => {
            return {
              guide: {
                movies: descendents
              },
              result
            };
          },
          pointer: 'venue'
        },
        {
          map: (result) => {
            return {
              guide: {},
              result
            };
          },
          pointer: 'movie'
        }
      ]
    }
  );

  t.deepEqual(actual, [
    {
      guide: {
        movies: [
          {
            guide: {},
            result: 'bar'
          }
        ]
      },
      result: 'foo'
    }
  ]);
});
