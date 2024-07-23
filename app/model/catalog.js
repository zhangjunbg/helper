'use strict';
module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;
    const CatalogSchema = new Schema({
        bigV:{
            type: String,
        },
        key: {
            type: String,
        },
        name: {
            type: String,
        },
        // 页数 
        pages: {
            type: String,
        },
    });
    return mongoose.model('Catalog', CatalogSchema);
};