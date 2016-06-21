import audit from '../../lib/levels/audit';
import debug from '../../lib/levels/debug';
import info from '../../lib/levels/info';
import warn from '../../lib/levels/warn';
import error from '../../lib/levels/error';
import fatal from '../../lib/levels/fatal';
import { LogEvent } from '../../lib/logger';
import Filter, { FilterResults } from '../../lib/filters/filter';

export default function (test, LevelFilter) {
  const auditEvent = new LogEvent('test', audit, 'this is a test');
  const debugEvent = new LogEvent('test', debug, 'this is a test');
  const infoEvent = new LogEvent('test', info, 'this is a test');
  const warnEvent = new LogEvent('test', warn, 'this is a test');
  const errorEvent = new LogEvent('test', error, 'this is a test');
  const fatalEvent = new LogEvent('test', fatal, 'this is a test');

  test('filter level-filter', (assert) => {
    const filter = new LevelFilter(audit);

    assert.throws(() => new LevelFilter({}), 'no level type');
    assert.throws(() => filter.test(void 0), 'undefined events');
    assert.throws(() => filter.test(null), 'null events');
  });

  test('filter level-filter no options', (assert) => {
    const filter = new LevelFilter();
    const filterAudit = new LevelFilter(audit);
    const filterDebug = new LevelFilter(debug);
    const filterInfo = new LevelFilter(info);
    const filterWarn = new LevelFilter(warn);
    const filterError = new LevelFilter(error);
    const filterFatal = new LevelFilter(fatal);

    assert.comment('with no levels');
    assert.ok(filter instanceof Filter, 'audit level-filter is a filter');
    assert.equals(filter.test(auditEvent), FilterResults.DENY, 'audit events must not be allowed');
    assert.equals(filter.test(debugEvent), FilterResults.DENY, 'debug events must not be allowed');
    assert.equals(filter.test(infoEvent), FilterResults.DENY, 'info events must not be allowed');
    assert.equals(filter.test(warnEvent), FilterResults.DENY, 'warn events must not be allowed');
    assert.equals(filter.test(errorEvent), FilterResults.DENY, 'error events must not be allowed');
    assert.equals(filter.test(fatalEvent), FilterResults.DENY, 'fatal events must not be allowed');

    assert.comment('with audit level');
    assert.equals(filterAudit.test(auditEvent), FilterResults.ALLOW, 'audit events must be allowed');
    assert.equals(filterAudit.test(debugEvent), FilterResults.DENY, 'debug events must not be allowed');
    assert.equals(filterAudit.test(infoEvent), FilterResults.DENY, 'info events must not be allowed');
    assert.equals(filterAudit.test(warnEvent), FilterResults.DENY, 'warn events must not be allowed');
    assert.equals(filterAudit.test(errorEvent), FilterResults.DENY, 'error events must not be allowed');
    assert.equals(filterAudit.test(fatalEvent), FilterResults.DENY, 'fatal events must not be allowed');

    assert.comment('with debug level');
    assert.equals(filterDebug.test(auditEvent), FilterResults.DENY, 'audit events must not be allowed');
    assert.equals(filterDebug.test(debugEvent), FilterResults.ALLOW, 'debug events must be allowed');
    assert.equals(filterDebug.test(infoEvent), FilterResults.DENY, 'info events must not be allowed');
    assert.equals(filterDebug.test(warnEvent), FilterResults.DENY, 'warn events must not be allowed');
    assert.equals(filterDebug.test(errorEvent), FilterResults.DENY, 'error events must not be allowed');
    assert.equals(filterDebug.test(fatalEvent), FilterResults.DENY, 'fatal events must not be allowed');

    assert.comment('with info level');
    assert.equals(filterInfo.test(auditEvent), FilterResults.DENY, 'audit events must not be allowed');
    assert.equals(filterInfo.test(debugEvent), FilterResults.DENY, 'debug events must not be allowed');
    assert.equals(filterInfo.test(infoEvent), FilterResults.ALLOW, 'info events must be allowed');
    assert.equals(filterInfo.test(warnEvent), FilterResults.DENY, 'warn events must not be allowed');
    assert.equals(filterInfo.test(errorEvent), FilterResults.DENY, 'error events must not be allowed');
    assert.equals(filterInfo.test(fatalEvent), FilterResults.DENY, 'fatal events must not be allowed');

    assert.comment('with warn level');
    assert.equals(filterWarn.test(auditEvent), FilterResults.DENY, 'audit events must not be allowed');
    assert.equals(filterWarn.test(debugEvent), FilterResults.DENY, 'debug events must not be allowed');
    assert.equals(filterWarn.test(infoEvent), FilterResults.DENY, 'info events must not be allowed');
    assert.equals(filterWarn.test(warnEvent), FilterResults.ALLOW, 'warn events must be allowed');
    assert.equals(filterWarn.test(errorEvent), FilterResults.DENY, 'error events must not be allowed');
    assert.equals(filterWarn.test(fatalEvent), FilterResults.DENY, 'fatal events must not be allowed');

    assert.comment('with error level');
    assert.equals(filterError.test(auditEvent), FilterResults.DENY, 'audit events must not be allowed');
    assert.equals(filterError.test(debugEvent), FilterResults.DENY, 'debug events must not be allowed');
    assert.equals(filterError.test(infoEvent), FilterResults.DENY, 'info events must not be allowed');
    assert.equals(filterError.test(warnEvent), FilterResults.DENY, 'warn events must not be allowed');
    assert.equals(filterError.test(errorEvent), FilterResults.ALLOW, 'error events must be allowed');
    assert.equals(filterError.test(fatalEvent), FilterResults.DENY, 'fatal events must not be allowed');

    assert.comment('with fatal level');
    assert.equals(filterFatal.test(auditEvent), FilterResults.DENY, 'audit events must not be allowed');
    assert.equals(filterFatal.test(debugEvent), FilterResults.DENY, 'debug events must not be allowed');
    assert.equals(filterFatal.test(infoEvent), FilterResults.DENY, 'info events must not be allowed');
    assert.equals(filterFatal.test(warnEvent), FilterResults.DENY, 'warn events must not be allowed');
    assert.equals(filterFatal.test(errorEvent), FilterResults.DENY, 'error events must not be allowed');
    assert.equals(filterFatal.test(fatalEvent), FilterResults.ALLOW, 'fatal events must be allowed');
  });
}
