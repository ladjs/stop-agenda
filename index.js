const debug = require('debug')('stop-agenda');

const stopAgenda = (agenda, config = {}) => {
  if (typeof agenda !== 'object')
    throw new Error('`agenda` must be an instance of Agenda');

  config = Object.assign(
    {
      cancelQuery: {
        repeatInterval: {
          $exists: true,
          $ne: null
        }
      },
      checkIntervalMs: 500
    },
    config
  );

  if (typeof config.cancelQuery !== 'object')
    throw new Error('`config.cancelQuery` must be a MongoDB query object');

  if (typeof config.checkIntervalMs !== 'number')
    throw new Error('`config.checkIntervalMs` must be a Number');

  // stop accepting new jobs
  agenda.maxConcurrency(0);

  return Promise.all([
    new Promise((resolve, reject) => {
      // cancel recurring jobs so they get redefined on next server start
      // TODO: once PR is accepted we can take this out
      // <https://github.com/agenda/agenda/pull/501>
      if (!agenda._collection)
        return reject(new Error('collection did not exist, see agenda#501'));
      agenda.cancel(config.cancelQuery, (err, numRemoved) => {
        if (err) return reject(err);
        debug(`cancelled ${numRemoved} jobs`);
        resolve();
      });
    }),
    new Promise((resolve, reject) => {
      // check every X ms for jobs still running
      const jobInterval = setInterval(() => {
        if (agenda._runningJobs.length > 0) {
          debug(`${agenda._runningJobs.length} jobs still running`);
        } else {
          clearInterval(jobInterval);
          // cancel recurring jobs so they get redefined on next server start
          // TODO: once PR is accepted we can take this out
          // <https://github.com/agenda/agenda/pull/501>
          if (!agenda._collection)
            return reject(
              new Error('collection did not exist, see agenda#501')
            );
          debug('attempting to run agenda.stop');
          agenda.stop(err => {
            if (err) return reject(err);
            resolve();
          });
        }
      }, config.checkIntervalMs);
    })
  ]);
};

module.exports = stopAgenda;
