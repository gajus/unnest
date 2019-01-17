// @flow

/* eslint-disable flowtype/no-weak-types */

import {
  groupBy,
  pickBy,
  mapKeys
} from 'lodash';
import type {
  UnnestUserConfigurationType
} from '../types';
import expand from './expand';
import flatten from './flatten';

type TransformType = (input: Object, collection: $ReadOnlyArray<Object>) => Object;

const createObjectUsingMatchingProperties = (subject: Object, rule: RegExp): Object => {
  return pickBy(subject, (value, key) => {
    return rule.test(key);
  });
};

const groupByConstraintKeyPrefix = (dataset: $ReadOnlyArray<Object>, rule: RegExp): $ReadOnlyArray<Object> => {
  const groups = groupBy(dataset, (datum) => {
    const constraint = createObjectUsingMatchingProperties(datum, rule);

    return Object.keys(constraint).length ? JSON.stringify(constraint) : '-1';
  });

  // eslint-disable-next-line fp/no-delete
  delete groups['-1'];

  return Object.values(groups);
};

const createDataset = (dataset: $ReadOnlyArray<Object>, rule: RegExp, transform: TransformType) => {
  const collections = groupByConstraintKeyPrefix(dataset, rule);

  const results = [];

  for (const collection of collections) {
    if (!collection.length) {
      throw new Error('Unexpected state.');
    }

    const constraint = createObjectUsingMatchingProperties(collection[0], rule);

    const datum = transform(constraint, collection);

    results.push(datum);
  }

  return results;
};

const mapDescendents = (payload, hierarchy) => {
  const hierarchyMemberIndex = hierarchy.findIndex((member) => {
    return Object.keys(payload[0]).join(',').includes('@' + member.pointer);
  });

  if (hierarchyMemberIndex === -1) {
    return [];
  }

  const hierarchyMember = hierarchy[hierarchyMemberIndex];

  const pointerRegex = new RegExp('^@' + hierarchyMember.pointer + '(?:\\.|$)');

  return createDataset(payload, pointerRegex, (constraint, children) => {
    const member = expand(
      mapKeys(
        pickBy(constraint, (value, key) => {
          return pointerRegex.test(key);
        }),
        (value, key) => {
          return key.slice(1);
        }
      )
    )[hierarchyMember.pointer];

    let descendents = [];

    if (children.length) {
      descendents = mapDescendents(children, hierarchy.slice(hierarchyMemberIndex + 1));
    }

    return hierarchyMember.map(member, descendents);
  });
};

export default (nodes: $ReadOnlyArray<Object>, configuration: UnnestUserConfigurationType): $ReadOnlyArray<Object> => {
  const hierarchy = configuration.hierarchy;

  const payload = flatten({
    payload: nodes
  });

  if (!Array.isArray(payload)) {
    throw new TypeError('Unexpected state.');
  }

  if (payload.length === 0) {
    return [];
  }

  return mapDescendents(payload, hierarchy);
};
