const Promise = require('bluebird');

const vocab = require('./model').vocab; 

const collect = {
    search: (keyword) => new Promise((resolve, reject) => { 
        vocab.get(keyword).then(() => {
            resolve();
        }); 
    })

}

module.exports = collect;