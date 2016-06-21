import audit from '../../lib/levels/audit';
import debug from '../../lib/levels/debug';
import info from '../../lib/levels/info';
import warn from '../../lib/levels/warn';
import error from '../../lib/levels/error';
import fatal from '../../lib/levels/fatal';
import { LogEvent } from '../../lib/logger';
import Filter, { FilterResults } from '../../lib/filters/filter';

export default function (test, LevelThresholdFilter) {
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

    assert.comment('audit level and above');
    assert.ok(auditLevel instanceof Filter, 'audit level-threshold-filter is a filter');
    assert.equals(auditLevel.filter, void 0, 'filter must be undefined');
    assert.equals(auditLevel.test(auditEvent), FilterResults.ALLOW, 'audit events must be allowed');
    assert.equals(auditLevel.test(debugEvent), FilterResults.ALLOW, 'debug events must be allowed');
    assert.equals(auditLevel.test(infoEvent), FilterResults.ALLOW, 'info events must be allowed');
    assert.equals(auditLevel.test(warnEvent), FilterResults.ALLOW, 'warning events must be allowed');
    assert.equals(auditLevel.test(errorEvent), FilterResults.ALLOW, 'error events must be allowed');
    assert.equals(auditLevel.test(fatalEvent), FilterResults.ALLOW, 'fatal events must be allowed');

    assert.comment('debug level and above');
    assert.ok(debugLevel instanceof Filter, 'debug level-threshold-filter is a filter');
    assert.equals(debugLevel.filter, void 0, 'filter must be undefined');
    assert.equals(debugLevel.test(auditEvent), FilterResults.DENY, 'audit events must not be allowed');
    assert.equals(debugLevel.test(debugEvent), FilterResults.ALLOW, 'debug events must be allowed');
    assert.equals(debugLevel.test(infoEvent), FilterResults.ALLOW, 'info events must be allowed');
    assert.equals(debugLevel.test(warnEvent), FilterResults.ALLOW, 'warning events must be allowed');
    assert.equals(debugLevel.test(errorEvent), FilterResults.ALLOW, 'error events must be allowed');
    assert.equals(debugLevel.test(fatalEvent), FilterResults.ALLOW, 'fatal events must be allowed');

    assert.comment('info level and above');
    assert.ok(infoLevel instanceof Filter, 'info level-threshold-filter is a filter');
    assert.equals(infoLevel.filter, void 0, 'filter must be undefined');
    assert.equals(infoLevel.test(auditEvent), FilterResults.DENY, 'audit events must not be allowed');
    assert.equals(infoLevel.test(debugEvent), FilterResults.DENY, 'debug events must not be allowed');
    assert.equals(infoLevel.test(infoEvent), FilterResults.ALLOW, 'info events must be allowed');
    assert.equals(infoLevel.test(warnEvent), FilterResults.ALLOW, 'warning events must be allowed');
    assert.equals(infoLevel.test(errorEvent), FilterResults.ALLOW, 'error events must be allowed');
    assert.equals(infoLevel.test(fatalEvent), FilterResults.ALLOW, 'fatal events must be allowed');

    assert.comment('warn level and above');
    assert.ok(warnLevel instanceof Filter, 'warn level-threshold-filter is a filter');
    assert.equals(warnLevel.filter, void 0, 'filter must be undefined');
    assert.equals(warnLevel.test(auditEvent), FilterResults.DENY, 'audit events must not be allowed');
    assert.equals(warnLevel.test(debugEvent), FilterResults.DENY, 'debug events must not be allowed');
    assert.equals(warnLevel.test(infoEvent), FilterResults.DENY, 'info events must not be allowed');
    assert.equals(warnLevel.test(warnEvent), FilterResults.ALLOW, 'warning events must be allowed');
    assert.equals(warnLevel.test(errorEvent), FilterResults.ALLOW, 'error events must be allowed');
    assert.equals(warnLevel.test(fatalEvent), FilterResults.ALLOW, 'fatal events must be allowed');

    assert.comment('error level and above');
    assert.ok(errorLevel instanceof Filter, 'error level-threshold-filter is a filter');
    assert.equals(errorLevel.filter, void 0, 'filter must be undefined');
    assert.equals(errorLevel.test(auditEvent), FilterResults.DENY, 'audit events must not be allowed');
    assert.equals(errorLevel.test(debugEvent), FilterResults.DENY, 'debug events must not be allowed');
    assert.equals(errorLevel.test(infoEvent), FilterResults.DENY, 'info events must not be allowed');
    assert.equals(errorLevel.test(warnEvent), FilterResults.DENY, 'warning events must not be allowed');
    assert.equals(errorLevel.test(errorEvent), FilterResults.ALLOW, 'error events must be allowed');
    assert.equals(errorLevel.test(fatalEvent), FilterResults.ALLOW, 'fatal events must be allowed');

    assert.comment('fatal level and above');
    assert.ok(fatalLevel instanceof Filter, 'fatal level-threshold-filter is a filter');
    assert.equals(fatalLevel.filter, void 0, 'filter must be undefined');
    assert.equals(fatalLevel.test(auditEvent), FilterResults.DENY, 'audit events must not be allowed');
    assert.equals(fatalLevel.test(debugEvent), FilterResults.DENY, 'debug events must not be allowed');
    assert.equals(fatalLevel.test(infoEvent), FilterResults.DENY, 'info events must not be allowed');
    assert.equals(fatalLevel.test(warnEvent), FilterResults.DENY, 'warning events must not be allowed');
    assert.equals(fatalLevel.test(errorEvent), FilterResults.DENY, 'error events must not be allowed');
    assert.equals(fatalLevel.test(fatalEvent), FilterResults.ALLOW, 'fatal events must be allowed');
  });

  test('filter level-threshold-filter deny:false', (assert) => {
    const auditLevelPass = new LevelThresholdFilter(audit, { 'deny': false });
    const debugLevelPass = new LevelThresholdFilter(debug, { 'deny': false });
    const infoLevelPass = new LevelThresholdFilter(info, { 'deny': false });
    const warnLevelPass = new LevelThresholdFilter(warn, { 'deny': false });
    const errorLevelPass = new LevelThresholdFilter(error, { 'deny': false });
    const fatalLevelPass = new LevelThresholdFilter(fatal, { 'deny': false });

    assert.comment('audit level and above');
    assert.ok(auditLevelPass instanceof Filter, 'audit level-threshold-filter is a filter');
    assert.equals(auditLevelPass.filter, void 0, 'filter must be undefined');
    assert.equals(auditLevelPass.test(auditEvent), FilterResults.ALLOW, 'audit events must be allowed');
    assert.equals(auditLevelPass.test(debugEvent), FilterResults.ALLOW, 'debug events must be allowed');
    assert.equals(auditLevelPass.test(infoEvent), FilterResults.ALLOW, 'info events must be allowed');
    assert.equals(auditLevelPass.test(warnEvent), FilterResults.ALLOW, 'warning events must be allowed');
    assert.equals(auditLevelPass.test(errorEvent), FilterResults.ALLOW, 'error events must be allowed');
    assert.equals(auditLevelPass.test(fatalEvent), FilterResults.ALLOW, 'fatal events must be allowed');

    assert.comment('debug level and above');
    assert.ok(debugLevelPass instanceof Filter, 'debug level-threshold-filter is a filter');
    assert.equals(debugLevelPass.filter, void 0, 'filter must be undefined');
    assert.equals(debugLevelPass.test(auditEvent), FilterResults.PASS, 'audit events must be allowed to pass');
    assert.equals(debugLevelPass.test(debugEvent), FilterResults.ALLOW, 'debug events must be allowed');
    assert.equals(debugLevelPass.test(infoEvent), FilterResults.ALLOW, 'info events must be allowed');
    assert.equals(debugLevelPass.test(warnEvent), FilterResults.ALLOW, 'warning events must be allowed');
    assert.equals(debugLevelPass.test(errorEvent), FilterResults.ALLOW, 'error events must be allowed');
    assert.equals(debugLevelPass.test(fatalEvent), FilterResults.ALLOW, 'fatal events must be allowed');

    assert.comment('info level and above');
    assert.ok(infoLevelPass instanceof Filter, 'info level-threshold-filter is a filter');
    assert.equals(infoLevelPass.filter, void 0, 'filter must be undefined');
    assert.equals(infoLevelPass.test(auditEvent), FilterResults.PASS, 'audit events must be allowed to pass');
    assert.equals(infoLevelPass.test(debugEvent), FilterResults.PASS, 'debug events must be allowed to pass');
    assert.equals(infoLevelPass.test(infoEvent), FilterResults.ALLOW, 'info events must be allowed');
    assert.equals(infoLevelPass.test(warnEvent), FilterResults.ALLOW, 'warning events must be allowed');
    assert.equals(infoLevelPass.test(errorEvent), FilterResults.ALLOW, 'error events must be allowed');
    assert.equals(infoLevelPass.test(fatalEvent), FilterResults.ALLOW, 'fatal events must be allowed');

    assert.comment('warn level and above');
    assert.ok(warnLevelPass instanceof Filter, 'warn level-threshold-filter is a filter');
    assert.equals(warnLevelPass.filter, void 0, 'filter must be undefined');
    assert.equals(warnLevelPass.test(auditEvent), FilterResults.PASS, 'audit events must be allowed to pass');
    assert.equals(warnLevelPass.test(debugEvent), FilterResults.PASS, 'debug events must be allowed to pass');
    assert.equals(warnLevelPass.test(infoEvent), FilterResults.PASS, 'info events must be allowed to pass');
    assert.equals(warnLevelPass.test(warnEvent), FilterResults.ALLOW, 'warning events must be allowed');
    assert.equals(warnLevelPass.test(errorEvent), FilterResults.ALLOW, 'error events must be allowed');
    assert.equals(warnLevelPass.test(fatalEvent), FilterResults.ALLOW, 'fatal events must be allowed');

    assert.comment('error level and above');
    assert.ok(errorLevelPass instanceof Filter, 'error level-threshold-filter is a filter');
    assert.equals(errorLevelPass.filter, void 0, 'filter must be undefined');
    assert.equals(errorLevelPass.test(auditEvent), FilterResults.PASS, 'audit events must be allowed to pass');
    assert.equals(errorLevelPass.test(debugEvent), FilterResults.PASS, 'debug events must be allowed to pass');
    assert.equals(errorLevelPass.test(infoEvent), FilterResults.PASS, 'info events must be allowed to pass');
    assert.equals(errorLevelPass.test(warnEvent), FilterResults.PASS, 'warning events must be allowed to pass');
    assert.equals(errorLevelPass.test(errorEvent), FilterResults.ALLOW, 'error events must be allowed');
    assert.equals(errorLevelPass.test(fatalEvent), FilterResults.ALLOW, 'fatal events must be allowed');

    assert.comment('fatal level and above');
    assert.ok(fatalLevelPass instanceof Filter, 'fatal level-threshold-filter is a filter');
    assert.equals(fatalLevelPass.filter, void 0, 'filter must be undefined');
    assert.equals(fatalLevelPass.test(auditEvent), FilterResults.PASS, 'audit events must be allowed to pass');
    assert.equals(fatalLevelPass.test(debugEvent), FilterResults.PASS, 'debug events must be allowed to pass');
    assert.equals(fatalLevelPass.test(infoEvent), FilterResults.PASS, 'info events must be allowed to pass');
    assert.equals(fatalLevelPass.test(warnEvent), FilterResults.PASS, 'warning events must be allowed to pass');
    assert.equals(fatalLevelPass.test(errorEvent), FilterResults.PASS, 'error events must be allowed to pass');
    assert.equals(fatalLevelPass.test(fatalEvent), FilterResults.ALLOW, 'fatal events must be allowed');
  });

  test('filter level-threshold-filter deny:true', (assert) => {
    const auditLevelDeny = new LevelThresholdFilter(audit, { 'deny': true });
    const debugLevelDeny = new LevelThresholdFilter(debug, { 'deny': true });
    const infoLevelDeny = new LevelThresholdFilter(info, { 'deny': true });
    const warnLevelDeny = new LevelThresholdFilter(warn, { 'deny': true });
    const errorLevelDeny = new LevelThresholdFilter(error, { 'deny': true });
    const fatalLevelDeny = new LevelThresholdFilter(fatal, { 'deny': true });

    assert.comment('audit level and above');
    assert.ok(auditLevelDeny instanceof Filter, 'audit level-threshold-filter is a filter');
    assert.equals(auditLevelDeny.filter, void 0, 'filter must be undefined');
    assert.equals(auditLevelDeny.test(auditEvent), FilterResults.ALLOW, 'audit events must be allowed');
    assert.equals(auditLevelDeny.test(debugEvent), FilterResults.ALLOW, 'debug events must be allowed');
    assert.equals(auditLevelDeny.test(infoEvent), FilterResults.ALLOW, 'info events must be allowed');
    assert.equals(auditLevelDeny.test(warnEvent), FilterResults.ALLOW, 'warning events must be allowed');
    assert.equals(auditLevelDeny.test(errorEvent), FilterResults.ALLOW, 'error events must be allowed');
    assert.equals(auditLevelDeny.test(fatalEvent), FilterResults.ALLOW, 'fatal events must be allowed');

    assert.comment('debug level and above');
    assert.ok(debugLevelDeny instanceof Filter, 'debug level-threshold-filter is a filter');
    assert.equals(debugLevelDeny.filter, void 0, 'filter must be undefined');
    assert.equals(debugLevelDeny.test(auditEvent), FilterResults.DENY, 'audit events must not be allowed');
    assert.equals(debugLevelDeny.test(debugEvent), FilterResults.ALLOW, 'debug events must be allowed');
    assert.equals(debugLevelDeny.test(infoEvent), FilterResults.ALLOW, 'info events must be allowed');
    assert.equals(debugLevelDeny.test(warnEvent), FilterResults.ALLOW, 'warning events must be allowed');
    assert.equals(debugLevelDeny.test(errorEvent), FilterResults.ALLOW, 'error events must be allowed');
    assert.equals(debugLevelDeny.test(fatalEvent), FilterResults.ALLOW, 'fatal events must be allowed');

    assert.comment('info level and above');
    assert.ok(infoLevelDeny instanceof Filter, 'info level-threshold-filter is a filter');
    assert.equals(infoLevelDeny.filter, void 0, 'filter must be undefined');
    assert.equals(infoLevelDeny.test(auditEvent), FilterResults.DENY, 'audit events must not be allowed');
    assert.equals(infoLevelDeny.test(debugEvent), FilterResults.DENY, 'debug events must not be allowed');
    assert.equals(infoLevelDeny.test(infoEvent), FilterResults.ALLOW, 'info events must be allowed');
    assert.equals(infoLevelDeny.test(warnEvent), FilterResults.ALLOW, 'warning events must be allowed');
    assert.equals(infoLevelDeny.test(errorEvent), FilterResults.ALLOW, 'error events must be allowed');
    assert.equals(infoLevelDeny.test(fatalEvent), FilterResults.ALLOW, 'fatal events must be allowed');

    assert.comment('warn level and above');
    assert.ok(warnLevelDeny instanceof Filter, 'warn level-threshold-filter is a filter');
    assert.equals(warnLevelDeny.filter, void 0, 'filter must be undefined');
    assert.equals(warnLevelDeny.test(auditEvent), FilterResults.DENY, 'audit events must not be allowed');
    assert.equals(warnLevelDeny.test(debugEvent), FilterResults.DENY, 'debug events must not be allowed');
    assert.equals(warnLevelDeny.test(infoEvent), FilterResults.DENY, 'info events must not be allowed');
    assert.equals(warnLevelDeny.test(warnEvent), FilterResults.ALLOW, 'warning events must be allowed');
    assert.equals(warnLevelDeny.test(errorEvent), FilterResults.ALLOW, 'error events must be allowed');
    assert.equals(warnLevelDeny.test(fatalEvent), FilterResults.ALLOW, 'fatal events must be allowed');

    assert.comment('error level and above');
    assert.ok(errorLevelDeny instanceof Filter, 'error level-threshold-filter is a filter');
    assert.equals(errorLevelDeny.filter, void 0, 'filter must be undefined');
    assert.equals(errorLevelDeny.test(auditEvent), FilterResults.DENY, 'audit events must not be allowed');
    assert.equals(errorLevelDeny.test(debugEvent), FilterResults.DENY, 'debug events must not be allowed');
    assert.equals(errorLevelDeny.test(infoEvent), FilterResults.DENY, 'info events must not be allowed');
    assert.equals(errorLevelDeny.test(warnEvent), FilterResults.DENY, 'warning events must not be allowed');
    assert.equals(errorLevelDeny.test(errorEvent), FilterResults.ALLOW, 'error events must be allowed');
    assert.equals(errorLevelDeny.test(fatalEvent), FilterResults.ALLOW, 'fatal events must be allowed');

    assert.comment('fatal level and above');
    assert.ok(fatalLevelDeny instanceof Filter, 'fatal level-threshold-filter is a filter');
    assert.equals(fatalLevelDeny.filter, void 0, 'filter must be undefined');
    assert.equals(fatalLevelDeny.test(auditEvent), FilterResults.DENY, 'audit events must not be allowed');
    assert.equals(fatalLevelDeny.test(debugEvent), FilterResults.DENY, 'debug events must not be allowed');
    assert.equals(fatalLevelDeny.test(infoEvent), FilterResults.DENY, 'info events must not be allowed');
    assert.equals(fatalLevelDeny.test(warnEvent), FilterResults.DENY, 'warning events must not be allowed');
    assert.equals(fatalLevelDeny.test(errorEvent), FilterResults.DENY, 'error events must not be allowed');
    assert.equals(fatalLevelDeny.test(fatalEvent), FilterResults.ALLOW, 'fatal events must be allowed');
  });
}
