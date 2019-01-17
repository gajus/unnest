// @flow

/* eslint-disable flowtype/no-weak-types */

// eslint-disable-next-line import/no-namespace
import * as wild from 'dot-wild';

export default (subject: Object): Object => {
  return wild.expand(subject);
};
