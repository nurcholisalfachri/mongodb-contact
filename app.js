const express = require('express');
const expressLayouts = require('express-ejs-layouts');

const { body, validationResult, check } = require('express-validator');
const methodOverride = require('method-override');

const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');

require('./utils/db');
const Contact = require('./model/contact');

const app = express();
const port = 3000;

// setup method override
app.use(methodOverride('_method'));

// setup ejs
app.set('view engine', 'ejs');
app.use(expressLayouts); 
app.use(express.static('public')); 
app.use(express.urlencoded({ extended: true }));

// konfigurasi flash
app.use(cookieParser('secret'));
app.use(
    session({
        cookie: { maxAge: 6000},
        secret: 'secret',
        resave: true,
        saveUninitialized: true,
    })
);
app.use(flash());

// Halaman Home
app.get('/', (req, res) => {

    res.render('index', { 
        title: 'Home Page',
        layout: 'layouts/main-layout',
    });
});

// halaman contact
app.get('/contact', async (req, res) => {
    const contacts = await Contact.find();
    res.render('contact', { 
        title: 'Contact Page',
        layout: 'layouts/main-layout',
        contacts,
        msg: req.flash('msg'),
    });
});

// halaman form tambah data contact
app.get('/contact/add', (req, res) => {
    res.render('add-contact', {
        title: 'Add Contact Data Form',
        layout: 'layouts/main-layout',
    });
});

// proses tambah data contact
app.post(
    '/contact', [
    body('nama').custom( async (value) => {
        const duplikat = await Contact.findOne({ nama: value });
        if (duplikat) {
            throw new Error(`Contact's name already used!`);
        }
        return true;
    }),
    check('email', 'Email is not valid!').isEmail(),
    check('nohp', 'Phone number is not valid!').isMobilePhone('id-ID'),
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.render('add-contact', {
            title: 'Add Contact Data Form',
            layout: 'layouts/main-layout',
            errors: errors.array(),
        });
    } else {
        Contact.insertMany(req.body, (error, result) => {
            req.flash('msg', 'Contact data succeed to added!');
            res.redirect('/contact');
        })
    }
});

app.delete('/contact', (req, res) => {
    Contact.deleteOne({ nama: req.body.nama }).then((result) => {
        req.flash('msg', 'Contact data succeed to deleted!');
        res.redirect('/contact');
    });
});

// halaman form ubah data contact
app.get('/contact/edit/:nama', async (req, res) => {
    const contact = await Contact.findOne({ nama: req.params.nama });
    res.render('edit-contact', {
        title: 'Change Contact Data Form',
        layout: 'layouts/main-layout',
        contact,
    });
});

// proses ubah data
app.put(
    '/contact', [
    body('nama').custom(async (value, { req }) => {
        const duplikat = await Contact.findOne({ nama: value });
        if (value !== req.body.oldNama && duplikat) {
            throw new Error(`Contact's name already used!`);
        }
        return true;
    }),
    check('email', 'Email is not valid!').isEmail(),
    check('nohp', 'Phone number is not valid!').isMobilePhone('id-ID'),
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.render('edit-contact', {
            title: 'Change Contact Data Form',
            layout: 'layouts/main-layout',
            errors: errors.array(),
            contact: req.body,
        });
    } else {
        Contact.updateOne(
            { _id: req.body._id },
            {
                $set: {
                    nama: req.body.nama,
                    email: req.body.email,
                    nohp: req.body.nohp,
                },
            }
        ).then((result) => {
            // kirimkan flash message
            req.flash('msg', 'Contact data succeed to changed!');
            res.redirect('/contact');
        });
    }
});

// halaman detail contact
app.get('/contact/:nama', async (req, res) => {
    const contact = await Contact.findOne({ nama: req.params.nama });
    

    res.render('detail', { 
        title: 'Contact Detail Page',
        layout: 'layouts/main-layout',
        contact,
    });
});


app.listen(port, () => {
    console.log(`Mongo Contact App | listening at http://localhost:${port}`);
});