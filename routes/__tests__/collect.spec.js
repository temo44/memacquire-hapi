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

const Hapi = require('hapi');


describe('collect -- handler', () => {
    let server;

    describe('GET', () => {
        let vocabSearch;
        let request;
        let reply;
        let handlers;

        beforeEach(() => {
            server = new Hapi.Server();
            server.connection({ port: 4444 });
            //init routes
            require('../collect/route')(server);
        });

        afterEach(() => {
            server.stop();
        });

        it('calls without failing', () => {
            server.inject('/collect', (res) => {
                expect(res.result).toEqual('success!');
            });
        });

        // it('calls vocab search', () => {
        //     handlers = require('../collect/handler');

        //     handlers.getHandler(request, reply);

        //     expect(require('../../services/vocab-collect-service').vocab).toBeCalled();
        // });

        // it('calls the vocab search with 始める', () => {
        //     const Promise = require('bluebird');

        //     vocabSearch = jest.fn();
        //     jest.mock('../../services/vocab-collect-service.js', () => { return { vocab: vocabSearch } });
        //     handlers = require('../collect/handler');

        //     handlers.getHandler(request, reply);


        //     expect(vocabSearch).toHaveBeenCalledTimes(1);
        //     expect(vocabSearch).toBeCalledWith('始める');
        // });


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
