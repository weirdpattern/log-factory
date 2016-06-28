/**
 * @module log.utils
 * @author Patricio Trevino
 */

import os from 'os';
import path from 'path';

/*
 * Shorthand methods
 */
const slice = Array.prototype.slice;
const filter = Array.prototype.filter;
const toString = Object.prototype.toString;
const hasOwnProperty = Object.prototype.hasOwnProperty;

/**
 * @public
 * @enum {number}
 * @memberof log.utils
 * @since 1.0.0
 *
 * Extension points.
 * CONFIGURABLE (1)
 * ENUMERABLE (2)
 * WRITABLE (4)
 * GETTER (8)
 * SETTER (16)
 */
export const ExtensionPoints = {
  'CONFIGURABLE': 1,
  'ENUMERABLE': 2,
  'WRITABLE': 4,
  'GETTER': 8,
  'SETTER': 16
};

/**
 * @static
 * @public
 * @function
 * @memberof log.utils
 * @since 1.0.0
 *
 * Creates readonly/non-configurable properties in [object].
 *
 * @param {Object} object - the object to be extended.
 * @param {Object} properties - the properties to be added.
 * @param {int} [options] - the options to be used.
 * @returns {Object} the [object] with the new properties.
 */
export function extend (object, properties, options) {
  if (object == null || !Object.isExtensible(object)) {
    throw new TypeError('Argument "object" must be extensible');
  }

  if (!isPlainObject(properties)) {
    throw new TypeError('Argument "properties" must be a plain object');
  }

  let value;
  let accessor;
  let descriptor;

  Object.keys(properties).forEach((property) => {
    descriptor = {};
    accessor = false;
    value = properties[ property ];

    if (options != null) {
      descriptor.configurable = (options & ExtensionPoints.CONFIGURABLE) === ExtensionPoints.CONFIGURABLE;
      descriptor.enumerable = (options & ExtensionPoints.ENUMERABLE) === ExtensionPoints.ENUMERABLE;

      if ((options & ExtensionPoints.GETTER) === ExtensionPoints.GETTER && hasOwnProperty.call(value, 'get')) {
        accessor = true;
        descriptor.get = value.get;
      }

      if ((options & ExtensionPoints.SETTER) === ExtensionPoints.SETTER && hasOwnProperty.call(value, 'set')) {
        accessor = true;
        descriptor.set = value.set;
      }
    }

    if (!accessor) {
      descriptor.value = value;
      descriptor.writable = (options & ExtensionPoints.WRITABLE) === ExtensionPoints.WRITABLE;
    } else {
      if (hasOwnProperty.call(value, 'value')) {
        throw new TypeError('"value" cannot be specify along with accessors');
      }

      if (!hasOwnProperty.call(descriptor, 'get')) {
        throw new TypeError('"setter" accessor cannot be specify without a getter');
      }
    }

    Object.defineProperty(object, property, descriptor);
  });

  return object;
}

/**
 * @static
 * @public
 * @function
 * @memberof log.utils
 * @since 1.0.0
 *
 * Determines if [object] is a plain object.
 *
 * @param {*} object - the object to be validated.
 * @returns {boolean} `true` if the object is a plain object; `false` otherwise.
 */
export function isPlainObject (object) {
  if (object == null || toString.call(object) !== '[object Object]') {
    return false;
  }

  const proto = Object.getPrototypeOf(object);
  if (proto == null) {
    return true;
  }

  const ctr = hasOwnProperty.call(proto, 'constructor') && proto.constructor;
  return typeof ctr === 'function' && ctr instanceof ctr && toString.call(ctr) === toString.call(Object);
}

/**
 * @static
 * @public
 * @function
 * @memberof log.utils
 * @since 1.0.0
 *
 * Converts to camel case (camelCase).
 * The method will use all arguments passed to the function changing the case of each word accordingly.
 * Also, characters like . (dot), _ (underscore), - (dash) and ' ' (whitespaces) are considered delimiters
 * within a word (argument).
 *
 * Non-string arguments are discarded.
 *
 * @param {...*} [args] - the arguments to be converted to camel case.
 * @returns {string} a string in camel case (camelCase).
 */
