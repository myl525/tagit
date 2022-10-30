const app = require('../../app.js');
const supertest = require('supertest');

jest.mock('../../data/directory.json', () => ({
    "directory": {
        "files": {
            "fileOne": {
                "tags": ["tag1", "tag2"]
            },
            "fileTwo": {
                "tags":[]
            }
        },
        "tags": {
            "tag1": {
                "files": ["fileOne"]
            },
            "tag2": {
                "files": ["fileOne"]
            }
        }
    }
}), {virtual: true});

let mockDirData = require('../../data/directory.json');

describe("apis for index page", () => {
    test('GET /api/searchDir, new directory', async () => {
        supertest(app)
        .get('/api/searchDir?dirName=testDir')
        .expect(200)
        .expect((res) => {
            res.body.newDir = true;
        })
        .end((err, res) => {
            if(err) {
                throw err;
            }
        });
    });

    test('GET /api/searchDir, existed directory', () => {
        supertest(app)
        .get('/api/searchDir?dirName=directory')
        .expect(200)
        .expect((res) => {
            res.body.newDir = false;
            res.body.files = ['fileOne', 'fileTwo'];
        })
        .end((err, res) => {
            if(err) {
                throw err;
            }
        });
    });

    test('GET /api/getDir', async () => {
        const res = await supertest(app)
        .get('/api/getDir?dirName=directory');

        expect(res.body.files).toEqual({
            'fileOne': {
                'tags': [
                    'tag1',
                    'tag2'
                ]
            },
            'fileTwo': {
                'tags': [

                ]
            }
        });

        expect(res.body.tags).toEqual({
            'tag1': {
                'files': ['fileOne']
            },
            'tag2': {
                'files': ['fileOne']
            }
        });
    });

    test('POST /api/addDir', async () => {
        const dirName = 'newDirectory';
        const files = ['newFileOne', 'newFileTwo'];
        const body = `dirName=${encodeURIComponent(dirName)}&files=${encodeURIComponent(JSON.stringify(files))}`;

        const res = await supertest(app)
        .post('/api/addDir')
        .send(body);

        expect(mockDirData['newDirectory']).toEqual({
            'files': {
                'newFileOne': {
                    'tags':[]
                },
                'newFileTwo': {
                    'tags':[]
                }
            },
            'tags': {}
        });
    });

    //TODO add dir files
    test('POST /api/addDirFiles', async () => {
        const dirName = 'directory';
        const newFiles = ['fileThree'];
        const body = 'dirName='+encodeURIComponent(dirName)+'&newFiles='+encodeURIComponent(JSON.stringify(newFiles));

        const res = await supertest(app)
        .post('/api/addDirFiles')
        .send(body);

        expect(mockDirData['directory']).toEqual({
            "files": {
                "fileOne": {
                    "tags": ["tag1", "tag2"]
                },
                "fileTwo": {
                    "tags":[]
                },
                "fileThree": {
                    "tags":[]
                }
            },
            "tags": {
                "tag1": {
                    "files": ["fileOne"]
                },
                "tag2": {
                    "files": ["fileOne"]
                }
            }
        });
    });

    test('POST /api/addDirTags', async () => {
        const dirName = 'directory';
        const fileName = 'fileTwo';
        const newTag = 'newTag';
        const body = 'dirName='+encodeURIComponent(dirName)+'&fileName='+encodeURIComponent(fileName)+'&tagName='+encodeURIComponent(newTag);

        const res = await supertest(app)
        .post('/api/addDirTags')
        .send(body);

        expect(mockDirData['directory'].files.fileOne).toEqual({
            'tags': ['tag1', 'tag2']
        });

        expect(mockDirData['directory'].files.fileTwo).toEqual({
            'tags': ['newTag']
        });

        expect(mockDirData['directory'].files.fileThree).toEqual({
            'tags': []
        });

        expect(mockDirData['directory'].tags.newTag).toEqual({
            'files': ['fileTwo']
        });

        expect(mockDirData['directory']).toEqual({
            'files': {
                'fileOne': {
                    'tags': ['tag1', 'tag2']
                },
                'fileTwo': {
                    'tags': ['newTag']
                },
                'fileThree': {
                    'tags':[]
                }
            },
            'tags': {
                'tag1': {
                    'files': ['fileOne']
                },
                'tag2': {
                    'files': ['fileOne']
                },
                'newTag': {
                    'files': ['fileTwo']
                }
            }
        });
    });

    test('POST /api/deleteDirTags', async () => {
        const dirName = 'directory';
        const fileName = 'fileOne';
        const tagName = 'tag1';
        const body = 'dirName='+encodeURIComponent(dirName)+'&fileName='+encodeURIComponent(fileName)+'&tagName='+encodeURIComponent(tagName);

        const res = await supertest(app)
        .post('/api/deleteDirTags')
        .send(body);

        expect(mockDirData['directory'].files.fileOne).toEqual({
            'tags': ['tag2']
        });

        expect(mockDirData['directory'].files.fileTwo).toEqual({
            'tags': ['newTag']
        });

        expect(mockDirData['directory'].files.fileThree).toEqual({
            'tags': []
        });

        expect(mockDirData['directory'].tags).toEqual({
            'tag2': {
                'files': ['fileOne']
            },
            'newTag': {
                'files': ['fileTwo']
            }
        });

        expect(mockDirData['directory']).toEqual({
            'files': {
                'fileOne': {
                    'tags': ['tag2']
                },
                'fileTwo': {
                    'tags': ['newTag']
                },
                'fileThree': {
                    'tags': []
                }
            },
            'tags': {
                'tag2': {
                    'files': ['fileOne']
                },
                'newTag': {
                    'files': ['fileTwo']
                }
            }
        });
    });
});

