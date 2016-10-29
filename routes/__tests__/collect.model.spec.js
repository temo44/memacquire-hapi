
let vocab = require('../collect/model').vocab;
let kanji = require('../collect/model').kanji;

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
                meaning: 'bicycle',
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
                meaning: 'fish',
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