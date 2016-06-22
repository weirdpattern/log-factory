/**
 * @module log.utils
 */

'use strict';

/*
 * @private
 * @constant
 *
 * Shorthand toString method.
 */
const toString = Object.prototype.toString;

/*
 * @private
 * @constant
 *
 * Shorthand hasOwnProperty method.
 */
const hasOwnProperty = Object.prototype.hasOwnProperty;

/*
 * @private
 * @constant
 *
 * Shorthand filter method.
 */
const filter = Array.prototype.filter;

/*
 * @private
 * @constant
 *
 * Shorthand slice method.
 */
const slice = Array.prototype.slice;

/*
 * @private
 * @constant
 * @see {@link log.utils#ExtensionPoints}
 */
const ExtensionPoints = {
  'CONFIGURABLE': 1,
  'ENUMERABLE': 2,
  'WRITABLE': 4,
  'GETTER': 8,
  'SETTER': 16
};

/*
 * @private
 * @function
 * @see {@link log.utils#extend}
 */
function extend (object, properties, options) {
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
    value = properties[property];

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

/*
 * @private
 * @function
 * @see {@link log.utils#isPlainObject}
 */
function isPlainObject (object) {
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

/*
 * @private
 * @function
 * @see {@link log.utils#toCamelCase}
 */
function toCamelCase () {
  let string = filter.call(arguments, (argument) => typeof argument === 'string' && argument.trim().length > 0)
                     .map((argument) => argument.trim())
                     .join('-');

  if (!/[_.\- ]/.test(string)) {
    if (string.length === 1 || string === string.toUpperCase()) {
      return string.toLowerCase();
    }

    return string[0].toLowerCase() + string.substring(1);
  }

  return string.replace(/([A-Z]+)/g, (match, group) => `-${group}`)
               .replace(/^[_.\- ]+|[_.\- ]+$/, '')
               .toLowerCase()
               .replace(/[_.\- ]+(\w|$)/g, (match, group) => group.toUpperCase());
}

/*
 * @private
 * @function
 * @see {@link log.utils#guard}
 */
function guard (error, conditional, message) {
  const replacements = slice.call(arguments, 3);
  const Exception = typeof error === 'function' ? error : Error;
  if (conditional === false) {
    throw new Exception(message.replace(/%s/g, () => replacements.length > 0 ? replacements.shift() : ''));
  }
}

/*
 * @private
 * @function
 * @see {@link log.utils#flatten}
 */
function flatten () {
  return slice.call(arguments).reduce((flat, array) => {
    return flat.concat(Array.isArray(array) ? flatten.apply(null, array) : array);
  }, []);
}

/*
 * @private
 * @function
 * @see {@link log.utils#defaults}
 */
function defaults (target) {
  target = target != null ? Object(target) : Object.create(null);

  const sources = slice.call(arguments, 1);
  return sources.reduce((obj, source) => {
    if (source != null && source !== target) {
      extract(target, source);
    }

    return obj;
  }, target);
}

/*
 * @private
 * @function
 *
 * Extracts the properties from source and adds them to target if the property does not exist.
 */
function extract (target, source, stack) {
  stack = stack || new WeakMap();

  let stackValue;
  const enumerable = Symbol.iterator in source;
  const properties = enumerable ? source : getAllKeys(source);

  properties.forEach((value, key) => {
    if (!enumerable) {
      key = value;
      value = source[key];
    }

    if (typeof value === 'object' || typeof value === 'function') {
      stackValue = stack.get(value);
      if (stackValue !== void 0) {
        if (!hasOwnProperty.call(target, key)) {
          target[ key ] = stackValue;
        }
      } else if (Symbol.iterator in value) {

      } else {

      }
    } else if (!hasOwnProperty.call(target, key)) {
      target[key] = value;
    }
  });
}

module.exports = {
  /**
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
  'extend': extend,

  /**
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
  'isPlainObject': isPlainObject,

  /**
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
   * @returns {string} a string in camel case (camelCase).
   */
  'toCamelCase': toCamelCase,

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
   * @param {arguments} [arguments] - the replace values, if any.
   */
  'guard': guard,

  /**
   * @static
   * @public
   * @function
   * @memberof log.utils
   * @since 1.0.0
   *
   * Flattens the provided arguments.
   *
   * @param {arguments} arguments - the arguments to be flatten.
   * @returns {Array} the flattened array.
   */
  'flatten': flatten,

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
   * @param {arguments} arguments - the source object(s).
   * @returns {*} the same [target] object with all nonexistent properties from [sources].
   */
  'defaults': defaults,

  /**
   * @public
   * @constant
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
  'ExtensionPoints': ExtensionPoints
};
