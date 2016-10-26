const collect = require('./service');
const Promise = require('bluebird');

module.exports.getHandler = (request, reply) => {
    let searchQuery = request.params.keyword;

    let actions = [
        collect.vocab(searchQuery),
        collect.kanji(searchQuery),
        collect.radical(searchQuery)
    ];

    Promise.all(actions).then(() => {
        reply('success!');
    }); 
}