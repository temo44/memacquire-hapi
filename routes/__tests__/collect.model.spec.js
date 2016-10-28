
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

    it('should call kanji just fine', (done) => {


    });

    it('searches all kanji of wanikani in the database', () => {

    });

    it('searches online for kanji that aren\'t found by wanikani', () => {

    });

});