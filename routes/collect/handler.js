const collect = require('./service');
const Promise = require('bluebird');

/**
 * GET -- /collect/{keyword}
 */
module.exports.getHandler = (request, reply) => {
    let keyword = request.params.keyword;

    collect.search(keyword).then((data) => {
        reply(data);
    });
};