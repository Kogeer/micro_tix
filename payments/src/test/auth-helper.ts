import jwt from 'jsonwebtoken';
import mongoose from "mongoose";

const signin = (id?: string) => {
    // Build a JWT payload { id, email }
    const payload = {
        id: id  || new mongoose.Types.ObjectId().toHexString(),
        email: 'test@test.com'
    }
    // Create the JWT. //process env come from setup.ts
    const token = jwt.sign(payload, process.env.JWT_KEY);
    // Build session Object { jwt: MY_JWT }
    const session = { jwt: token };    
    // Turn that session into JSON
    const sessionJSON = JSON.stringify(session);
    // Take JSON and encode it as base64
    const base64 = Buffer.from(sessionJSON).toString('base64');
    // return a string that's the cookie whit the encoded data
    return [`express:sess=${base64}`];
};

export default signin;
