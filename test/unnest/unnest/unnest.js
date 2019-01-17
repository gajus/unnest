// @flow

import test from 'ava';
import unnest from '../../../src/utilities/unnest';

test('empty payload returns empty result', (t) => {
  const actual = unnest([], {
    hierarchy: []
  });

  t.deepEqual(actual, []);
});
