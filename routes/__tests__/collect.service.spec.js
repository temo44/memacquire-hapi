describe('collect -- service', () => {
    const collect = require('../collect/service');

    describe('search', () => {
        it('can call function just fine', (done) => {
            let keyword = 'pow!';

            collect.search(keyword).then(() => {
                done();
            });
        });

        it('at least calls vocab func', (done) => {
            let keyword = '具合';

            collect.search(keyword).then((result) => {
                let expectedResult = {
                    vocab: {
                        character: '具合',
                        meaning: ['condition', 'state', 'manner', 'health'],
                        kana: 'ぐあい'
                    },
                    kanji: [{
                        character: '具',
                        meaning: ['tool', 'utensil', 'means', 'possess', 'ingredients', 'counter for armor', 'suits', 'sets of furniture'],
                        kunyomi: ['そな.える', 'つぶさ.に'],
                        onyomi: ['グ'],
                        parts: ['ハ', '目', '一']
                    },
                    {
                        character: '合',
                        meaning: ['fit', 'suit', 'join', '0.1'],
                        kunyomi: ['あ.う', '-あ.う', 'あ.い', 'あい-', '-あ.い', '-あい', 'あ.わす', 'あ.わせる', '-あ.わせる'],
                        onyomi: ['ゴウ', 'ガッ', 'カッ'],
                        parts: ['个', '口', '一']
                    }],
                    radical: [{
                        kanji: '具',
                        character: '目',
                        characterImageUrl: null,
                        meaning: 'eye'
                    }, {
                        kanji: '具',
                        character: 'ハ',
                        characterImageUrl: null,
                        meaning: 'fins'
                    }, {
                        kanji: '具',
                        character: '一',
                        characterImageUrl: null,
                        meaning: 'ground'
                    }, {
                        kanji: '合',
                        character: '合',
                        characterImageUrl: null,
                        meaning: 'suit'
                    }]
                }

                expect(result).toEqual(expectedResult);
                done();
            });
        });
    });
});