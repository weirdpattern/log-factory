/**
 * @module log.style
 * @author Patricio Trevino
 */

import { extend, flatten, isPlainObject } from '../common/utils';

/*
 * Shorthand methods.
 */
const hasOwnProperty = Object.prototype.hasOwnProperty;

/*
 * @private
 * @function
 *
 * Gets the correct representation of the [candidate] color.
 *
 * @param {(int|string)} candidate - the candidate color to be evaluated.
 * @param {Object} colors - the valid colors for the [candidate].
 * @param {int} defaultColor - the default color to be used if the candidate is not valid.
 * @returns {int} the code of the color.
 */
function color (candidate, colors, defaultColor) {
  if (candidate == null) return defaultColor;

  if (typeof candidate === 'number' || /^[0-9]$/.test(candidate)) {
    let key;
    for (key in colors) {
      /* istanbul ignore else */
      if (hasOwnProperty.call(colors, key) && colors[ key ] === +candidate) {
        return +candidate;
      }
    }

    /* istanbul ignore else */
  } else if (typeof candidate === 'string') {
    candidate = candidate.toUpperCase();

    /* istanbul ignore else */
    if (colors[ candidate ] != null) {
      return colors[ candidate ];
    }
  }

  return defaultColor;
}

/*
 * @private
 * @function
 *
 * Gets the correct representation of the [candidates] modifiers.
 *
 * @param {Array.<(int|string)>} candidates - the candidate MODIFIER to be evaluated.
 * @returns {int} the code of the modifier.
 */
function modifier (candidates) {
  return flatten(candidates).reduce((mod, candidate) => {
    if (typeof candidate === 'number' || /^[0-9]+$/.test(candidate)) {
      let key;
      for (key in Modifiers) {
        /* istanbul ignore else */
        if (hasOwnProperty.call(Modifiers, key)) {
          if (Modifiers[ key ] === +candidate) {
            mod |= +candidate;
          } else if ((+candidate & Modifiers[ key ]) === Modifiers[ key ]) {
            mod |= Modifiers[ key ];
          }
        }
      }

      /* istanbul ignore else */
    } else if (typeof candidate === 'string') {
      candidate = candidate.toUpperCase();

      /* istanbul ignore else */
      if (Modifiers[ candidate ] != null) {
        mod |= Modifiers[ candidate ];
      }
    }

    return mod;
  }, 0);
}

/**
 * @public
 * @constant
 * @memberof log.style
 * @since 1.0.0
 *
 * Supported foreground colors:
 * WHITE (0)
 * BLACK (1)
 * BLUE (2)
 * CYAN (3)
 * GRAY (4)
 * GREEN (5)
 * MAGENTA (6)
 * RED (7)
 * YELLOW (8)
 */
export const Foregrounds = {
  'WHITE': 0,
  'BLACK': 1,
  'BLUE': 2,
  'CYAN': 3,
  'GRAY': 4,
  'GREEN': 5,
  'MAGENTA': 6,
  'RED': 7,
  'YELLOW': 8
};

/**
 * @public
 * @constant
 * @memberof log.style
 * @since 1.0.0
 *
 * Supported background colors.
 * BLACK (0)
 * BLUE (1)
 * CYAN (2)
 * GREEN (3)
 * MAGENTA (4)
 * RED (5)
 * WHITE (6)
 * YELLOW (7)
 * GRAY (8)
 */
export const Backgrounds = {
  'BLACK': 0,
  'BLUE': 1,
  'CYAN': 2,
  'GREEN': 3,
  'MAGENTA': 4,
  'RED': 5,
  'WHITE': 6,
  'YELLOW': 7
};

/**
 * @public
 * @constant
 * @memberof log.style
 * @since 1.0.0
 *
 * Supported modifiers.
 * NONE (0)
 * BOLD (1)
 * DIM (2)
 * HIDDEN (4)
 * INVERSE (8)
 * ITALIC (16)
 * RESET (32)
 * STRIKE (64)
 * UNDERLINE (128)
 */
export const Modifiers = {
  'NONE': 0,
  'BOLD': 1,
  'DIM': 2,
  'HIDDEN': 4,
  'INVERSE': 8,
  'ITALIC': 16,
  'RESET': 32,
  'STRIKE': 64,
  'UNDERLINE': 128
};

/**
 * @public
 * @constructor
 * @memberof log.style
 * @since 1.0.0
 *
 * Represents a level style.
 *
 * @param {(int|string)} [foreground]- the color to be used.
 * @param {(int|string)} [background] - the background color to be used.
 * @param {(int|string|Array.<(int|string)>)} [modifiers] - the modifiers to be used.
 *
 * @see {@link Foregrounds}.
 * @see {@link Backgrounds}.
 * @see {@link Modifiers}.
 */
export default function Style (foreground, background, modifiers) {
  this.foreground = color(foreground, Foregrounds, Foregrounds.WHITE);
  this.background = color(background, Backgrounds, Backgrounds.BLACK);

  if (modifiers == null) {
    modifiers = Modifiers.NONE;
  } else {
    modifiers = modifier(Array.isArray(modifiers) ? modifiers : [ modifiers ]);
  }

  this.modifiers = modifiers;
}

extend(Style, {
  /**
   * @static
   * @public
   * @function
   * @memberof log.level
   * @since 1.0.0
   *
   * Creates a new level from [settings].
   *
   * @param {StyleSettings} [settings] - the settings to be used to create the style.
   * @returns {Style} the new Style.
   */
  create (settings) {
    if (isPlainObject(settings)) {
      return new Style(settings.foreground, settings.background, settings.modifiers);
    }

    return new Style();
  }
});
