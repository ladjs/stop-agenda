# stop-agenda

[![Greenkeeper badge](https://badges.greenkeeper.io/ladjs/stop-agenda.svg)](https://greenkeeper.io/)

[![build status](https://img.shields.io/travis/ladjs/stop-agenda.svg)](https://travis-ci.org/ladjs/stop-agenda)
[![code coverage](https://img.shields.io/codecov/c/github/ladjs/stop-agenda.svg)](https://codecov.io/gh/ladjs/stop-agenda)
[![code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/sindresorhus/xo)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![made with lass](https://img.shields.io/badge/made_with-lass-95CC28.svg)](https://lass.js.org)
[![license](https://img.shields.io/github/license/ladjs/stop-agenda.svg)](<>)

> Gracefully stop [Agenda][] and cancel recurring jobs


## Table of Contents

* [Install](#install)
* [Usage](#usage)
* [Options](#options)
* [Contributors](#contributors)
* [License](#license)


## Install

[npm][]:

```sh
npm install stop-agenda
```

[yarn][]:

```sh
yarn add stop-agenda
```


## Usage

> With default options:

```js
const stopAgenda = require('stop-agenda');
const Agenda = require('agenda');

const agenda = new Agenda();

stopAgenda(agenda).then().catch(console.error);
```

> With advanced options including custom cancel query `cancelQuery` and check interval in milliseconds `checkIntervalMs`:

```js
const stopAgenda = require('stop-agenda');
const Agenda = require('agenda');

const agenda = new Agenda();

stopAgenda(agenda, {
  cancelQuery: {
    repeatInterval: {
      $exists: true,
      $ne: null
    }
  },
  checkIntervalMs: 300
}).then().catch(console.error);
```


## Options

> `stopAgenda` accepts two arguments `(agenda, config)` and returns a `Promise`:

* `agenda` (required) - a valid instance of [Agenda][]
* `config` (optional) - a configuration object which defaults to:

  ```js
  {
    cancelQuery: {
      repeatInterval: {
        $exists: true,
        $ne: null
      }
    },
    checkIntervalMs: 500
  }
  ```


## Contributors

| Name           | Website                    |
| -------------- | -------------------------- |
| **Nick Baugh** | <http://niftylettuce.com/> |


## License

[MIT](LICENSE) © [Nick Baugh](http://niftylettuce.com/)


## 

[npm]: https://www.npmjs.com/

[yarn]: https://yarnpkg.com/

[agenda]: https://github.com/agenda/agenda
