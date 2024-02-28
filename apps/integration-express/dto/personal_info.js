class PersonalInfo {
    constructor(phone_number, first_name, last_name, document_type, document_id, email, dob, gender, issue_date, expiry_date) {
        this.phone_number = phone_number;
        this.first_name = first_name;
        this.last_name = last_name;
        this.document_type = document_type;
        this.document_id = document_id;
        this.email = email;
        this.dob = dob;
        this.gender = gender;
        this.issue_date = issue_date;
        this.expiry_date = expiry_date;
    }
}
module.exports = PersonalInfo;