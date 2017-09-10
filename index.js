const Agenda = require('agenda');

const stopAgenda = (agenda, config = {}) => {
  if (!(agenda instanceof Agenda))
    throw new Error('`agenda` must be an instance of Agenda');

  this.config = Object.assign(
    {
      logger: console,
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

  if (typeof this.config.cancelQuery !== 'object')
    throw new Error('`config.cancelQuery` must be a MongoDB query object');

  if (typeof this.config.checkIntervalMs !== 'number')
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
      agenda.cancel(this.config.cancelQuery, (err, numRemoved) => {
        if (err) return reject(err);
        this.config.logger.info(`cancelled ${numRemoved} jobs`);
        resolve();
      });
    }),
    new Promise((resolve, reject) => {
      // check every X ms for jobs still running
      const jobInterval = setInterval(() => {
        if (agenda._runningJobs.length > 0) {
          this.config.logger.info(
            `${agenda._runningJobs.length} jobs still running`
          );
        } else {
          clearInterval(jobInterval);
          // cancel recurring jobs so they get redefined on next server start
          // TODO: once PR is accepted we can take this out
          // <https://github.com/agenda/agenda/pull/501>
          if (!agenda._collection)
            return reject(
              new Error('collection did not exist, see agenda#501')
            );
          agenda.stop(err => {
            if (err) return reject(err);
            resolve();
          });
        }
      }, this.config.checkIntervalMs);
    })
  ]);
};

module.exports = stopAgenda;
