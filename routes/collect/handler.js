const collect = require('../../services/vocab-collect-service');
const Promise = require('bluebird');

module.exports.getHandler = (request, reply) => {
    let searchQuery = request.params.keyword;

    Promise.all([collect.vocab(searchQuery)]).then(() => {
        reply('success!');
    }); 
}