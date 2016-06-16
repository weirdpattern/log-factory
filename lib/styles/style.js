'use strict';

/**
 * @module log.style
 */

/*
 * @private
 * @constant
 *
 * Supported styles.
 */
const STYLES = {
  'FOREGROUND': 0,
  'BACKGROUND': 1,
  'MODIFIER'  : 2
};

/*
 * @private
 * @constant
 *
 * Supported background colors.
 */
const BACKGROUNDS = {
  'BLACK'  : 0,
  'BLUE'   : 1,
  'CYAN'   : 2,
  'GREEN'  : 3,
  'MAGENTA': 4,
  'RED'    : 5,
  'WHITE'  : 6,
  'YELLOW' : 7
};

/*
 * @private
 * @constant
 *
 * Supported foreground colors.
 */
const FOREGROUNDS = {
  'WHITE'  : 0,
  'BLACK'  : 1,
  'BLUE'   : 2,
  'CYAN'   : 3,
  'GRAY'   : 4,
  'GREEN'  : 5,
  'MAGENTA': 6,
  'RED'    : 7,
  'YELLOW' : 8
};

/*
 * @private
 * @constant
 *
 * Supported modifiers.
 */
const MODIFIERS = {
  'NONE'     : 0,
  'BOLD'     : 1,
  'DIM'      : 2,
  'HIDDEN'   : 4,
  'INVERSE'  : 8,
  'ITALIC'   : 16,
  'RESET'    : 32,
  'STRIKE'   : 64,
  'UNDERLINE': 128
};

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
function color(candidate, colors, defaultColor) {
  if (candidate == null) return defaultColor;

  if (typeof candidate === 'number' || /^[0-9]$/.test(candidate)) {
    let key;
    for (key in colors) {
      if (colors.hasOwnProperty(key) && colors[key] === +candidate) {
        return +candidate;
      }
    }
  } else if (typeof candidate === 'string') {
    candidate = candidate.toUpperCase();
    if (colors[candidate] != null) {
      return colors[candidate];
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
 * @param {Array<(int|string)>} candidates - the candidate MODIFIER to be evaluated.
 * @returns {int} the code of the modifier.
 */
function modifier(candidates) {
  return candidates.reduce((modifier, candidate) => {
    if (typeof candidate === 'number' || /^[0-9]+$/.test(candidate)) {
      let key;
      for (key in MODIFIERS) {
        if (MODIFIERS.hasOwnProperty(key) && MODIFIERS[key] === +candidate) {
          modifier |= +candidate;
        }
      }
    } else if (typeof candidate === 'string') {
      candidate = candidate.toUpperCase();
      if (MODIFIERS[candidate] != null) {
        modifier |= MODIFIERS[candidate];
      }
    }

    return modifier;
  }, 0);
}

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
 * @param {int|Array<(int|string)>} [modifiers] - the modifiers to be used.
 *
 * @see {@link Style~FOREGROUNDS}.
 * @see {@link Style~BACKGROUNDS}.
 * @see {@link Style~MODIFIERS}.
 */
function Style(foreground, background, modifiers) {
  this.foreground = color(foreground, FOREGROUNDS, FOREGROUNDS.WHITE);
  this.background = color(background, BACKGROUNDS, BACKGROUNDS.BLACK);

  modifiers = modifiers == null ? MODIFIERS.NONE : modifiers;
  if (Array.isArray(modifiers)) {
    modifiers = modifier(modifiers);
  }

  this.modifiers = modifiers;
}

/**
 * @public
 * @function
 * @memberof log.style
 * @since 1.0.0
 *
 * Applies the style on the given text.
 *
 * @param {string} text - the text to be formatted.
 * @returns {string} the formatted text.
 */
Style.prototype.apply = function(text) {
  return text;
};

/**
 * @public
 * @memberof log.style.Style
 * @since 1.0.0
 *
 * Default style.
 */
Style.Default = new Style();

/**
 * @public
 * @constant
 * @memberof log.style.Style
 * @since 1.0.0
 *
 * Supported styles:
 * FOREGROUND (0)
 * BACKGROUND (1)
 * MODIFIERS  (2)
 */
Style.STYLES = STYLES;

/**
 * @public
 * @constant
 * @memberof log.style.Style
 * @since 1.0.0
 *
 * Supported foreground colors:
 * WHITE   (0)
 * BLACK   (1)
 * BLUE    (2)
 * CYAN    (3)
 * GRAY    (4)
 * GREEN   (5)
 * MAGENTA (6)
 * RED     (7)
 * YELLOW  (8)
 */
Style.FOREGROUNDS = FOREGROUNDS;

/**
 * @public
 * @constant
 * @memberof log.style.Style
 * @since 1.0.0
 *
 * Supported background colors.
 * BLACK   (0)
 * BLUE    (1)
 * CYAN    (2)
 * GREEN   (3)
 * MAGENTA (4)
 * RED     (5)
 * WHITE   (6)
 * YELLOW  (7)
 * GRAY    (8)
 */
Style.BACKGROUNDS = BACKGROUNDS;

/**
 * @public
 * @constant
 * @memberof log.style.Style
 * @since 1.0.0
 *
 * Supported modifiers.
 * NONE      (0)
 * BOLD      (1)
 * DIM       (2)
 * HIDDEN    (4)
 * INVERSE   (8)
 * ITALIC    (16)
 * RESET     (32)
 * STRIKE    (64)
 * UNDERLINE (128)
 */
Style.MODIFIERS = MODIFIERS;

module.exports = Style;