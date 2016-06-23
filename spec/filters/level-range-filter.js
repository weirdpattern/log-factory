'use strict';

const audit = require('../../lib/levels/audit');
const debug = require('../../lib/levels/debug');
const info = require('../../lib/levels/info');
const warn = require('../../lib/levels/warn');
const error = require('../../lib/levels/error');
const fatal = require('../../lib/levels/fatal');
const LogEvent = require('../../lib/logger').LogEvent;
const filter = require('../../lib/filters/filter');
const Filter = filter.Filter;
const FilterResults = filter.FilterResults;

module.exports = function (test, LevelRangeFilter) {
  const auditEvent = new LogEvent('test', audit, 'this is a test');
  const debugEvent = new LogEvent('test', debug, 'this is a test');
  const infoEvent = new LogEvent('test', info, 'this is a test');
  const warnEvent = new LogEvent('test', warn, 'this is a test');
  const errorEvent = new LogEvent('test', error, 'this is a test');
  const fatalEvent = new LogEvent('test', fatal, 'this is a test');

  test('filter level-range-filter', (assert) => {
    const filter = new LevelRangeFilter(audit, debug);

    assert.comment('throws with');
    assert.throws(() => new LevelRangeFilter(void 0, audit), 'undefined min level');
    assert.throws(() => new LevelRangeFilter(null, audit), 'null min level');
    assert.throws(() => new LevelRangeFilter({}, audit), 'no min level type');
    assert.throws(() => new LevelRangeFilter(audit, void 0), 'undefined max level');
    assert.throws(() => new LevelRangeFilter(audit, null), 'null max level');
    assert.throws(() => new LevelRangeFilter(audit, {}), 'no max level type');
    assert.throws(() => new LevelRangeFilter(debug, audit), 'incorrect level weights');
    assert.throws(() => filter.test(void 0), 'undefined events');
    assert.throws(() => filter.test(null), 'null events');
  });

  test('filter level-range-filter no options', (assert) => {
    const auditLevel = new LevelRangeFilter(audit, debug);
    const debugLevel = new LevelRangeFilter(debug, info);
    const infoLevel = new LevelRangeFilter(info, warn);
    const warnLevel = new LevelRangeFilter(warn, error);
    const errorLevel = new LevelRangeFilter(error, fatal);
    const fatalLevel = new LevelRangeFilter(fatal, fatal);

    assert.comment('audit and debug levels');
    assert.ok(auditLevel instanceof Filter, 'audit level-range-filter is a filter');
    assert.equals(auditLevel.filter, void 0, 'filter must be undefined');
    assert.equals(auditLevel.test(auditEvent), FilterResults.ALLOW, 'audit events must be allowed');
    assert.equals(auditLevel.test(debugEvent), FilterResults.ALLOW, 'debug events must be allowed');
    assert.equals(auditLevel.test(infoEvent), FilterResults.DENY, 'info events must not be allowed');
    assert.equals(auditLevel.test(warnEvent), FilterResults.DENY, 'warning events must not be allowed');
    assert.equals(auditLevel.test(errorEvent), FilterResults.DENY, 'error events must not be allowed');
    assert.equals(auditLevel.test(fatalEvent), FilterResults.DENY, 'fatal events must not be allowed');

    assert.comment('debug and info levels');
    assert.ok(debugLevel instanceof Filter, 'debug level-range-filter is a filter');
    assert.equals(debugLevel.filter, void 0, 'filter must be undefined');
    assert.equals(debugLevel.test(auditEvent), FilterResults.DENY, 'audit events must not be allowed');
    assert.equals(debugLevel.test(debugEvent), FilterResults.ALLOW, 'debug events must be allowed');
    assert.equals(debugLevel.test(infoEvent), FilterResults.ALLOW, 'info events must be allowed');
    assert.equals(debugLevel.test(warnEvent), FilterResults.DENY, 'warning events must not be allowed');
    assert.equals(debugLevel.test(errorEvent), FilterResults.DENY, 'error events must not be allowed');
    assert.equals(debugLevel.test(fatalEvent), FilterResults.DENY, 'fatal events must not be allowed');

    assert.comment('info and warn levels');
    assert.ok(infoLevel instanceof Filter, 'info level-range-filter is a filter');
    assert.equals(infoLevel.filter, void 0, 'filter must be undefined');
    assert.equals(infoLevel.test(auditEvent), FilterResults.DENY, 'audit events must not be allowed');
    assert.equals(infoLevel.test(debugEvent), FilterResults.DENY, 'debug events must not be allowed');
    assert.equals(infoLevel.test(infoEvent), FilterResults.ALLOW, 'info events must be allowed');
    assert.equals(infoLevel.test(warnEvent), FilterResults.ALLOW, 'warning events must be allowed');
    assert.equals(infoLevel.test(errorEvent), FilterResults.DENY, 'error events must not be allowed');
    assert.equals(infoLevel.test(fatalEvent), FilterResults.DENY, 'fatal events must not be allowed');

    assert.comment('warn and error levels');
    assert.ok(warnLevel instanceof Filter, 'warn level-range-filter is a filter');
    assert.equals(warnLevel.filter, void 0, 'filter must be undefined');
    assert.equals(warnLevel.test(auditEvent), FilterResults.DENY, 'audit events must not be allowed');
    assert.equals(warnLevel.test(debugEvent), FilterResults.DENY, 'debug events must not be allowed');
    assert.equals(warnLevel.test(infoEvent), FilterResults.DENY, 'info events must not be allowed');
    assert.equals(warnLevel.test(warnEvent), FilterResults.ALLOW, 'warning events must be allowed');
    assert.equals(warnLevel.test(errorEvent), FilterResults.ALLOW, 'error events must be allowed');
    assert.equals(warnLevel.test(fatalEvent), FilterResults.DENY, 'fatal events must not be allowed');

    assert.comment('error and fatal levels');
    assert.ok(errorLevel instanceof Filter, 'error level-range-filter is a filter');
    assert.equals(errorLevel.filter, void 0, 'filter must be undefined');
    assert.equals(errorLevel.test(auditEvent), FilterResults.DENY, 'audit events must not be allowed');
    assert.equals(errorLevel.test(debugEvent), FilterResults.DENY, 'debug events must not be allowed');
    assert.equals(errorLevel.test(infoEvent), FilterResults.DENY, 'info events must not be allowed');
    assert.equals(errorLevel.test(warnEvent), FilterResults.DENY, 'warning events must not be allowed');
    assert.equals(errorLevel.test(errorEvent), FilterResults.ALLOW, 'error events must be allowed');
    assert.equals(errorLevel.test(fatalEvent), FilterResults.ALLOW, 'fatal events must be allowed');

    assert.comment('fatal level');
    assert.ok(fatalLevel instanceof Filter, 'fatal level-range-filter is a filter');
    assert.equals(fatalLevel.filter, void 0, 'filter must be undefined');
    assert.equals(fatalLevel.test(auditEvent), FilterResults.DENY, 'audit events must not be allowed');
    assert.equals(fatalLevel.test(debugEvent), FilterResults.DENY, 'debug events must not be allowed');
    assert.equals(fatalLevel.test(infoEvent), FilterResults.DENY, 'info events must not be allowed');
    assert.equals(fatalLevel.test(warnEvent), FilterResults.DENY, 'warning events must not be allowed');
    assert.equals(fatalLevel.test(errorEvent), FilterResults.DENY, 'error events must not be allowed');
    assert.equals(fatalLevel.test(fatalEvent), FilterResults.ALLOW, 'fatal events must be allowed');
  });

  test('filter level-range-filter deny:false', (assert) => {
    const auditLevelPass = new LevelRangeFilter(audit, debug, { 'deny': false });
    const debugLevelPass = new LevelRangeFilter(debug, info, { 'deny': false });
    const infoLevelPass = new LevelRangeFilter(info, warn, { 'deny': false });
    const warnLevelPass = new LevelRangeFilter(warn, error, { 'deny': false });
    const errorLevelPass = new LevelRangeFilter(error, fatal, { 'deny': false });
    const fatalLevelPass = new LevelRangeFilter(fatal, fatal, { 'deny': false });

    assert.comment('audit and debug levels');
    assert.ok(auditLevelPass instanceof Filter, 'audit level-range-filter is a filter');
    assert.equals(auditLevelPass.filter, void 0, 'filter must be undefined');
    assert.equals(auditLevelPass.test(auditEvent), FilterResults.ALLOW, 'audit events must be allowed');
    assert.equals(auditLevelPass.test(debugEvent), FilterResults.ALLOW, 'debug events must be allowed');
    assert.equals(auditLevelPass.test(infoEvent), FilterResults.PASS, 'info events must be allowed to pass');
    assert.equals(auditLevelPass.test(warnEvent), FilterResults.PASS, 'warning events must be allowed to pass');
    assert.equals(auditLevelPass.test(errorEvent), FilterResults.PASS, 'error events must be allowed to pass');
    assert.equals(auditLevelPass.test(fatalEvent), FilterResults.PASS, 'fatal events must be allowed to pass');

    assert.comment('debug and info levels');
    assert.ok(debugLevelPass instanceof Filter, 'debug level-range-filter is a filter');
    assert.equals(debugLevelPass.filter, void 0, 'filter must be undefined');
    assert.equals(debugLevelPass.test(auditEvent), FilterResults.PASS, 'audit events must be allowed to pass');
    assert.equals(debugLevelPass.test(debugEvent), FilterResults.ALLOW, 'debug events must be allowed');
    assert.equals(debugLevelPass.test(infoEvent), FilterResults.ALLOW, 'info events must be allowed');
    assert.equals(debugLevelPass.test(warnEvent), FilterResults.PASS, 'warning events must be allowed to pass');
    assert.equals(debugLevelPass.test(errorEvent), FilterResults.PASS, 'error events must be allowed to pass');
    assert.equals(debugLevelPass.test(fatalEvent), FilterResults.PASS, 'fatal events must be allowed to pass');

    assert.comment('info and warn levels');
    assert.ok(infoLevelPass instanceof Filter, 'info level-range-filter is a filter');
    assert.equals(infoLevelPass.filter, void 0, 'filter must be undefined');
    assert.equals(infoLevelPass.test(auditEvent), FilterResults.PASS, 'audit events must be allowed to pass');
    assert.equals(infoLevelPass.test(debugEvent), FilterResults.PASS, 'debug events must be allowed to pass');
    assert.equals(infoLevelPass.test(infoEvent), FilterResults.ALLOW, 'info events must be allowed');
    assert.equals(infoLevelPass.test(warnEvent), FilterResults.ALLOW, 'warning events must be allowed');
    assert.equals(infoLevelPass.test(errorEvent), FilterResults.PASS, 'error events must be allowed to pass');
    assert.equals(infoLevelPass.test(fatalEvent), FilterResults.PASS, 'fatal events must be allowed to pass');

    assert.comment('warn and error levels');
    assert.ok(warnLevelPass instanceof Filter, 'warn level-range-filter is a filter');
    assert.equals(warnLevelPass.filter, void 0, 'filter must be undefined');
    assert.equals(warnLevelPass.test(auditEvent), FilterResults.PASS, 'audit events must be allowed to pass');
    assert.equals(warnLevelPass.test(debugEvent), FilterResults.PASS, 'debug events must be allowed to pass');
    assert.equals(warnLevelPass.test(infoEvent), FilterResults.PASS, 'info events must be allowed to pass');
    assert.equals(warnLevelPass.test(warnEvent), FilterResults.ALLOW, 'warning events must be allowed');
    assert.equals(warnLevelPass.test(errorEvent), FilterResults.ALLOW, 'error events must be allowed');
    assert.equals(warnLevelPass.test(fatalEvent), FilterResults.PASS, 'fatal events must be allowed to pass');

    assert.comment('error and fatal levels');
    assert.ok(errorLevelPass instanceof Filter, 'error level-range-filter is a filter');
    assert.equals(errorLevelPass.filter, void 0, 'filter must be undefined');
    assert.equals(errorLevelPass.test(auditEvent), FilterResults.PASS, 'audit events must be allowed to pass');
    assert.equals(errorLevelPass.test(debugEvent), FilterResults.PASS, 'debug events must be allowed to pass');
    assert.equals(errorLevelPass.test(infoEvent), FilterResults.PASS, 'info events must be allowed to pass');
    assert.equals(errorLevelPass.test(warnEvent), FilterResults.PASS, 'warning events must be allowed to pass');
    assert.equals(errorLevelPass.test(errorEvent), FilterResults.ALLOW, 'error events must be allowed');
    assert.equals(errorLevelPass.test(fatalEvent), FilterResults.ALLOW, 'fatal events must be allowed');

    assert.comment('fatal level');
    assert.ok(fatalLevelPass instanceof Filter, 'fatal level-range-filter is a filter');
    assert.equals(fatalLevelPass.filter, void 0, 'filter must be undefined');
    assert.equals(fatalLevelPass.test(auditEvent), FilterResults.PASS, 'audit events must be allowed to pass');
    assert.equals(fatalLevelPass.test(debugEvent), FilterResults.PASS, 'debug events must be allowed to pass');
    assert.equals(fatalLevelPass.test(infoEvent), FilterResults.PASS, 'info events must be allowed to pass');
    assert.equals(fatalLevelPass.test(warnEvent), FilterResults.PASS, 'warning events must be allowed to pass');
    assert.equals(fatalLevelPass.test(errorEvent), FilterResults.PASS, 'error events must be allowed to pass');
    assert.equals(fatalLevelPass.test(fatalEvent), FilterResults.ALLOW, 'fatal events must be allowed');
  });

  test('filter level-range-filter deny:true', (assert) => {
    const auditLevelDeny = new LevelRangeFilter(audit, debug, { 'deny': true });
    const debugLevelDeny = new LevelRangeFilter(debug, info, { 'deny': true });
    const infoLevelDeny = new LevelRangeFilter(info, warn, { 'deny': true });
    const warnLevelDeny = new LevelRangeFilter(warn, error, { 'deny': true });
    const errorLevelDeny = new LevelRangeFilter(error, fatal, { 'deny': true });
    const fatalLevelDeny = new LevelRangeFilter(fatal, fatal, { 'deny': true });

    assert.comment('audit and debug levels');
    assert.ok(auditLevelDeny instanceof Filter, 'audit level-range-filter is a filter');
    assert.equals(auditLevelDeny.filter, void 0, 'filter must be undefined');
    assert.equals(auditLevelDeny.test(auditEvent), FilterResults.ALLOW, 'audit events must be allowed');
    assert.equals(auditLevelDeny.test(debugEvent), FilterResults.ALLOW, 'debug events must be allowed');
    assert.equals(auditLevelDeny.test(infoEvent), FilterResults.DENY, 'info events must not be allowed');
    assert.equals(auditLevelDeny.test(warnEvent), FilterResults.DENY, 'warning events must not be allowed');
    assert.equals(auditLevelDeny.test(errorEvent), FilterResults.DENY, 'error events must not be allowed');
    assert.equals(auditLevelDeny.test(fatalEvent), FilterResults.DENY, 'fatal events must not be allowed');

    assert.comment('debug and info levels');
    assert.ok(debugLevelDeny instanceof Filter, 'debug level-range-filter is a filter');
    assert.equals(debugLevelDeny.filter, void 0, 'filter must be undefined');
    assert.equals(debugLevelDeny.test(auditEvent), FilterResults.DENY, 'audit events must not be allowed');
    assert.equals(debugLevelDeny.test(debugEvent), FilterResults.ALLOW, 'debug events must be allowed');
    assert.equals(debugLevelDeny.test(infoEvent), FilterResults.ALLOW, 'info events must be allowed');
    assert.equals(debugLevelDeny.test(warnEvent), FilterResults.DENY, 'warning events must not be allowed');
    assert.equals(debugLevelDeny.test(errorEvent), FilterResults.DENY, 'error events must not be allowed');
    assert.equals(debugLevelDeny.test(fatalEvent), FilterResults.DENY, 'fatal events must not be allowed');

    assert.comment('info and warn levels');
    assert.ok(infoLevelDeny instanceof Filter, 'info level-range-filter is a filter');
    assert.equals(infoLevelDeny.filter, void 0, 'filter must be undefined');
    assert.equals(infoLevelDeny.test(auditEvent), FilterResults.DENY, 'audit events must not be allowed');
    assert.equals(infoLevelDeny.test(debugEvent), FilterResults.DENY, 'debug events must not be allowed');
    assert.equals(infoLevelDeny.test(infoEvent), FilterResults.ALLOW, 'info events must be allowed');
    assert.equals(infoLevelDeny.test(warnEvent), FilterResults.ALLOW, 'warning events must be allowed');
    assert.equals(infoLevelDeny.test(errorEvent), FilterResults.DENY, 'error events must not be allowed');
    assert.equals(infoLevelDeny.test(fatalEvent), FilterResults.DENY, 'fatal events must not be allowed');

    assert.comment('warn and error levels');
    assert.ok(warnLevelDeny instanceof Filter, 'warn level-range-filter is a filter');
    assert.equals(warnLevelDeny.filter, void 0, 'filter must be undefined');
    assert.equals(warnLevelDeny.test(auditEvent), FilterResults.DENY, 'audit events must not be allowed');
    assert.equals(warnLevelDeny.test(debugEvent), FilterResults.DENY, 'debug events must not be allowed');
    assert.equals(warnLevelDeny.test(infoEvent), FilterResults.DENY, 'info events must not be allowed');
    assert.equals(warnLevelDeny.test(warnEvent), FilterResults.ALLOW, 'warning events must be allowed');
    assert.equals(warnLevelDeny.test(errorEvent), FilterResults.ALLOW, 'error events must be allowed');
    assert.equals(warnLevelDeny.test(fatalEvent), FilterResults.DENY, 'fatal events must not be allowed');

    assert.comment('error and fatal levels');
    assert.ok(errorLevelDeny instanceof Filter, 'error level-range-filter is a filter');
    assert.equals(errorLevelDeny.filter, void 0, 'filter must be undefined');
    assert.equals(errorLevelDeny.test(auditEvent), FilterResults.DENY, 'audit events must not be allowed');
    assert.equals(errorLevelDeny.test(debugEvent), FilterResults.DENY, 'debug events must not be allowed');
    assert.equals(errorLevelDeny.test(infoEvent), FilterResults.DENY, 'info events must not be allowed');
    assert.equals(errorLevelDeny.test(warnEvent), FilterResults.DENY, 'warning events must not be allowed');
    assert.equals(errorLevelDeny.test(errorEvent), FilterResults.ALLOW, 'error events must be allowed');
    assert.equals(errorLevelDeny.test(fatalEvent), FilterResults.ALLOW, 'fatal events must be allowed');

    assert.comment('fatal level');
    assert.ok(fatalLevelDeny instanceof Filter, 'fatal level-range-filter is a filter');
    assert.equals(fatalLevelDeny.filter, void 0, 'filter must be undefined');
    assert.equals(fatalLevelDeny.test(auditEvent), FilterResults.DENY, 'audit events must not be allowed');
    assert.equals(fatalLevelDeny.test(debugEvent), FilterResults.DENY, 'debug events must not be allowed');
    assert.equals(fatalLevelDeny.test(infoEvent), FilterResults.DENY, 'info events must not be allowed');
    assert.equals(fatalLevelDeny.test(warnEvent), FilterResults.DENY, 'warning events must not be allowed');
    assert.equals(fatalLevelDeny.test(errorEvent), FilterResults.DENY, 'error events must not be allowed');
    assert.equals(fatalLevelDeny.test(fatalEvent), FilterResults.ALLOW, 'fatal events must be allowed');
  });

  test('filter level-range-filter locked:false', (assert) => {
    const filter = new LevelRangeFilter(audit, fatal, { 'locked': false });

    assert.comment('with all levels');
    assert.equals(filter.test(auditEvent), FilterResults.ALLOW, 'audit events must be allowed');
    assert.equals(filter.test(debugEvent), FilterResults.ALLOW, 'debug events must be allowed');
    assert.equals(filter.test(infoEvent), FilterResults.ALLOW, 'info events must be allowed');
    assert.equals(filter.test(warnEvent), FilterResults.ALLOW, 'warning events must be allowed');
    assert.equals(filter.test(errorEvent), FilterResults.ALLOW, 'error events must be allowed');
    assert.equals(filter.test(fatalEvent), FilterResults.ALLOW, 'fatal events must be allowed');

    assert.comment('does not throw with');
    assert.doesNotThrow(() => { filter.min = warn; }, 'updating the min level');
    assert.equals(filter.test(auditEvent), FilterResults.DENY, 'audit events must not be allowed');
    assert.equals(filter.test(debugEvent), FilterResults.DENY, 'debug events must not be allowed');
    assert.equals(filter.test(infoEvent), FilterResults.DENY, 'info events must not be allowed');
    assert.equals(filter.test(warnEvent), FilterResults.ALLOW, 'warning events must be allowed');
    assert.equals(filter.test(errorEvent), FilterResults.ALLOW, 'error events must be allowed');
    assert.equals(filter.test(fatalEvent), FilterResults.ALLOW, 'fatal events must be allowed');

    assert.doesNotThrow(() => { filter.max = error; }, 'updating the max level');
    assert.equals(filter.test(auditEvent), FilterResults.DENY, 'audit events must not be allowed');
    assert.equals(filter.test(debugEvent), FilterResults.DENY, 'debug events must not be allowed');
    assert.equals(filter.test(infoEvent), FilterResults.DENY, 'info events must not be allowed');
    assert.equals(filter.test(warnEvent), FilterResults.ALLOW, 'warning events must be allowed');
    assert.equals(filter.test(errorEvent), FilterResults.ALLOW, 'error events must be allowed');
    assert.equals(filter.test(fatalEvent), FilterResults.DENY, 'fatal events must not be allowed');

    assert.doesNotThrow(() => { filter.deny = true; }, 'updating the deny flag');
  });

  test('filter level-range-filter locked:true', (assert) => {
    const filter = new LevelRangeFilter(audit, fatal, { 'locked': true });

    assert.comment('with all levels');
    assert.equals(filter.test(auditEvent), FilterResults.ALLOW, 'audit events must be allowed');
    assert.equals(filter.test(debugEvent), FilterResults.ALLOW, 'debug events must be allowed');
    assert.equals(filter.test(infoEvent), FilterResults.ALLOW, 'info events must be allowed');
    assert.equals(filter.test(warnEvent), FilterResults.ALLOW, 'warning events must be allowed');
    assert.equals(filter.test(errorEvent), FilterResults.ALLOW, 'error events must be allowed');
    assert.equals(filter.test(fatalEvent), FilterResults.ALLOW, 'fatal events must be allowed');

    assert.comment('throws with');
    assert.throws(() => { filter.min = warn; }, 'updating the min level');
    assert.throws(() => { filter.max = error; }, 'updating the max level');
    assert.throws(() => { filter.deny = false; }, 'updating the deny option');
  });

  test('filter level-range-filter special cases', (assert) => {
    const filter = new LevelRangeFilter(info, warn, { 'locked': true });

    assert.comment('throws with');
    assert.throws(() => { filter.min = 1; }, 'updating min with an invalid level');
    assert.throws(() => { filter.min = fatal; }, 'updating min to a level higher than max');
    assert.throws(() => { filter.max = audit; }, 'updating max to a level lower than min');
  });
};
