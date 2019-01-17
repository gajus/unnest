// @flow

/* eslint-disable flowtype/no-weak-types */

type PointerType = {|
  +pointer: string,
  +map: (member: Object, children: $ReadOnlyArray<Object> | null) => Object
|};

export type UnnestUserConfigurationType = {|
  +hierarchy: $ReadOnlyArray<PointerType>
|};
