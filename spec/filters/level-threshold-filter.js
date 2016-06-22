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

module.exports = function (test, LevelThresholdFilter) {
  const auditEvent = new LogEvent('test', audit, 'this is a test');
  const debugEvent = new LogEvent('test', debug, 'this is a test');
  const infoEvent = new LogEvent('test', info, 'this is a test');
  const warnEvent = new LogEvent('test', warn, 'this is a test');
  const errorEvent = new LogEvent('test', error, 'this is a test');
  const fatalEvent = new LogEvent('test', fatal, 'this is a test');

  test('filter level-threshold-filter', (assert) => {
    const filter = new LevelThresholdFilter(audit);

    assert.comment('throws with');
    assert.throws(() => new LevelThresholdFilter(void 0), 'undefined level');
    assert.throws(() => new LevelThresholdFilter(null), 'null level');
    assert.throws(() => new LevelThresholdFilter({}), 'no level type');
    assert.throws(() => filter.test(void 0), 'undefined events');
    assert.throws(() => filter.test(null), 'null events');
  });

  test('filter level-threshold-filter no options', (assert) => {
    const auditLevel = new LevelThresholdFilter(audit);
    const debugLevel = new LevelThresholdFilter(debug);
    const infoLevel = new LevelThresholdFilter(info);
    const warnLevel = new LevelThresholdFilter(warn);
    const errorLevel = new LevelThresholdFilter(error);
    const fatalLevel = new LevelThresholdFilter(fatal);

    assert.comment('audit level and below');
    assert.ok(auditLevel instanceof Filter, 'audit level-threshold-filter is a filter');
    assert.equals(auditLevel.filter, void 0, 'filter must be undefined');
    assert.equals(auditLevel.test(auditEvent), FilterResults.ALLOW, 'audit events must be allowed');
    assert.equals(auditLevel.test(debugEvent), FilterResults.DENY, 'debug events must not be allowed');
    assert.equals(auditLevel.test(infoEvent), FilterResults.DENY, 'info events must not be allowed');
    assert.equals(auditLevel.test(warnEvent), FilterResults.DENY, 'warning events must not be allowed');
    assert.equals(auditLevel.test(errorEvent), FilterResults.DENY, 'error events must not be allowed');
    assert.equals(auditLevel.test(fatalEvent), FilterResults.DENY, 'fatal events must not be allowed');

    assert.comment('debug level and below');
    assert.ok(debugLevel instanceof Filter, 'debug level-threshold-filter is a filter');
    assert.equals(debugLevel.filter, void 0, 'filter must be undefined');
    assert.equals(debugLevel.test(auditEvent), FilterResults.ALLOW, 'audit events must be allowed');
    assert.equals(debugLevel.test(debugEvent), FilterResults.ALLOW, 'debug events must be allowed');
    assert.equals(debugLevel.test(infoEvent), FilterResults.DENY, 'info events must not be allowed');
    assert.equals(debugLevel.test(warnEvent), FilterResults.DENY, 'warning events must not be allowed');
    assert.equals(debugLevel.test(errorEvent), FilterResults.DENY, 'error events must not be allowed');
    assert.equals(debugLevel.test(fatalEvent), FilterResults.DENY, 'fatal events must not be allowed');

    assert.comment('info level and below');
    assert.ok(infoLevel instanceof Filter, 'info level-threshold-filter is a filter');
    assert.equals(infoLevel.filter, void 0, 'filter must be undefined');
    assert.equals(infoLevel.test(auditEvent), FilterResults.ALLOW, 'audit events must be allowed');
    assert.equals(infoLevel.test(debugEvent), FilterResults.ALLOW, 'debug events must be allowed');
    assert.equals(infoLevel.test(infoEvent), FilterResults.ALLOW, 'info events must be allowed');
    assert.equals(infoLevel.test(warnEvent), FilterResults.DENY, 'warning events must not be allowed');
    assert.equals(infoLevel.test(errorEvent), FilterResults.DENY, 'error events must not be allowed');
    assert.equals(infoLevel.test(fatalEvent), FilterResults.DENY, 'fatal events must not be allowed');

    assert.comment('warn level and below');
    assert.ok(warnLevel instanceof Filter, 'warn level-threshold-filter is a filter');
    assert.equals(warnLevel.filter, void 0, 'filter must be undefined');
    assert.equals(warnLevel.test(auditEvent), FilterResults.ALLOW, 'audit events must be allowed');
    assert.equals(warnLevel.test(debugEvent), FilterResults.ALLOW, 'debug events must be allowed');
    assert.equals(warnLevel.test(infoEvent), FilterResults.ALLOW, 'info events must be allowed');
    assert.equals(warnLevel.test(warnEvent), FilterResults.ALLOW, 'warning events must be allowed');
    assert.equals(warnLevel.test(errorEvent), FilterResults.DENY, 'error events must not be allowed');
    assert.equals(warnLevel.test(fatalEvent), FilterResults.DENY, 'fatal events must not be allowed');

    assert.comment('error level and below');
    assert.ok(errorLevel instanceof Filter, 'error level-threshold-filter is a filter');
    assert.equals(errorLevel.filter, void 0, 'filter must be undefined');
    assert.equals(errorLevel.test(auditEvent), FilterResults.ALLOW, 'audit events must not be allowed');
    assert.equals(errorLevel.test(debugEvent), FilterResults.ALLOW, 'debug events must not be allowed');
    assert.equals(errorLevel.test(infoEvent), FilterResults.ALLOW, 'info events must not be allowed');
    assert.equals(errorLevel.test(warnEvent), FilterResults.ALLOW, 'warning events must not be allowed');
    assert.equals(errorLevel.test(errorEvent), FilterResults.ALLOW, 'error events must be allowed');
    assert.equals(errorLevel.test(fatalEvent), FilterResults.DENY, 'fatal events must be allowed');

    assert.comment('fatal level and below');
    assert.ok(fatalLevel instanceof Filter, 'fatal level-threshold-filter is a filter');
    assert.equals(fatalLevel.filter, void 0, 'filter must be undefined');
    assert.equals(fatalLevel.test(auditEvent), FilterResults.ALLOW, 'audit events must be allowed');
    assert.equals(fatalLevel.test(debugEvent), FilterResults.ALLOW, 'debug events must be allowed');
    assert.equals(fatalLevel.test(infoEvent), FilterResults.ALLOW, 'info events must be allowed');
    assert.equals(fatalLevel.test(warnEvent), FilterResults.ALLOW, 'warning events must be allowed');
    assert.equals(fatalLevel.test(errorEvent), FilterResults.ALLOW, 'error events must be allowed');
    assert.equals(fatalLevel.test(fatalEvent), FilterResults.ALLOW, 'fatal events must be allowed');
  });

  test('filter level-threshold-filter deny:false', (assert) => {
    const auditLevelPass = new LevelThresholdFilter(audit, { 'deny': false });
    const debugLevelPass = new LevelThresholdFilter(debug, { 'deny': false });
    const infoLevelPass = new LevelThresholdFilter(info, { 'deny': false });
    const warnLevelPass = new LevelThresholdFilter(warn, { 'deny': false });
    const errorLevelPass = new LevelThresholdFilter(error, { 'deny': false });
    const fatalLevelPass = new LevelThresholdFilter(fatal, { 'deny': false });

    assert.comment('audit level and below');
    assert.ok(auditLevelPass instanceof Filter, 'audit level-threshold-filter is a filter');
    assert.equals(auditLevelPass.filter, void 0, 'filter must be undefined');
    assert.equals(auditLevelPass.test(auditEvent), FilterResults.ALLOW, 'audit events must be allowed');
    assert.equals(auditLevelPass.test(debugEvent), FilterResults.PASS, 'debug events must be allowed to pass');
    assert.equals(auditLevelPass.test(infoEvent), FilterResults.PASS, 'info events must be allowed to pass');
    assert.equals(auditLevelPass.test(warnEvent), FilterResults.PASS, 'warning events must be allowed to pass');
    assert.equals(auditLevelPass.test(errorEvent), FilterResults.PASS, 'error events must be allowed to pass');
    assert.equals(auditLevelPass.test(fatalEvent), FilterResults.PASS, 'fatal events must be allowed to pass');

    assert.comment('debug level and below');
    assert.ok(debugLevelPass instanceof Filter, 'debug level-threshold-filter is a filter');
    assert.equals(debugLevelPass.filter, void 0, 'filter must be undefined');
    assert.equals(debugLevelPass.test(auditEvent), FilterResults.ALLOW, 'audit events must be allowed');
    assert.equals(debugLevelPass.test(debugEvent), FilterResults.ALLOW, 'debug events must be allowed');
    assert.equals(debugLevelPass.test(infoEvent), FilterResults.PASS, 'info events must be allowed to pass');
    assert.equals(debugLevelPass.test(warnEvent), FilterResults.PASS, 'warning events must be allowed to pass');
    assert.equals(debugLevelPass.test(errorEvent), FilterResults.PASS, 'error events must be allowed to pass');
    assert.equals(debugLevelPass.test(fatalEvent), FilterResults.PASS, 'fatal events must be allowed to pass');

    assert.comment('info level and below');
    assert.ok(infoLevelPass instanceof Filter, 'info level-threshold-filter is a filter');
    assert.equals(infoLevelPass.filter, void 0, 'filter must be undefined');
    assert.equals(infoLevelPass.test(auditEvent), FilterResults.ALLOW, 'audit events must be allowed');
    assert.equals(infoLevelPass.test(debugEvent), FilterResults.ALLOW, 'debug events must be allowed');
    assert.equals(infoLevelPass.test(infoEvent), FilterResults.ALLOW, 'info events must be allowed');
    assert.equals(infoLevelPass.test(warnEvent), FilterResults.PASS, 'warning events must be allowed to pass');
    assert.equals(infoLevelPass.test(errorEvent), FilterResults.PASS, 'error events must be allowed to pass');
    assert.equals(infoLevelPass.test(fatalEvent), FilterResults.PASS, 'fatal events must be allowed to pass');

    assert.comment('warn level and below');
    assert.ok(warnLevelPass instanceof Filter, 'warn level-threshold-filter is a filter');
    assert.equals(warnLevelPass.filter, void 0, 'filter must be undefined');
    assert.equals(warnLevelPass.test(auditEvent), FilterResults.ALLOW, 'audit events must be allowed');
    assert.equals(warnLevelPass.test(debugEvent), FilterResults.ALLOW, 'debug events must be allowed');
    assert.equals(warnLevelPass.test(infoEvent), FilterResults.ALLOW, 'info events must be allowed');
    assert.equals(warnLevelPass.test(warnEvent), FilterResults.ALLOW, 'warning events must be allowed');
    assert.equals(warnLevelPass.test(errorEvent), FilterResults.PASS, 'error events must be allowed to pass');
    assert.equals(warnLevelPass.test(fatalEvent), FilterResults.PASS, 'fatal events must be allowed to pass');

    assert.comment('error level and below');
    assert.ok(errorLevelPass instanceof Filter, 'error level-threshold-filter is a filter');
    assert.equals(errorLevelPass.filter, void 0, 'filter must be undefined');
    assert.equals(errorLevelPass.test(auditEvent), FilterResults.ALLOW, 'audit events must be allowed');
    assert.equals(errorLevelPass.test(debugEvent), FilterResults.ALLOW, 'debug events must be allowed');
    assert.equals(errorLevelPass.test(infoEvent), FilterResults.ALLOW, 'info events must be allowed');
    assert.equals(errorLevelPass.test(warnEvent), FilterResults.ALLOW, 'warning events must be allowed');
    assert.equals(errorLevelPass.test(errorEvent), FilterResults.ALLOW, 'error events must be allowed');
    assert.equals(errorLevelPass.test(fatalEvent), FilterResults.PASS, 'fatal events must be allowed to pass');

    assert.comment('fatal level and below');
    assert.ok(fatalLevelPass instanceof Filter, 'fatal level-threshold-filter is a filter');
    assert.equals(fatalLevelPass.filter, void 0, 'filter must be undefined');
    assert.equals(fatalLevelPass.test(auditEvent), FilterResults.ALLOW, 'audit events must be allowed');
    assert.equals(fatalLevelPass.test(debugEvent), FilterResults.ALLOW, 'debug events must be allowed');
    assert.equals(fatalLevelPass.test(infoEvent), FilterResults.ALLOW, 'info events must be allowed');
    assert.equals(fatalLevelPass.test(warnEvent), FilterResults.ALLOW, 'warning events must be allowed');
    assert.equals(fatalLevelPass.test(errorEvent), FilterResults.ALLOW, 'error events must be allowed');
    assert.equals(fatalLevelPass.test(fatalEvent), FilterResults.ALLOW, 'fatal events must be allowed');
  });

  test('filter level-threshold-filter deny:true', (assert) => {
    const auditLevelDeny = new LevelThresholdFilter(audit, { 'deny': true });
    const debugLevelDeny = new LevelThresholdFilter(debug, { 'deny': true });
    const infoLevelDeny = new LevelThresholdFilter(info, { 'deny': true });
    const warnLevelDeny = new LevelThresholdFilter(warn, { 'deny': true });
    const errorLevelDeny = new LevelThresholdFilter(error, { 'deny': true });
    const fatalLevelDeny = new LevelThresholdFilter(fatal, { 'deny': true });

    assert.comment('audit level and below');
    assert.ok(auditLevelDeny instanceof Filter, 'audit level-threshold-filter is a filter');
    assert.equals(auditLevelDeny.filter, void 0, 'filter must be undefined');
    assert.equals(auditLevelDeny.test(auditEvent), FilterResults.ALLOW, 'audit events must be allowed');
    assert.equals(auditLevelDeny.test(debugEvent), FilterResults.DENY, 'debug events must not be allowed');
    assert.equals(auditLevelDeny.test(infoEvent), FilterResults.DENY, 'info events must not be allowed');
    assert.equals(auditLevelDeny.test(warnEvent), FilterResults.DENY, 'warning events must not be allowed');
    assert.equals(auditLevelDeny.test(errorEvent), FilterResults.DENY, 'error events must not be allowed');
    assert.equals(auditLevelDeny.test(fatalEvent), FilterResults.DENY, 'fatal events must not be allowed');

    assert.comment('debug level and below');
    assert.ok(debugLevelDeny instanceof Filter, 'debug level-threshold-filter is a filter');
    assert.equals(debugLevelDeny.filter, void 0, 'filter must be undefined');
    assert.equals(debugLevelDeny.test(auditEvent), FilterResults.ALLOW, 'audit events must be allowed');
    assert.equals(debugLevelDeny.test(debugEvent), FilterResults.ALLOW, 'debug events must be allowed');
    assert.equals(debugLevelDeny.test(infoEvent), FilterResults.DENY, 'info events must not be allowed');
    assert.equals(debugLevelDeny.test(warnEvent), FilterResults.DENY, 'warning events must not be allowed');
    assert.equals(debugLevelDeny.test(errorEvent), FilterResults.DENY, 'error events must not be allowed');
    assert.equals(debugLevelDeny.test(fatalEvent), FilterResults.DENY, 'fatal events must not be allowed');

    assert.comment('info level and below');
    assert.ok(infoLevelDeny instanceof Filter, 'info level-threshold-filter is a filter');
    assert.equals(infoLevelDeny.filter, void 0, 'filter must be undefined');
    assert.equals(infoLevelDeny.test(auditEvent), FilterResults.ALLOW, 'audit events must be allowed');
    assert.equals(infoLevelDeny.test(debugEvent), FilterResults.ALLOW, 'debug events must be allowed');
    assert.equals(infoLevelDeny.test(infoEvent), FilterResults.ALLOW, 'info events must be allowed');
    assert.equals(infoLevelDeny.test(warnEvent), FilterResults.DENY, 'warning events must not be allowed');
    assert.equals(infoLevelDeny.test(errorEvent), FilterResults.DENY, 'error events must not be allowed');
    assert.equals(infoLevelDeny.test(fatalEvent), FilterResults.DENY, 'fatal events must not be allowed');

    assert.comment('warn level and below');
    assert.ok(warnLevelDeny instanceof Filter, 'warn level-threshold-filter is a filter');
    assert.equals(warnLevelDeny.filter, void 0, 'filter must be undefined');
    assert.equals(warnLevelDeny.test(auditEvent), FilterResults.ALLOW, 'audit events must be allowed');
    assert.equals(warnLevelDeny.test(debugEvent), FilterResults.ALLOW, 'debug events must be allowed');
    assert.equals(warnLevelDeny.test(infoEvent), FilterResults.ALLOW, 'info events must be allowed');
    assert.equals(warnLevelDeny.test(warnEvent), FilterResults.ALLOW, 'warning events must not be allowed');
    assert.equals(warnLevelDeny.test(errorEvent), FilterResults.DENY, 'error events must not be allowed');
    assert.equals(warnLevelDeny.test(fatalEvent), FilterResults.DENY, 'fatal events must not be allowed');

    assert.comment('error level and below');
    assert.ok(errorLevelDeny instanceof Filter, 'error level-threshold-filter is a filter');
    assert.equals(errorLevelDeny.filter, void 0, 'filter must be undefined');
    assert.equals(errorLevelDeny.test(auditEvent), FilterResults.ALLOW, 'audit events must be allowed');
    assert.equals(errorLevelDeny.test(debugEvent), FilterResults.ALLOW, 'debug events must be allowed');
    assert.equals(errorLevelDeny.test(infoEvent), FilterResults.ALLOW, 'info events must be allowed');
    assert.equals(errorLevelDeny.test(warnEvent), FilterResults.ALLOW, 'warning events must be allowed');
    assert.equals(errorLevelDeny.test(errorEvent), FilterResults.ALLOW, 'error events must be allowed');
    assert.equals(errorLevelDeny.test(fatalEvent), FilterResults.DENY, 'fatal events must not be allowed');

    assert.comment('fatal level and below');
    assert.ok(fatalLevelDeny instanceof Filter, 'fatal level-threshold-filter is a filter');
    assert.equals(fatalLevelDeny.filter, void 0, 'filter must be undefined');
    assert.equals(fatalLevelDeny.test(auditEvent), FilterResults.ALLOW, 'audit events must not be allowed');
    assert.equals(fatalLevelDeny.test(debugEvent), FilterResults.ALLOW, 'debug events must not be allowed');
    assert.equals(fatalLevelDeny.test(infoEvent), FilterResults.ALLOW, 'info events must not be allowed');
    assert.equals(fatalLevelDeny.test(warnEvent), FilterResults.ALLOW, 'warning events must not be allowed');
    assert.equals(fatalLevelDeny.test(errorEvent), FilterResults.ALLOW, 'error events must not be allowed');
    assert.equals(fatalLevelDeny.test(fatalEvent), FilterResults.ALLOW, 'fatal events must be allowed');
  });

  test('filter level-threshold-filter locked:false', (assert) => {
    const filter = new LevelThresholdFilter(audit, { 'locked': false });

    assert.comment('audit level and below');
    assert.equals(filter.test(auditEvent), FilterResults.ALLOW, 'audit events must be allowed');
    assert.equals(filter.test(debugEvent), FilterResults.DENY, 'debug events must not be allowed');
    assert.equals(filter.test(infoEvent), FilterResults.DENY, 'info events must not be allowed');
    assert.equals(filter.test(warnEvent), FilterResults.DENY, 'warning events must not be allowed');
    assert.equals(filter.test(errorEvent), FilterResults.DENY, 'error events must not be allowed');
    assert.equals(filter.test(fatalEvent), FilterResults.DENY, 'fatal events must not be allowed');

    assert.comment('does not throw with');
    assert.doesNotThrow(() => { filter.level = warn; }, 'updating the level to warn');
    assert.equals(filter.test(auditEvent), FilterResults.ALLOW, 'audit events must be allowed');
    assert.equals(filter.test(debugEvent), FilterResults.ALLOW, 'debug events must be allowed');
    assert.equals(filter.test(infoEvent), FilterResults.ALLOW, 'info events must be allowed');
    assert.equals(filter.test(warnEvent), FilterResults.ALLOW, 'warning events must be allowed');
    assert.equals(filter.test(errorEvent), FilterResults.DENY, 'error events must not be allowed');
    assert.equals(filter.test(fatalEvent), FilterResults.DENY, 'fatal events must not be allowed');

    assert.doesNotThrow(() => { filter.deny = true; }, 'updating the deny flag');
  });

  test('filter level-threshold-filter locked:true', (assert) => {
    const filter = new LevelThresholdFilter(audit, { 'locked': true });

    assert.comment('audit level and below');
    assert.equals(filter.test(auditEvent), FilterResults.ALLOW, 'audit events must be allowed');
    assert.equals(filter.test(debugEvent), FilterResults.DENY, 'debug events must not be allowed');
    assert.equals(filter.test(infoEvent), FilterResults.DENY, 'info events must not be allowed');
    assert.equals(filter.test(warnEvent), FilterResults.DENY, 'warning events must not be allowed');
    assert.equals(filter.test(errorEvent), FilterResults.DENY, 'error events must not be allowed');
    assert.equals(filter.test(fatalEvent), FilterResults.DENY, 'fatal events must not be allowed');

    assert.comment('throws with');
    assert.throws(() => { filter.level = warn; }, 'updating the level to warn');

    filter.deny = false;
    assert.equals(filter.deny, true, 'updating the deny option');
  });

  test('filter level-threshold-filter special cases', (assert) => {
    const filter = new LevelThresholdFilter(audit, { 'locked': true });

    assert.comment('throws with');
    assert.throws(() => { filter.level = 1; }, 'updating min with an invalid level');
  });
};
