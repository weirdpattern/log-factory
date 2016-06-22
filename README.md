# Log Factory

[![Build Status](https://travis-ci.org/weirdpattern/log-factory.svg?branch=master)](https://travis-ci.org/weirdpattern/log-factory)
[![Coverage Status](https://coveralls.io/repos/github/weirdpattern/log-factory/badge.svg?branch=master)](https://coveralls.io/github/weirdpattern/log-factory?branch=master)
[![Dependency Status](https://gemnasium.com/badges/github.com/weirdpattern/log-factory.svg)](https://gemnasium.com/github.com/weirdpattern/log-factory)
[![Semistandard Style](https://img.shields.io/badge/code%20style-semistandard-brightgreen.svg?style=flat)](https://github.com/Flet/semistandard)
[![Stage](https://img.shields.io/badge/stage-development-red.svg?style=flat)](#)

### Configuration
```json
{
  "logwiz": {
    "filters": {
      "debug": {
        "type": "level-filter",
        "levels": [ "info", "debug" ]
      }
    },
    "channels": {
      "console": {
        "type": "console-channel",
        "output": "stdout",
        "colorize": true,
        "filters": [ "debug" ]
      }
    },
    "loggers": {
      "debug": {
        "level": "all",
        "channels": [ "console", {
          "type": "file-channel",
          "file": "errors.log",
          "filters": [
            {
              "type": "level-range-filter",
              "min": "error",
              "max": "fatal"
            }
          ]
        } ]
      }
    }
  }
}
```