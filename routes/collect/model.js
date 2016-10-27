const Promise = require('bluebird');

let vocab = {
    get: (keyword) => new Promise((resolve, reject) => {
        resolve();
    })
}

module.exports.vocab = vocab;