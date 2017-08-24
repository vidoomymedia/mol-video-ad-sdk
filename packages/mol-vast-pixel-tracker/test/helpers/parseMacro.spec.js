import MockDate from 'mockdate';
import parseMacro from '../../src/helpers/parseMacro';

test('parseMacro must replace the passed variables in the macro', () => {
  const macro = 'http://test.example.com/[ERRORCODE]/[BLA]';

  expect(parseMacro(macro, {})).toBe(macro);
  expect(parseMacro(macro, {ERRORCODE: '101'})).toBe('http://test.example.com/101/[BLA]');
  expect(parseMacro(macro, {
    BLA: 'bla',
    ERRORCODE: '101'
  })).toBe('http://test.example.com/101/bla');
});

test('parseMacro must fill the CACHEBUSTING variable if not provided', () => {
  const macro = 'http://test.example.com/[CACHEBUSTING]';

  expect(parseMacro(macro, {})).not.toBe(macro);
  expect(parseMacro(macro, {})).toEqual(expect.stringMatching(/http:\/\/test.example.com\/\d+/));
});

test('parseMacro must not fill the CACHEBUSTING variable if provided', () => {
  const macro = 'http://test.example.com/[CACHEBUSTING]';

  expect(parseMacro(macro, {CACHEBUSTING: 'foo'})).toBe('http://test.example.com/foo');
});

test('parseMacro must percent-encode the replaced macros', () => {
  const macro = 'http://test.example.com/[URL]';

  expect(parseMacro(macro, {URL: 'http://someExample.com'})).toBe('http://test.example.com/http%3A%2F%2FsomeExample.com');
});

test('parseMacro must fill the TIMESTAMP variable if not provided', () => {
  const now = new Date();

  MockDate.set(now);
  const macro = 'http://test.example.com/[TIMESTAMP]';

  global.Date.now = jest.fn(() => now);

  expect(parseMacro(macro, {})).toEqual(`http://test.example.com/${encodeURIComponent(now.toISOString())}`);

  MockDate.reset();
});

test('parseMacro must not provide the TIMESTAMP variable if provided', () => {
  const macro = 'http://test.example.com/[TIMESTAMP]';

  expect(parseMacro(macro, {TIMESTAMP: 'today'})).toBe('http://test.example.com/today');
});
