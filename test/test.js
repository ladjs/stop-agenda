const test = require('ava');
const Agenda = require('agenda');

const stopAgenda = require('../');

test('returns a function', t => {
  t.true(typeof stopAgenda === 'function');
});

test('throws with invalid agenda instance', t => {
  const error = t.throws(() => {
    stopAgenda(false);
  });
  t.regex(error.message, /must be an instance of Agenda/);
});

test('throws with invalid cancelQuery', t => {
  const error = t.throws(() => {
    stopAgenda(new Agenda(), {
      cancelQuery: false
    });
  });
  t.regex(error.message, /must be a MongoDB query/);
});

test('throws with invalid checkIntervalMs', t => {
  const error = t.throws(() => {
    stopAgenda(new Agenda(), {
      checkIntervalMs: false
    });
  });
  t.regex(error.message, /must be a Number/);
});
