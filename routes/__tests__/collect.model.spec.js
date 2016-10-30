
let vocab = require('../collect/model').vocab;
let kanji = require('../collect/model').kanji;
let radical = require('../collect/model').radical;

describe('collect - model - vocab', () => {

    it('is callable', (done) => {
        vocab.get('hallo').then(() => {
            done();
        });
    });

    it('retrieves vocab data from external source', (done) => {
        vocab.get('自転車').then(result => {
            expect(result).toEqual({
                character: '自転車',
                meaning: ['bicycle'],
                kana: 'じてんしゃ'
            });
            done();
        });
    });

    it('returns undefined when nothing is found', (done) => {
        vocab.get('dklfjsl').then(result => {
            expect(result).toBeUndefined();
            done();
        });
    });

    it('can search for an english word', (done) => {
        vocab.get('fish').then(result => {
            expect(result).toEqual({
                character: '魚',
                meaning: ['fish'],
                kana: 'さかな'
            });

            done();
        });
    });

});

describe('collect - model - kanji', () => {

    it('calls kanji just fine', (done) => {
        kanji.get('出口').then((result) => {
            done();
        });
    });

    it('searches all kanji of wanikani on the web', (done) => {
        kanji.get('出口').then((result) => {
            expect(result).toEqual([{
                "character": "出",
                "kunyomi": ["で.る", "-で", "だ.す", "-だ.す", "い.でる", "い.だす"],
                "meaning": ["exit", "leave", "go out", "come out", "put out", "protrude"],
                "onyomi": ["シュツ", "スイ"],
                "parts": ["｜", "山"]
            }, {
                "character": "口",
                "kunyomi": ["くち"],
                "meaning": ["mouth"],
                "onyomi": ["コウ", "ク"],
                "parts": ["口", "囗"]
            }]
            );
            done();
        });
    });

    it('gives an undefined when nothing found on kanji', (done) => {
        kanji.get('lskdjflsdkfj').then((result) => {
            expect(result).toEqual([]);
            done();
        })
    });
});

describe('collect - model - radical', () => {
    it('calls method just fine', (done) => {
        radical.getByKanji(['出', '口']).then(() => {
            done();
        });
    });

    it('fetches the radicals per kanji', (done) => {
        radical.getByKanji(['出']).then((result) => {
            let expectedResult = [{
                kanji: '出',
                character: '山',
                characterImageUrl: null,
                meaning: 'mountain'
            }];

            expect(result).toEqual(expectedResult);
            done();
        });
    });

    it('can also fetch radical for a string, not only arrays', (done) => {
        radical.getByKanji('日').then((result) => {
            let expectedResult = [{
                kanji: '日',
                character: '日',
                characterImageUrl: null,
                meaning: 'sun'
            }];

            expect(result).toEqual(expectedResult);
            done();
        });
    });

    it('retrieves the image url when a weird radical is being retreived', (done) => {
        radical.getByKanji(['館']).then((result) => {
            let expectedResult = [
                {
                    "character": "食", "characterImageUrl": null,
                    "kanji": "館",
                    "meaning": "eat"
                }, {
                    "character": null,
                    "characterImageUrl": "https://s3.amazonaws.com/s3.wanikani.com/images/radicals/b28490c3120f080ee2a5e3e1700d581d671d5bd7.png",
                    "kanji": "館",
                    "meaning": "bear"
                }, {
                    "character": "宀",
                    "characterImageUrl": null,
                    "kanji": "館",
                    "meaning": "helmet"
                }];

            expect(result).toEqual(expectedResult);
            done();
        });
    });

    it('retrieves an empty array when nothing is found', (done) => {
        let expectedResult = [];

        radical.getByKanji('skldfjsld;f').then(result => {
            expect(result).toEqual(expectedResult); 
            done();
        }); 
    });

});