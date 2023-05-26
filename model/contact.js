const mongoose = require('mongoose');

// membuat schema/ structur data 
const Contact = mongoose.model('Contact', {
    // contact di dalam model, berisi tunggal, di buat collections oleh monggoose nya jamak, jd contacts
    nama: {
        type: String,
        required: true,
    },
    nohp: {
        type: String,
        required: true,
    },
    email: {
        type: String,
    }
});

module.exports = Contact;

// hanya u menambahkan ke mongodb lwt file db.js
// menambah 1 data
// const contact1 = new Contact({
//     nama: 'Anto',
//     nohp: '0811223344',
//     email: 'anto@gmail.com'
// });
// // simpan ke collection
// contact1.save().then((contact) => console.log(contact));