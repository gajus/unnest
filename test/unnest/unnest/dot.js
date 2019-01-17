// @flow

import test from 'ava';
import unnest from '../../../src/utilities/unnest';

test('exctacts heighest hierarchy member', (t) => {
  const actual = unnest(
    [
      {
        '@venue.name': 'foo',
        '@venue.url': 'foo'
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
      result: {
        name: 'foo',
        url: 'foo'
      }
    }
  ]);
});

test('creates descendents', (t) => {
  const actual = unnest(
    [
      {
        '@venue.name': 'foo',
        '@venue.url': 'foo',
        movies: [
          {
            '@movie.name': 'bar',
            '@movie.url': 'bar'
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
            result: {
              name: 'bar',
              url: 'bar'
            }
          }
        ]
      },
      result: {
        name: 'foo',
        url: 'foo'
      }
    }
  ]);
});
