const Promise = require('bluebird');
const xray = require('x-ray')();
const _ = require('lodash');


let vocab = {
    get: (keyword) => {
        return new Promise((resolve, reject) => {
            const url = encodeURIComponent(keyword);
            xray(`http://tangorin.com/general/${url}`, 'div#dictResults dl#dictEntries div.entry', [{
                character: '.writing',
                meaning: 'dd ul li ol li .eng',
                kana: 'dt span.kana ruby rb'
            }])((err, payload) => { 
                if (err) {
                    return reject(err);
                }

                //clean up a bit
                payload = _.map(payload, (data) => {
                    data.meaning = _.trim(data.meaning, ' \n');
                    data.character = _.trim(data.character, ' \n');
                    data.kana = _.trim(data.kana, ' \n');
                    return data;
                });


                payload = _.find(payload, (data) =>{
                    return data.character === keyword
                    || data.kana === keyword
                    || _.includes(data.meaning, keyword)
                    || data.meaning === keyword
                }); 

                resolve(payload);
            });
        });
    }
}

module.exports.vocab = vocab;