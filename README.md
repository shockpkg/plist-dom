# plist-dom

Package for parsing and encoding a plist document

[![npm](https://img.shields.io/npm/v/@shockpkg/plist-dom.svg)](https://npmjs.com/package/@shockpkg/plist-dom)
[![node](https://img.shields.io/node/v/@shockpkg/plist-dom.svg)](https://nodejs.org)

[![dependencies](https://david-dm.org/shockpkg/plist-dom.svg)](https://david-dm.org/shockpkg/plist-dom)
[![size](https://packagephobia.now.sh/badge?p=@shockpkg/plist-dom)](https://packagephobia.now.sh/result?p=@shockpkg/plist-dom)
[![downloads](https://img.shields.io/npm/dm/@shockpkg/plist-dom.svg)](https://npmcharts.com/compare/@shockpkg/plist-dom?minimal=true)

[![travis-ci](https://travis-ci.org/shockpkg/plist-dom.svg?branch=master)](https://travis-ci.org/shockpkg/plist-dom)


# Overview

Parses and encodes Plist XML documents between a DOM and XML data.


# Usage

## Basic Usage

```js
import {Plist} from '@shockpkg/plist-dom';

const plist = new Plist();
plist.fromXml(plistXml);
console.log(plist);
console.log(plist.toXml());
```


# Bugs

If you find a bug or have compatibility issues, please open a ticket under issues section for this repository.


# License

Copyright (c) 2019-2020 JrMasterModelBuilder

Licensed under the Mozilla Public License, v. 2.0.

If this license does not work for you, feel free to contact me.
