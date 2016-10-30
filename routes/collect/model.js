const Promise = require('bluebird');
const xray = require('x-ray')();
const _ = require('lodash');
const models = require('../../models');


let vocab = {
    /**
     * Get a vocab word detail based on keyword. Returns only one object
     * @param keyword {string} a string
     * @return {Promise} vocab details
     */
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
                    data.meaning = _.split(data.meaning, ';');
                    data.meaning = _.map(data.meaning, (meaning) => _.trim(meaning));
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
    /**
     * Get kanji details on either a string or array of kanji characters
     * @param {keyword} can be either a string or array of strings
     */
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

const radical = {
    /**
     * Collect radicals by their respective characters
     * @param {kanjiCharacters} List of kanji to search for radicals
     */
    getByKanji: (kanjiCharacters) => {
        return new Promise((resolve, reject) => { 
            if(!kanjiCharacters) {
                return resolve([]);
            }

            if(typeof kanjiCharacters === 'string') {
                kanjiCharacters = _.split(kanjiCharacters, '');
            }

            models.KanjiRadical.findAll({
                where: {
                    kanji: {
                        $in: kanjiCharacters
                    }
                },
                order: [
                    ['kanji', 'ASC']
                ]
            }).then(kanjiRadicals => {
                kanjiRadicals = _.map(kanjiRadicals, (rad) => {
                    return {
                        kanji: rad.kanji,
                        character: rad.radical,
                        characterImageUrl: rad.radicalImage,
                        meaning: _.toLower(rad.radicalMeaning)
                    }
                })

                resolve(kanjiRadicals);
            });
        });
    }
}

module.exports.vocab = vocab;
module.exports.kanji = kanji;
module.exports.radical = radical;