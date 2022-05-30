const request = require('supertest');
const {Course} = require('../../modules/course');
const {User} = require('../../modules/user');
const mongoose = require('mongoose');
let server;


describe('/api/courses', () =>{
    beforeEach(() =>{server = require('../../index');});
    afterEach(async () => {
        await server.close();
        await Course.remove({});
     });

    describe('GET /' , () => {
        it('sould return and create all courses', async () => {
            await Course.collection.insertMany([
                {
                    "name": "New Angular Course",
                    "category": "web",
                    "tags": ["Ultimate"],
                    "isPublished": true,
                    "price": 15,
                    "author": "628f904471366ddbc723da0e"
                },
                {
                    "name": "New Mode Course",
                    "category": "web",
                    "tags": ["Final"],
                    "isPublished": true,
                    "price": 15,
                    "authorId": "628f904471366ddbc723da0e"
                }
            ])
            const res = await request(server).get('/api/courses');

            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            expect(res.body.some( c => c.name === "New Angular Course")).toBeTruthy;
            expect(res.body.some( c => c.name === "New Mode Course")).toBeTruthy;            
        });
    });

    describe('GET /:id', () => {
        it('should return a course if valid id is passed', async () => {
            const course = new Course({
                "name": "New Angular Course",
                "category": "web",
                "tags": ["Ultimate"],
                "isPublished": true,
                "price": 15,
                "authorId": "628f904471366ddbc723da0e"
            });
            await course.save();
            const res = await request(server).get('/api/courses/' + course._id);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('name', course.name);
        });

        it('should return 404 if invalid id is passed', async () => {

            const res = await request(server).get('/api/courses/1');

            expect(res.status).toBe(404);
        });
        it('should return 404 if no course with the given id is exist', async () => {
            const id = mongoose.Types.ObjectId();
            const res = await request(server).get('/api/courses/'+ id);

            expect(res.status).toBe(404);
        });
    });

    describe('POST /', () =>{
        let token;
        let name;
        const exec = async () => {
           return await request(server)
                                .post('/api/courses')
                                .set('x-auth-token', token)
                                .send({
                                    "name": name,
                                    "category": "web",
                                    "tags": ["Ultimate"],
                                    "isPublished": true,
                                    "price": 15,
                                    "authorId": "628f904471366ddbc723da0e"
                                });
        }
        beforeEach(() => {
             token = new User().generateAuthToken();
        });
        it('should return a 401 if client is not logged in', async () => {
            token = ''

            const res = await request(server).post('/api/courses')

            expect(res.status).toBe(401);
        });

        it('should return a 400 if name of course is less than 3 charecters', async () => {
            name = "My";

            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should save the course if valid', async () => {
            name = "MyNew Course";
            const res = await exec();

            const course = await Course.find({name: 'MyNew Course'});
            expect(course).not.toBeNull();
        });
        it('should return the course if it is valid', async () => {
            name = "MyNew Course";
            const res = await exec();

            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', "MyNew Course");
            expect(res.body).toHaveProperty("category", "web");
        });
    })
});