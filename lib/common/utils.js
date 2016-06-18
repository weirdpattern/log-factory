/**
 * @module log.utils
 */

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

/**
 * @public
 * @constant
 * @memberof log.utils
 * @since 1.0.0
 *
 * Extension points.
 */
export const ExtensionPoints = {
  'CONFIGURABLE': 1,
  'ENUMERABLE': 2,
  'WRITABLE': 4,
  'GETTER': 8,
  'SETTER': 16
};

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
    value = properties[property];

    if (options != null) {
      if ((options & ExtensionPoints.CONFIGURABLE) === ExtensionPoints.CONFIGURABLE) {
        descriptor.configurable = true;
      }

      if ((options & ExtensionPoints.ENUMERABLE) === ExtensionPoints.ENUMERABLE) {
        descriptor.enumerable = true;
      }

      if ((options & ExtensionPoints.WRITABLE) === ExtensionPoints.WRITABLE) {
        descriptor.writable = true;
      }

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
    }

    Object.defineProperty(object, property, descriptor);
  });
}

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
export function isPlainObject (object) {
  if (object == null || typeof object !== 'object' || toString.call(object) !== '[object Object]') {
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
export function toCamelCase () {
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
