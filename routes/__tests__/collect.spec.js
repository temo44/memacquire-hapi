const Promise = require('bluebird');
const Hapi = require('hapi');

const mockFn = jest.fn();
jest.mock('../collect/service', () => {
    return {
        search: (keyword) => new Promise((resolve, reject) => {
            mockFn(keyword);
            resolve();
        })
    }
});

describe('collect -- handler', () => {
    let server;
    let collectService;

    describe('GET', () => {
        beforeEach(() => {
            jest.resetModules();
            mockFn.mockClear();
            server = new Hapi.Server();
            server.connection({ port: 4444 });
            //init routes
            require('../collect/route')(server);
        });
        
        it('calls without failing', (done) => {
            server.inject('/collect/1', (res) => {
                expect(res.result).toEqual('success!');
                done();
            });
        });

        it('calls the vocab search with 始める', (done) => {
            jest.mock('../collect/service', () => {
                return {
                    search: (keyword) => {
                        mockFn(keyword);
                        Promise.resolve()
                    }
                }
            });

            const keyword = '始める';
            server.inject(`/collect/${keyword}`, (res) => {
                expect(mockFn).toHaveBeenCalledTimes(1);
                expect(mockFn).toBeCalledWith(keyword);
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
