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
});
