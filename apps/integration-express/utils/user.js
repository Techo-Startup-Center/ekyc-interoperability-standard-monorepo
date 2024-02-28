const User = require('../models/user');
const { faker } = require('@faker-js/faker');
const axios = require('axios');
const ErrorCode = require('../errors/error_code');
const { wrapOAeKYC } = require('./oa');

const generateUser = async () => {
    const avatarLink = faker.image.avatar();
    // fetch image from link and encode as base64
    const avatarRespond = await axios.get(avatarLink, {
        responseType: 'arraybuffer'
    });
    const imageLink = faker.image.url();
    const respond = await axios.get(imageLink, {
        responseType: 'arraybuffer'
    });
    return new User({
        phone_number: "+855" + [faker.number.int({ min: 10000000, max: 99999999 })],
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        document_type: ['National ID', 'Passport'][faker.number.int({ min: 0, max: 1 })],
        document_id: faker.number.int({ min: 100000000, max: 999999999 }),
        email: faker.internet.email(),
        dob: faker.date.past(),
        gender: ['Male', 'Female'][faker.number.int({ min: 0, max: 1 })],
        issue_date: faker.date.past(),
        expiry_date: faker.date.future(),
        face_image: Buffer.from(avatarRespond.data, 'binary').toString('base64'),
        document_image: Buffer.from(respond.data, 'binary').toString('base64'),
    });
}
const enrollUser = async (newUser) => {
    // generate attestation
    try {
        const attestation = await wrapOAeKYC(newUser);
        newUser.oa_doc = JSON.stringify(attestation);
    } catch (err) {
        console.log(err.message)
        throw new ErrorCode("Error generating attestation", 500)
    }
    try {
        await newUser.save();
        return newUser;
    }
    catch (err) {
        console.log(err.message)
        throw new ErrorCode("Error saving user", 500)
    }
}
module.exports = { generateUser, enrollUser };