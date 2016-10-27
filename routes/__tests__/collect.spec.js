const Promise = require('bluebird');
const Hapi = require('hapi');

describe('collect -- handler', () => {
    const mockFn = jest.fn((keyword) => { return { vocab: keyword } });
    jest.mock('../collect/service', () => {
        return {
            search: (keyword) => new Promise((resolve, reject) => {
                let result = mockFn(keyword);
                resolve(result);
            })
        }
    });
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

        afterEach(() => {
            jest.resetModules();
        });

        it('calls without failing', (done) => {
            server.inject('/collect/1', (res) => {
                expect(res.statusCode).toEqual(200);
                done();
            });
        });

        it('calls the vocab search with 始める', (done) => {
            const keyword = '始める';
            server.inject(`/collect/${keyword}`, (res) => {
                expect(mockFn).toHaveBeenCalledTimes(1);
                expect(mockFn).toBeCalledWith(keyword);
                expect(res.payload).toEqual(`{"vocab":"${keyword}"}`);
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

describe('collect -- service', () => {
    // const mockFn = jest.fn((keyword) => { return { vocab: keyword } });
    // jest.mock('../collect/model', () => {
    //     return {
    //         vocab: {
    //             get: (keyword) => new Promise((resolve, reject) => {
    //                 let result = mockFn(keyword);
    //                 resolve(result);
    //             })
    //         }
    //     }
    // });
    const mockFn = jest.fn(() => {
        return {
            get: (keyword) => Promise.resolve()
        }
    });

    require('../collect/model').vocab = mockFn;
    const collect = require('../collect/service');

    describe('search', () => {
        afterEach(() => {
            jest.resetModules();
        });

        it('can call function just fine', (done) => {
            let keyword = 'pow!';

            collect.search(keyword).then(() => {
                done();
            });
        });

        it('at least calls vocab func', (done) => {
            let keyword = '自転車'; 

            collect.search(keyword).then(() => { 
                expect(true).toBeFalsy();
                //TODO: begin working on the vocab transplantation from old to new
                done();
            });
        });



    });



});