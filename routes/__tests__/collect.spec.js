// jest.mock('../../services/vocab-collect-service', () => {
//     return {
//         // vocab: (keyword) => {
//         //     let p = new Promise((resolve, reject) => {
//         //         resolve();
//         //     });
//         //     p.resolve();
//         //     return p;
//         // }
//         vocab: (keyword) => console.log('bladibla')
//     }
// });

jest.mock('../collect/service');

const Hapi = require('hapi');


describe('collect -- handler', () => {
    let server;
    let collectService;

    describe('GET', () => {
        beforeEach(() => {
            jest.resetModules();
            server = new Hapi.Server();
            server.connection({ port: 4444 });
            //init routes
            require('../collect/route')(server);
            collectService = require('../collect/service');
        });

        // afterEach(() => {
        //     server.close();
        // });

        it('calls without failing', (done) => {
            server.inject('/collect/1', (res) => {
                expect(res.result).toEqual('success!');
                done();
            });
        });

        it('calls vocab search', (done) => {
            server.inject('/collect/1', (res) => {
                expect(collectService.vocab)
                    .toHaveBeenCalledTimes(1);
                done();
            });
        });

        it('calls the vocab search with 始める', (done) => {
            const keyword = '始める';
            server.inject(`/collect/${keyword}`, (res) => {
                expect(collectService.vocab).toHaveBeenCalledTimes(1);
                expect(collectService.vocab).toBeCalledWith(keyword);
                expect(res.statusCode).toBe(200);
                done();
            });
        });

        it('calls the kanji search with 友達', (done) => {
            const keyword = '友達';
            server.inject(`/collect/${keyword}`, (res) => {
                expect(collectService.vocab).toHaveBeenCalledTimes(1);
                expect(collectService.kanji).toHaveBeenCalledTimes(1);
                expect(res.statusCode).toBe(200);
                done();
            });
        });

        it('calls all methods to search with 友達', (done) => {
            const keyword = '友達';
            server.inject(`/collect/${keyword}`, (res) => {
                expect(collectService.vocab).toHaveBeenCalledTimes(1);
                expect(collectService.kanji).toHaveBeenCalledTimes(1);
                expect(collectService.radical).toHaveBeenCalledTimes(1);
                expect(res.statusCode).toBe(200);
                done();
            });
        });

        


    });
    // it('call GET handler without failing', () => {
    //     const expectedResult = {
    //         vocab: [{
    //             "character": "始める",
    //             "kana": "はじめる",
    //             "meaning": "to start; to begin; to commence; to initiate; to originate"
    //         }],
    //         kanji: [{
    //             "character": "始",
    //             "meaning": "commence, begin",
    //             "kunyomi": "はじ.める, -はじ.める, はじ.まる",
    //             "onyomi": "シ"
    //         }],
    //         radicals: [
    //             { "character": "厶", "meaning": "public" },
    //             { "character": "口", "meaning": "mouth" },
    //             { "character": "女", "meaning": "woman" }
    //         ]
    //     };

    //     let req = jest.fn();
    //     let reply = jest.fn();

    //     handlers.getHandler(req, reply);

    //     expect(reply).toBeCalledWith(expectedResult);
    // });


}); 
