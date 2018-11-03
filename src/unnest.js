// @flow

import flatten from './flatten';

const map = (haystack, input, template) => {
  const result = {};

  const keys = Object.keys(template);

  for (const key of keys) {
    const valuePointer = template[key];

    if (typeof valuePointer === 'string') {
      result[key] = haystack[valuePointer];
    } else {
      result[key] = unnest(input, template[key]);
    }
  }

  return result;
}

const unnest = (input: Object, template: Object): $ReadOnlyArray<Object> | Object => {
  const flatInput = flatten(input);

  if (Array.isArray(flatInput)) {
    return flatInput.map((haystack) => {
      return map(haystack, input, template);
    });
  }

  return map(flatInput, input, template);
};

export default unnest;
