const {User} = require('../../modules/user');
const request = require('supertest');
const { Course } = require('../../modules/course');

describe('auth middleware', () => {
    beforeEach(() => { server = require('../../index');})
    afterEach(async () => {
           await Course.remove({});
           await server.close(); 
        });

    let token;

    const exec = () =>{
        return request(server)
        .post('/api/courses/')
        .set('x-auth-token', token)
        .send({
            "name": "NEW COURSE",
            "category": "web",
            "tags": ["Ultimate"],
            "isPublished": true,
            "price": 15,
            "authorId": "628f904471366ddbc723da0e"
        })
    }
    beforeEach( () =>{
        token = new User().generateAuthToken();
    });

    it('should return 401 if no token is provided', async () => {
        token = '';

        const res = await exec();

        expect(res.status).toBe(401)
    });

    it('should return 400 if  token is invalid', async () => {
        token= null;

        const res = await exec();

        expect(res.status).toBe(400)
    });

    it('should return 200 if  token is valid', async () => {

        const res = await exec();

        expect(res.status).toBe(200)
    });
    
})