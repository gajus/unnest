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
    foo: {
      time: '@time'
    }
  };

  const expected = {
    date: 'foo',
    foo: {
      time: 'bar'
    }
  };

  t.deepEqual(unnest(input, template), expected);
});
