const mongoose = require('mongoose');
// mengconnect aplikasi dgn mongodb

mongoose.connect('mongodb://127.0.0.1:27017/wpu', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
    // akan otomatis membuat index setiap doc yg d buat
});



