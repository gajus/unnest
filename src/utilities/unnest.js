// @flow

// eslint-disable-next-line import/no-namespace
import * as wild from 'dot-wild';

// eslint-disable-next-line flowtype/no-weak-types
const getDeepestValuePointerKey = (flatInput: Object): string => {
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

// eslint-disable-next-line flowtype/no-weak-types
const unnest = (tree: Object) => {
  const flatInput = wild.flatten(tree);

  console.log('flatInput', flatInput);

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
      return tree;
    }

    const tokens = deepestValuePointerKey.split(/\.\d+\./);

    if (tokens.length === 0) {
      return [];
    }

    const first = tokens[0];

    const descendents = wild.get(tree, first + '.*') || [];

    const results = [];

    for (const descendent of descendents) {
      const result = unnest({
        ...wild.remove(tree, first),
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
    return tree;
  }
};

export default unnest;
