const Promise = require('bluebird');

const vocab = require('./model').vocab;
const kanji = require('./model').kanji;
const radical = require('./model').radical;

const collect = {
    search: (keyword) => new Promise((resolve, reject) => {
        let result = {};

        let isVocabDone = false;
        let isKanjiDone = false;
        let isRadicalDone = false;
        let tryResolve = () => {
            if (isVocabDone && isKanjiDone && isRadicalDone) {
                console.log('going to resolve');
                resolve(result);
            }
        };

        //first search for the vocab details
        vocab.get(keyword).then((vocabResult) => {
            if (!vocabResult) {
                return resolve(result);
            }

            result.vocab = vocabResult;
            isVocabDone = true;
            tryResolve();
        });

        kanji.get(keyword).then((kanjiResult) => {
            result.kanji = kanjiResult;
            isKanjiDone = true;
            tryResolve();
        });

        radical.getByKanji(keyword).then((radicalResult) => {
            result.radical = radicalResult;
            isRadicalDone = true;
            tryResolve();
        });
    }) 
};

module.exports = collect;