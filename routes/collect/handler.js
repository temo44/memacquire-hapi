const collect = require('./service');
const Promise = require('bluebird');

module.exports.getHandler = (request, reply) => {
    let keyword = request.params.keyword;

    collect.search(keyword).then(() => {
        reply('success!');
    });
};