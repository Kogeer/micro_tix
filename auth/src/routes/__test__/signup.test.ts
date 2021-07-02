import request from 'supertest';
import { app } from "../../app";

it('Returns a 201 on succesful signup', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(201);
});

it('Returns a 400 with an invalid email', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            email: 'asdfasd',
            password: 'password'
        })
        .expect(400);
});

it('Returns a 400 with an invalid password', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'as'
        })
        .expect(400);
});

it('Returns a 400 with missing email and password', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com'
        })
        .expect(400);

    await request(app)
        .post('/api/users/signup')
        .send({
            password: 'holaaa'
        })
        .expect(400);
});

it('Disallows duplicate emails', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(201);

    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(400);
});

it('Sets a cookie after successful signup request', async () => {
    const response = await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(201);

    expect(response.get('Set-Cookie')).toBeDefined();
});