export function toCamelCase (...args) {
  let string = filter.call(args, (argument) => argument && typeof argument === 'string')
                     .map((argument) => argument.trim())
                     .join('-');

  if (!/[_.\- ]/.test(string)) {
    if (string.length === 1 || string === string.toUpperCase()) {
      return string.toLowerCase();
    }

    return string[ 0 ].toLowerCase() + string.substring(1);
  }

  return string.replace(/([A-Z]+)/g, (match, group) => `-${group}`)
               .replace(/^[_.\- ]+|[_.\- ]+$/, '')
               .toLowerCase()
               .replace(/[_.\- ]+(\w|$)/g, (match, group) => group.toUpperCase());
}

/**
 * @static
 * @public
 * @function
 * @memberof log.utils
 * @since 1.0.0
 *
 * Throws an exception when [conditional] is false.
 * The [conditional] won't be coerced, so passing `falsy` values (other than `false`) won't throw an exception.
 * @param {Function} error - the error type to be thrown if guard fails.
 * @param {boolean} conditional - the value to validate.
 * @param {string} message - the error message to be displayed when [conditional] is `false`.
 *                           The format supports a limited version of `printf` standard.
 *                           %s are replaced everything else gets ignored.
 * @param {...*} [replacements] - the replace values, if any.
 */
export function guard (error, conditional, message, ...replacements) {
  const Exception = typeof error === 'function' ? error : Error;
  if (conditional === false) {
    throw new Exception(message.replace(/%s/g, () => replacements.length > 0 ? replacements.shift() : ''));
  }
}

/**
 * @static
 * @public
 * @function
 * @memberof log.utils
 * @since 1.0.0
 *
 * Flattens the provided arguments.
 *
 * @param {...*} [args] - the arguments to be flatten.
 * @returns {Array} the flattened array.
 */
export function flatten (...args) {
  return slice.call(args).reduce((flat, array) => {
    return flat.concat(Array.isArray(array) ? flatten.apply(null, array) : array);
  }, []);
}

/**
 * @static
 * @public
 * @function
 * @memberof log.utils
 * @since 1.0.0
 *
 * Copies the values of all enumerable own properties from one or more source objects to [target].
 * Existing properties in [target] will not be updated.
 *
 * @param {*} target - the target object.
 * @param {...*} sources - the source object(s).
 * @returns {*} the same [target] object with all nonexistent properties from [sources].
 */
export function defaults (target, ...sources) {
  target = target != null ? Object(target) : Object.create(null);

  let key;
  return sources.reduce((obj, source) => {
    if (source != null && source !== target) {
      for (key in source) {
        if (!hasOwnProperty.call(target, key)) {
          if (isPlainObject(source[ key ])) {
            target[ key ] = defaults({}, source[ key ]);
          } else if (Array.isArray(source[ key ])) {
            target[ key ] = defaults([], source[ key ]);
          } else {
            target[ key ] = source[ key ];
          }
        } else if ((isPlainObject(target[ key ]) || Array.isArray(target[ key ])) &&
                   (isPlainObject(source[ key ]) || Array.isArray(source[ key ]))) {
          target[ key ] = defaults(target[ key ], source[ key ]);
        }
      }
    }
    return obj;
  }, target);
}

/**
 * @static
 * @public
 * @function
 * @memberof log.utils
 * @since 1.0.0
 *
 * Normalizes the path.
 *
 * @param {string} raw - the path to be normalized.
 * @param {string} [cwd] - the current process location or home path.
 * @returns {string} the normalized path.
 */
export function normalize (raw, cwd) {
  raw = typeof raw === 'string' ? raw.trim() : '';
  cwd = typeof cwd === 'string' ? cwd : process.cwd();

  if (raw.length === 0) return raw;

  if (raw.charCodeAt(0) === 46) {
    raw = path.resolve(cwd, raw);
  } else if (raw.charCodeAt(0) === 126) {
    raw = path.resolve(os.homedir(), raw.substring(2));
  }

  return path.normalize(raw);
}
