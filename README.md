# Unnest

[![Travis build status](http://img.shields.io/travis/gajus/unnest/master.svg?style=flat-square)](https://travis-ci.org/gajus/unnest)
[![Coveralls](https://img.shields.io/coveralls/gajus/unnest.svg?style=flat-square)](https://coveralls.io/github/gajus/unnest)
[![NPM version](http://img.shields.io/npm/v/unnest.svg?style=flat-square)](https://www.npmjs.org/package/unnest)
[![Canonical Code Style](https://img.shields.io/badge/code%20style-canonical-blue.svg?style=flat-square)](https://github.com/gajus/canonical)
[![Twitter Follow](https://img.shields.io/twitter/follow/kuizinas.svg?style=social&label=Follow)](https://twitter.com/kuizinas)

Creates a cartesian product of all properties identified using value pointers.

## API

```js
/**
 * @param {Object} tree A hierarchical data structure.
 * @returns {Array} A cartesian product of all values identified using value-pointers in the input object.
 */
unnest(tree);

```

### Value-pointer

In the context of Unnest, value-pointer refers to an object property whose key begins with `@`, e.g.

```js
{
  '@foo': {
    name: 'bar'
  }
}

```

`@foo` is a value-pointer.

Data pointers are used to identify all members that are used to create the cartesian product.

## Use case

Unnest solves the problem of translating hierarchical dataset into a collection of atomic data records. This is a common requirement when extracting information from a hierarchical document (e.g. HTML) with intent to store it.

### Example

To illustrate an example use case, consider an HTML document that describes event locations, dates and times:

```html
<ul>
  <li class='location'>
    <h1>foo0</h1>

    <ol>
      <li class='date'>
        <h2>bar0</h2>

        <ol>
          <li class='time'>baz0</li>
          <li class='time'>baz1</li>
        </ol>
      </li>
      <li class='date'>
        <h2>bar2</h2>

        <ol>
          <li class='time'>baz2</li>
          <li class='time'>baz3</li>
        </ol>
      </li>
    </ol>
  </li>
<ul>

```

We want to extract location, date and time information into a collection of objects that each describe all attributes of the event, i.e. The desired result is a cartesian product of all 3 variables (location, date and time):

```json
[
  {
    "date": "bar0",
    "location": "foo",
    "time": "baz0"
  },
  {
    "date": "bar0",
    "location": "foo",
    "time": "baz1"
  },
  {
    "date": "bar1",
    "location": "foo",
    "time": "baz2"
  },
  {
    "date": "bar1",
    "location": "foo",
    "time": "baz3"
  }
]

```

We can extract the subject data from the document using [Surgeon](https://github.com/gajus/surgeon). Surgeon uses declarative instructions to extract information out of a HTML document, e.g.

```yaml
- sm .location
- '@location': so h1 | rdtc
  children:
    - sm .date
    - '@date': so h2 | rdtc
      children:
        - '@time': sm .time | rdtc

```

The result is a hierarchical object describing the relevant variables contained in the HTML document:

```json
[
  {
    "@location": "foo0",
    "children": [
      {
        "@date": "bar0",
        "children": [
          {
            "@time": "baz0"
          },
          {
            "@time": "baz1"
          }
        ]
      },
      {
        "@date": "bar1",
        "children": [
          {
            "@time": "baz2"
          },
          {
            "@time": "baz3"
          }
        ]
      }
    ]
  }
]

```

To get a cartesian product of all the variables, we need to iterate the tree data structure:

```js
const locations = input;

const result = {};

for (const locationDatum of locations) {
  for (const dateDatum of locationDatum.children) {
    for (const timeDatum of dateDatum.children) {
      result.push({
        date: dateDatum['@date'],
        location: locationDatum['@location']
        time: timeDatum['@time']
      });
    }
  }
}

```

Unnest replaces the last step:

```js
import unnest from 'unnest';

unnest(input);

// [
//   {
//     "date": "bar0",
//     "location": "foo",
//     "time": "baz0"
//   },
//   {
//     "date": "bar0",
//     "location": "foo",
//     "time": "baz1"
//   },
//   {
//     "date": "bar1",
//     "location": "foo",
//     "time": "baz2"
//   },
//   {
//     "date": "bar1",
//     "location": "foo",
//     "time": "baz3"
//   }
// ]

```
