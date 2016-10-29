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


                payload = _.find(payload, (data) => {
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

const kanji = {
    get: (keyword) => {
        return new Promise((resolve, reject) => {
            const url = encodeURIComponent(keyword);
            xray(`http://jisho.org/search/${url}%20%23kanji`, {
                kanji: xray('div.kanji.details', [{
                    character: '.character',
                    meaning: '.kanji-details__main-meanings',
                    kunyomi: ['.kanji-details__main-readings .kun_yomi dd a'],
                    onyomi: ['.kanji-details__main-readings .on_yomi dd a'],
                    parts: ['.radicals dd a']
                }]),
            })
                ((err, payload) => {
                    if (err) {
                        reject(err);
                    }

                    //clean up a bit
                    payload = _.map(payload.kanji, (row) => {
                        row.meaning = _.trim(row.meaning, ' \n');
                        row.meaning = _.split(row.meaning, ', ');
                        return row;
                    });

                    resolve(payload);
                });
        });
    }
}

module.exports.vocab = vocab;
module.exports.kanji = kanji;