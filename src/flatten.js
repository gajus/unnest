// @flow

// eslint-disable-next-line import/no-namespace
import * as wild from 'dot-wild';

// eslint-disable-next-line flowtype/no-weak-types
type InputType = Object;

const getDeepestValuePointerKey = (flatInput: InputType): string => {
  const keys = Object.keys(flatInput);

  let deepestValuePointerKey;
  let deepestValuePointerDepth = 0;

  for (const key of keys) {
    const path = wild.tokenize(key);
    const depth = path.length;

    if (depth > deepestValuePointerDepth) {
      deepestValuePointerDepth = depth;
      deepestValuePointerKey = key;
    }
  }

  if (!deepestValuePointerKey) {
    throw new Error('Unexpected state.');
  }

  return deepestValuePointerKey;
};

const isDotKeyArray = (key: string): boolean => {
  return /\.\d+\./.test(key);
};

const flatten = (input: InputType) => {
  const flatInput = wild.flatten(input);

  const keys = Object.keys(flatInput);

  for (const key of keys) {
    const path = wild.tokenize(key);

    const valuePointers = path.filter((crumb) => {
      return crumb.startsWith('@');
    });

    if (valuePointers.length === 0) {
      throw new Error('Input property must have a value pointer.');
    }

    if (valuePointers.length > 1) {
      throw new Error('Input property cannot have multiple value pointers.');
    }
  }

  if (Object.keys(flatInput).length === 0) {
    return [];
  }

  const deepestValuePointerKey = getDeepestValuePointerKey(flatInput);

  if (isDotKeyArray(deepestValuePointerKey)) {
    if (deepestValuePointerKey.startsWith('@')) {
      return input;
    }

    const tokens = deepestValuePointerKey.split('.0.');

    if (tokens.length === 0) {
      return [];
    }

    const first = tokens[0];

    const descendents = wild.get(input, first + '.*');

    const results = [];

    for (const descendent of descendents) {
      const result = flatten({
        ...wild.remove(input, first),
        ...descendent
      });

      if (Array.isArray(result)) {
        results.push(...result);
      } else {
        results.push(result);
      }
    }

    return results;
  } else {
    return input;
  }
};

export default flatten;
