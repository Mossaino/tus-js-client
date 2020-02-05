# tus-js-client

This is a replacement package of the official [tus-js-client](https://github.com/tus/tus-js-client).

This version uses `fetch` instead of XHR. 

## Current state

It is NOT a drop-in replacement - not everything is supported, nor is it well-tested.

- [x] Optimistic upload: full internet access required
- [ ] Delayed start: initiating offline, retrying to get internet access
- [ ] Robust upload: retry chunks as required, resetting retry-counter on successful connection
