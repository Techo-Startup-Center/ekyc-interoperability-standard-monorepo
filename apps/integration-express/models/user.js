const mongoose = require('mongoose');
/**
 * User Schema
 * @typedef {Object} UserSchema
 * @property {string} phone_number - The phone number of the user.
 * @property {string} first_name - The first name of the user.
 * @property {string} last_name - The last name of the user.
 * @property {string} document_type - The type of document.
 * @property {string} document_id - The ID of the document.
 * @property {string} email - The email address of the user.
 * @property {Date} dob - The date of birth of the user.
 * @property {string} gender - The gender of the user.
 * @property {Date} issue_date - The issue date of the document.
 * @property {Date} expiry_date - The expiry date of the document.
 * @property {string} face_image - The image URL of the user's face.
 * @property {string} document_image - The image URL of the document.
 * @property {string} pub_key - The public key of the user.
 * @property {string} oa_doc - The optional document.
 */
const userSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    phone_number: { type: String, required: true },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    document_type: { type: String, required: true },
    document_id: { type: String, required: true },
    email: { type: String, required: true },
    dob: { type: Date, required: true },
    gender: { type: String, required: true },
    issue_date: { type: Date, required: true },
    expiry_date: { type: Date, required: true },
    face_image: { type: String, required: true },
    document_image: { type: String, required: true },
    pub_key: { type: String, required: false, unique: false },
    oa_doc: { type: String, required: false }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
