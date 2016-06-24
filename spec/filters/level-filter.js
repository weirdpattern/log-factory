/**
 * @author Patricio Trevino
 */

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
    assert.doesNotThrow(() => { filter.deny = true; }, 'changing the deny flag is allowed');
    assert.doesNotThrow(() => { filter.levels.length = 0; }, 'changing the levels variable');

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

  test('filter level-filter deny:false', (assert) => {
    const filterPass = new LevelFilter(null, { 'deny': false });
    const filterAuditPass = new LevelFilter(audit, { 'deny': false });
    const filterDebugPass = new LevelFilter(debug, { 'deny': false });
    const filterInfoPass = new LevelFilter(info, { 'deny': false });
    const filterWarnPass = new LevelFilter(warn, { 'deny': false });
    const filterErrorPass = new LevelFilter(error, { 'deny': false });
    const filterFatalPass = new LevelFilter(fatal, { 'deny': false });

    assert.comment('with no levels');
    assert.ok(filterPass instanceof Filter, 'audit level-filter is a filter');
    assert.equals(filterPass.test(auditEvent), FilterResults.PASS, 'audit events must be allowed to pass');
    assert.equals(filterPass.test(debugEvent), FilterResults.PASS, 'debug events must be allowed to pass');
    assert.equals(filterPass.test(infoEvent), FilterResults.PASS, 'info events must be allowed to pass');
    assert.equals(filterPass.test(warnEvent), FilterResults.PASS, 'warn events must be allowed to pass');
    assert.equals(filterPass.test(errorEvent), FilterResults.PASS, 'error events must be allowed to pass');
    assert.equals(filterPass.test(fatalEvent), FilterResults.PASS, 'fatal events must be allowed to pass');
    assert.doesNotThrow(() => { filterPass.deny = true; }, 'changing the deny flag is allowed');
    assert.doesNotThrow(() => { filterPass.levels.length = 0; }, 'changing the levels variable');

    assert.comment('with audit level');
    assert.equals(filterAuditPass.test(auditEvent), FilterResults.ALLOW, 'audit events must be allowed');
    assert.equals(filterAuditPass.test(debugEvent), FilterResults.PASS, 'debug events must be allowed to pass');
    assert.equals(filterAuditPass.test(infoEvent), FilterResults.PASS, 'info events must be allowed to pass');
    assert.equals(filterAuditPass.test(warnEvent), FilterResults.PASS, 'warn events must be allowed to pass');
    assert.equals(filterAuditPass.test(errorEvent), FilterResults.PASS, 'error events must be allowed to pass');
    assert.equals(filterAuditPass.test(fatalEvent), FilterResults.PASS, 'fatal events must be allowed to pass');

    assert.comment('with debug level');
    assert.equals(filterDebugPass.test(auditEvent), FilterResults.PASS, 'audit events must be allowed to pass');
    assert.equals(filterDebugPass.test(debugEvent), FilterResults.ALLOW, 'debug events must be allowed');
    assert.equals(filterDebugPass.test(infoEvent), FilterResults.PASS, 'info events must be allowed to pass');
    assert.equals(filterDebugPass.test(warnEvent), FilterResults.PASS, 'warn events must be allowed to pass');
    assert.equals(filterDebugPass.test(errorEvent), FilterResults.PASS, 'error events must be allowed to pass');
    assert.equals(filterDebugPass.test(fatalEvent), FilterResults.PASS, 'fatal events must be allowed to pass');

    assert.comment('with info level');
    assert.equals(filterInfoPass.test(auditEvent), FilterResults.PASS, 'audit events must be allowed to pass');
    assert.equals(filterInfoPass.test(debugEvent), FilterResults.PASS, 'debug events must be allowed to pass');
    assert.equals(filterInfoPass.test(infoEvent), FilterResults.ALLOW, 'info events must be allowed');
    assert.equals(filterInfoPass.test(warnEvent), FilterResults.PASS, 'warn events must be allowed to pass');
    assert.equals(filterInfoPass.test(errorEvent), FilterResults.PASS, 'error events must be allowed to pass');
    assert.equals(filterInfoPass.test(fatalEvent), FilterResults.PASS, 'fatal events must be allowed to pass');

    assert.comment('with warn level');
    assert.equals(filterWarnPass.test(auditEvent), FilterResults.PASS, 'audit events must be allowed to pass');
    assert.equals(filterWarnPass.test(debugEvent), FilterResults.PASS, 'debug events must be allowed to pass');
    assert.equals(filterWarnPass.test(infoEvent), FilterResults.PASS, 'info events must be allowed to pass');
    assert.equals(filterWarnPass.test(warnEvent), FilterResults.ALLOW, 'warn events must be allowed');
    assert.equals(filterWarnPass.test(errorEvent), FilterResults.PASS, 'error events must be allowed to pass');
    assert.equals(filterWarnPass.test(fatalEvent), FilterResults.PASS, 'fatal events must be allowed to pass');

    assert.comment('with error level');
    assert.equals(filterErrorPass.test(auditEvent), FilterResults.PASS, 'audit events must be allowed to pass');
    assert.equals(filterErrorPass.test(debugEvent), FilterResults.PASS, 'debug events must be allowed to pass');
    assert.equals(filterErrorPass.test(infoEvent), FilterResults.PASS, 'info events must be allowed to pass');
    assert.equals(filterErrorPass.test(warnEvent), FilterResults.PASS, 'warn events must be allowed to pass');
    assert.equals(filterErrorPass.test(errorEvent), FilterResults.ALLOW, 'error events must be allowed');
    assert.equals(filterErrorPass.test(fatalEvent), FilterResults.PASS, 'fatal events must be allowed to pass');

    assert.comment('with fatal level');
    assert.equals(filterFatalPass.test(auditEvent), FilterResults.PASS, 'audit events must be allowed to pass');
    assert.equals(filterFatalPass.test(debugEvent), FilterResults.PASS, 'debug events must be allowed to pass');
    assert.equals(filterFatalPass.test(infoEvent), FilterResults.PASS, 'info events must be allowed to pass');
    assert.equals(filterFatalPass.test(warnEvent), FilterResults.PASS, 'warn events must be allowed to pass');
    assert.equals(filterFatalPass.test(errorEvent), FilterResults.PASS, 'error events must be allowed to pass');
    assert.equals(filterFatalPass.test(fatalEvent), FilterResults.ALLOW, 'fatal events must be allowed');
  });

  test('filter level-filter deny:true', (assert) => {
    const filterPass = new LevelFilter(null, { 'deny': true });
    const filterAuditPass = new LevelFilter(audit, { 'deny': true });
    const filterDebugPass = new LevelFilter(debug, { 'deny': true });
    const filterInfoPass = new LevelFilter(info, { 'deny': true });
    const filterWarnPass = new LevelFilter(warn, { 'deny': true });
    const filterErrorPass = new LevelFilter(error, { 'deny': true });
    const filterFatalPass = new LevelFilter(fatal, { 'deny': true });

    assert.comment('with no levels');
    assert.ok(filterPass instanceof Filter, 'audit level-filter is a filter');
    assert.equals(filterPass.test(auditEvent), FilterResults.DENY, 'audit events must not be allowed');
    assert.equals(filterPass.test(debugEvent), FilterResults.DENY, 'debug events must not be allowed');
    assert.equals(filterPass.test(infoEvent), FilterResults.DENY, 'info events must not be allowed');
    assert.equals(filterPass.test(warnEvent), FilterResults.DENY, 'warn events must not be allowed');
    assert.equals(filterPass.test(errorEvent), FilterResults.DENY, 'error events must not be allowed');
    assert.equals(filterPass.test(fatalEvent), FilterResults.DENY, 'fatal events must not be allowed');

    assert.comment('with audit level');
    assert.equals(filterAuditPass.test(auditEvent), FilterResults.ALLOW, 'audit events must be allowed');
    assert.equals(filterAuditPass.test(debugEvent), FilterResults.DENY, 'debug events must not be allowed');
    assert.equals(filterAuditPass.test(infoEvent), FilterResults.DENY, 'info events must not be allowed');
    assert.equals(filterAuditPass.test(warnEvent), FilterResults.DENY, 'warn events must not be allowed');
    assert.equals(filterAuditPass.test(errorEvent), FilterResults.DENY, 'error events must not be allowed');
    assert.equals(filterAuditPass.test(fatalEvent), FilterResults.DENY, 'fatal events must not be allowed');

    assert.comment('with debug level');
    assert.equals(filterDebugPass.test(auditEvent), FilterResults.DENY, 'audit events must not be allowed');
    assert.equals(filterDebugPass.test(debugEvent), FilterResults.ALLOW, 'debug events must be allowed');
    assert.equals(filterDebugPass.test(infoEvent), FilterResults.DENY, 'info events must not be allowed');
    assert.equals(filterDebugPass.test(warnEvent), FilterResults.DENY, 'warn events must not be allowed');
    assert.equals(filterDebugPass.test(errorEvent), FilterResults.DENY, 'error events must not be allowed');
    assert.equals(filterDebugPass.test(fatalEvent), FilterResults.DENY, 'fatal events must not be allowed');

    assert.comment('with info level');
    assert.equals(filterInfoPass.test(auditEvent), FilterResults.DENY, 'audit events must not be allowed');
    assert.equals(filterInfoPass.test(debugEvent), FilterResults.DENY, 'debug events must not be allowed');
    assert.equals(filterInfoPass.test(infoEvent), FilterResults.ALLOW, 'info events must be allowed');
    assert.equals(filterInfoPass.test(warnEvent), FilterResults.DENY, 'warn events must not be allowed');
    assert.equals(filterInfoPass.test(errorEvent), FilterResults.DENY, 'error events must not be allowed');
    assert.equals(filterInfoPass.test(fatalEvent), FilterResults.DENY, 'fatal events must not be allowed');

    assert.comment('with warn level');
    assert.equals(filterWarnPass.test(auditEvent), FilterResults.DENY, 'audit events must not be allowed');
    assert.equals(filterWarnPass.test(debugEvent), FilterResults.DENY, 'debug events must not be allowed');
    assert.equals(filterWarnPass.test(infoEvent), FilterResults.DENY, 'info events must not be allowed');
    assert.equals(filterWarnPass.test(warnEvent), FilterResults.ALLOW, 'warn events must be allowed');
    assert.equals(filterWarnPass.test(errorEvent), FilterResults.DENY, 'error events must not be allowed');
    assert.equals(filterWarnPass.test(fatalEvent), FilterResults.DENY, 'fatal events must not be allowed');

    assert.comment('with error level');
    assert.equals(filterErrorPass.test(auditEvent), FilterResults.DENY, 'audit events must not be allowed');
    assert.equals(filterErrorPass.test(debugEvent), FilterResults.DENY, 'debug events must not be allowed');
    assert.equals(filterErrorPass.test(infoEvent), FilterResults.DENY, 'info events must not be allowed');
    assert.equals(filterErrorPass.test(warnEvent), FilterResults.DENY, 'warn events must not be allowed');
    assert.equals(filterErrorPass.test(errorEvent), FilterResults.ALLOW, 'error events must be allowed');
    assert.equals(filterErrorPass.test(fatalEvent), FilterResults.DENY, 'fatal events must not be allowed');

    assert.comment('with fatal level');
    assert.equals(filterFatalPass.test(auditEvent), FilterResults.DENY, 'audit events must not be allowed');
    assert.equals(filterFatalPass.test(debugEvent), FilterResults.DENY, 'debug events must not be allowed');
    assert.equals(filterFatalPass.test(infoEvent), FilterResults.DENY, 'info events must not be allowed');
    assert.equals(filterFatalPass.test(warnEvent), FilterResults.DENY, 'warn events must not be allowed');
    assert.equals(filterFatalPass.test(errorEvent), FilterResults.DENY, 'error events must not be allowed');
    assert.equals(filterFatalPass.test(fatalEvent), FilterResults.ALLOW, 'fatal events must be allowed');
  });

  test('filter level-filter locked:false', (assert) => {
    const filter = new LevelFilter(null, { 'locked': false });

    assert.comment('with no levels');
    assert.ok(filter instanceof Filter, 'audit level-filter is a filter');
    assert.equals(filter.test(auditEvent), FilterResults.DENY, 'audit events must not be allowed');
    assert.equals(filter.test(debugEvent), FilterResults.DENY, 'debug events must not be allowed');
    assert.equals(filter.test(infoEvent), FilterResults.DENY, 'info events must not be allowed');
    assert.equals(filter.test(warnEvent), FilterResults.DENY, 'warn events must not be allowed');
    assert.equals(filter.test(errorEvent), FilterResults.DENY, 'error events must not be allowed');
    assert.equals(filter.test(fatalEvent), FilterResults.DENY, 'fatal events must not be allowed');

    assert.comment('does not throw with');
    assert.doesNotThrow(() => filter.addLevel(audit), 'adding a audit level');
    assert.equals(filter.test(auditEvent), FilterResults.ALLOW, 'audit events must be allowed');
    assert.equals(filter.test(debugEvent), FilterResults.DENY, 'debug events must not be allowed');
    assert.equals(filter.test(infoEvent), FilterResults.DENY, 'info events must not be allowed');
    assert.equals(filter.test(warnEvent), FilterResults.DENY, 'warn events must not be allowed');
    assert.equals(filter.test(errorEvent), FilterResults.DENY, 'error events must not be allowed');
    assert.equals(filter.test(fatalEvent), FilterResults.DENY, 'fatal events must not be allowed');

    assert.doesNotThrow(() => filter.addLevel(debug), 'adding a debug level');
    assert.equals(filter.test(auditEvent), FilterResults.ALLOW, 'audit events must be allowed');
    assert.equals(filter.test(debugEvent), FilterResults.ALLOW, 'debug events must be allowed');
    assert.equals(filter.test(infoEvent), FilterResults.DENY, 'info events must not be allowed');
    assert.equals(filter.test(warnEvent), FilterResults.DENY, 'warn events must not be allowed');
    assert.equals(filter.test(errorEvent), FilterResults.DENY, 'error events must not be allowed');
    assert.equals(filter.test(fatalEvent), FilterResults.DENY, 'fatal events must not be allowed');

    assert.doesNotThrow(() => filter.addLevel(info), 'adding a info level');
    assert.equals(filter.test(auditEvent), FilterResults.ALLOW, 'audit events must be allowed');
    assert.equals(filter.test(debugEvent), FilterResults.ALLOW, 'debug events must be allowed');
    assert.equals(filter.test(infoEvent), FilterResults.ALLOW, 'info events must be allowed');
    assert.equals(filter.test(warnEvent), FilterResults.DENY, 'warn events must not be allowed');
    assert.equals(filter.test(errorEvent), FilterResults.DENY, 'error events must not be allowed');
    assert.equals(filter.test(fatalEvent), FilterResults.DENY, 'fatal events must not be allowed');

    assert.doesNotThrow(() => filter.addLevel(warn), 'adding a warn level');
    assert.equals(filter.test(auditEvent), FilterResults.ALLOW, 'audit events must be allowed');
    assert.equals(filter.test(debugEvent), FilterResults.ALLOW, 'debug events must be allowed');
    assert.equals(filter.test(infoEvent), FilterResults.ALLOW, 'info events must be allowed');
    assert.equals(filter.test(warnEvent), FilterResults.ALLOW, 'warn events must be allowed');
    assert.equals(filter.test(errorEvent), FilterResults.DENY, 'error events must not be allowed');
    assert.equals(filter.test(fatalEvent), FilterResults.DENY, 'fatal events must not be allowed');

    assert.doesNotThrow(() => filter.addLevel(error), 'adding a error level');
    assert.equals(filter.test(auditEvent), FilterResults.ALLOW, 'audit events must be allowed');
    assert.equals(filter.test(debugEvent), FilterResults.ALLOW, 'debug events must be allowed');
    assert.equals(filter.test(infoEvent), FilterResults.ALLOW, 'info events must be allowed');
    assert.equals(filter.test(warnEvent), FilterResults.ALLOW, 'warn events must be allowed');
    assert.equals(filter.test(errorEvent), FilterResults.ALLOW, 'error events must be allowed');
    assert.equals(filter.test(fatalEvent), FilterResults.DENY, 'fatal events must not be allowed');

    assert.doesNotThrow(() => filter.addLevel(fatal), 'adding a fatal level');
    assert.equals(filter.test(auditEvent), FilterResults.ALLOW, 'audit events must be allowed');
    assert.equals(filter.test(debugEvent), FilterResults.ALLOW, 'debug events must be allowed');
    assert.equals(filter.test(infoEvent), FilterResults.ALLOW, 'info events must be allowed');
    assert.equals(filter.test(warnEvent), FilterResults.ALLOW, 'warn events must be allowed');
    assert.equals(filter.test(errorEvent), FilterResults.ALLOW, 'error events must be allowed');
    assert.equals(filter.test(fatalEvent), FilterResults.ALLOW, 'fatal events must be allowed');
  });

  test('filter level-filter locked:true', (assert) => {
    const filter = new LevelFilter(null, { 'locked': true });

    assert.comment('with no levels');
    assert.ok(filter instanceof Filter, 'audit level-filter is a filter');
    assert.equals(filter.test(auditEvent), FilterResults.DENY, 'audit events must not be allowed');
    assert.equals(filter.test(debugEvent), FilterResults.DENY, 'debug events must not be allowed');
    assert.equals(filter.test(infoEvent), FilterResults.DENY, 'info events must not be allowed');
    assert.equals(filter.test(warnEvent), FilterResults.DENY, 'warn events must not be allowed');
    assert.equals(filter.test(errorEvent), FilterResults.DENY, 'error events must not be allowed');
    assert.equals(filter.test(fatalEvent), FilterResults.DENY, 'fatal events must not be allowed');

    assert.comment('throws with');
    assert.throws(() => filter.addLevel(audit), 'adding a level');
    assert.throws(() => filter.removeLevel(audit), 'removing a level');
    assert.throws(() => filter.clearLevels(), 'clearing all levels');
    assert.throws(() => { filter.levels.push(debug); }, 'updating the levels variable');

    assert.throws(() => { filter.levels.length = 5; }, 'updating the levels variable');
    assert.throws(() => { filter.deny = false; }, 'updating the deny option');
  });

  test('filter level-filter adding new levels', (assert) => {
    const filter = new LevelFilter(null);

    assert.comment('adding a single level');
    assert.equals(filter.levels.length, 0, 'levels length is 0');
    assert.doesNotThrow(() => filter.addLevel(audit), 'adding single level is allowed');
    assert.equals(filter.levels.length, 1, 'levels length is 1');

    assert.comment('adding multiple levels');
    assert.doesNotThrow(() => filter.addLevel([ debug, info ]), 'adding multiple levels is allowed');
    assert.equals(filter.levels.length, 3, 'levels length is 3');

    assert.comment('adding something other than level objects');
    assert.throws(() => filter.addLevel(1), 'adding 1 should throw an exception');
    assert.throws(() => filter.addLevel([ 'hi', new Date() ]), 'adding other items should throw an exception');
  });

  test('filter level-filter removing levels', (assert) => {
    const filter = new LevelFilter([ audit, debug, info, warn, error, fatal ]);

    assert.comment('throws with');
    assert.equals(filter.levels.length, 6, 'levels length is 6');
    assert.throws(() => filter.removeLevel(1), 'removing non strings or levels is not allowed');
    assert.equals(filter.levels.length, 6, 'levels length is 6');

    assert.comment('does not throw with');
    assert.equals(filter.levels.length, 6, 'levels length is 6');
    assert.doesNotThrow(() => filter.removeLevel([ 1, audit ]),
      'removing non strings or levels is not allowed, but will not fail if at least one level');
    assert.equals(filter.levels.length, 5, 'levels length is 5');
    assert.doesNotThrow(() => filter.removeLevel([ 1, 'debug' ]),
      'removing non strings or levels is not allowed, but will not fail if at least one string');
    assert.equals(filter.levels.length, 4, 'levels length is 4');

    filter.addLevel([ audit, debug ]);

    assert.comment('removing a single level by level');
    assert.equals(filter.levels.length, 6, 'levels length is 6');
    assert.doesNotThrow(() => filter.removeLevel(audit), 'removing single level by level is allowed');
    assert.equals(filter.levels.length, 5, 'levels length is 5');

    assert.comment('removing a single level by name');
    assert.doesNotThrow(() => filter.removeLevel('debug'), 'removing single level by name is allowed');
    assert.equals(filter.levels.length, 4, 'levels length is 4');

    assert.comment('removing multiple levels by level');
    assert.doesNotThrow(() => filter.removeLevel([ info, warn ]), 'removing multiple levels by level is allowed');
    assert.equals(filter.levels.length, 2, 'levels length is 2');

    assert.comment('removing multiple levels by name');
    assert.doesNotThrow(() => filter.removeLevel([ 'error', 'fatal' ]), 'removing multiple levels by name is allowed');
    assert.equals(filter.levels.length, 0, 'levels length is 0');
  });

  test('filter level-filter removing levels', (assert) => {
    const filter = new LevelFilter([ audit, debug, info, warn, error, fatal ]);

    assert.comment('clearing all levels');
    assert.equals(filter.levels.length, 6, 'levels length is 6');
    assert.doesNotThrow(() => filter.clearLevels(), 'clearing all levels is allowed');
    assert.equals(filter.levels.length, 0, 'levels length is 0');
  });
}
