# y-lwwmap #

a shared [CRDT](https://crdt.tech/) key-value map for [Yjs](https://github.com/yjs/yjs) using a "last-write-wins" ([LWW](https://crdt.tech/glossary)) algorithm for conflict resolution

> this work is in progress!

### How it works ###

### Where such an approach seems useful ###

When all sharing clients are connected and synchronization works as foreseen, `y-lwwmap` should behave like an ordinary [YKeyValue](https://github.com/yjs/y-utility#ykeyvalue) - taking care of clients with incorrect running clocks.

## Installation ##

`npm install y-lwwmap`

## Usage ##

`import { LWWMap } from 'y-lwwmap'`

## API ##

`LWWMap` tries to mimic the interface of [JavaScript Maps](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) as closely as possible.

In particular, LWWMaps may also be used within `for ... of` loops:

```
const sharedMap = new LWWMap()
for (const [Key,Value] of sharedMap) {
  ... 
}
```

The following differences are important:

* keys must be strings - keys of other types are not supported
* values must be of one of the following types
  * null
  * boolean
  * number
  * string
  * plain objects
  * Uint8Arrays or
  * arrays of the above
* external changes are reported through events (one per transaction) which are JavaScript [Maps]() with the following [key,value] pairs (the given key is that of a modified LWWMap entry)
  * `{ action:'add', newValue:... }`
  * `{ action:'update', oldValue:..., newValue:... }`
  * `{ action:'delete', oldValue:... }`

Deleting a non-existing entry is permitted, but does neither change the LWWMap nor does it emits an event.

### Constructor ###

* **`LWWMap<T extends null|boolean|number|string|object|Uint8Array|Array<T>> extends Observable<T> (sharedArray:Y.Array<{ key: string, val: T }>, RetentionPeriod:number = 30*24*60*60*1000)`** - 

### Properties ###

* **`size`** - returns the number of elements in this LWWMap

### Methods ###

* **`[Symbol.iterator]():IterableIterator<T>`** - works like `entries()` but allows this LWWMap to be used in a `for ... of` loop
* **`clear ():void`** - removes all elements from this LWWMap
* **`delete (Key:string):boolean`** - removes the element with the given `Key` from this LWWMap and returns `true` if that element existed before - or `false` otherwise
* **`entries ():IterableIterator<[string, T]>`** - returns a new map iterator object that contains the [key, value] pairs for each element of this LWWMap in arbitrary order
* **`forEach (Callback:(Value:T, Key:string, Map:LWWMap<T>) => , thisArg?:any)`** - executes a provided function once per each key/value pair
* **`get (Key:string):T | undefined`** - returns (a reference to) the element with the given `Key` in this LWWMap - or `undefined` if such an element does not exist
* **`has (Key:string):boolean`** - returns `true` if this LWWMap contains an element with the given `Key` - or `false` if not
* **`keys ():IterableIterator<string>`** - returns a new map iterator object that contains the keys for each element in this LWWMap
* **`set (Key:string, Value:T):void`** - adds or updates the element with the given `Key` in this LWWMap by setting the given `Value`
* **`values ():IterableIterator<T>`** - returns a new map iterator object that contains the values for each element in this LWWMap

## Synthetic Timestamps ##
 
## Build Instructions ##

You may easily build this package yourself.

Just install [NPM](https://docs.npmjs.com/) according to the instructions for your platform and follow these steps:

1. either clone this repository using [git](https://git-scm.com/) or [download a ZIP archive](https://github.com/rozek/y-lwwmap/archive/refs/heads/main.zip) with its contents to your disk and unpack it there 
2. open a shell and navigate to the root directory of this repository
3. run `npm install` in order to install the complete build environment
4. execute `npm run build` to create a new build

You may also look into the author's [build-configuration-study](https://github.com/rozek/build-configuration-study) for a general description of his build environment.

## License ##

[MIT License](LICENSE.md)
