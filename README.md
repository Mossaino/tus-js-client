# tus-js-client

This is a replacement package of the official [tus-js-client](https://github.com/tus/tus-js-client).

This version uses `fetch` instead of XHR. 

## Current state

It is NOT a drop-in replacement - not everything is supported, nor is it well-tested.

- [x] Optimistic upload: full internet access required
- [ ] Delayed start: initiating offline, retrying to get internet access
- [ ] Robust upload: retry chunks as required, resetting retry-counter on successful connection

## Installation

1. Install the package
```shell script
npm i github:Mossaino/tus-js-client#master
```

2. [Optional] Make `@uppy` use the package. For example, using rollup:

```js
import alias from '@rollup/plugin-alias'

export default [{
  plugins: [
    alias({
      entries: [
        { find: 'tus-js-client', replacement: path.join(path.resolve('node_modules'), 'tus-js-client-fetch') }
      ]
    }),
  ]
}
```