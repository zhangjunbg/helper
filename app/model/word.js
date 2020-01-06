'use strict';
module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;
    const WordSchema = new Schema({
        key: {
            type: String,
        },
        detail: {
            type: String,
        },
        // 分类 
        v1: {
            type: Number,
        },
        v2: {
            type: Number,
        },
        v3: {
            type: Number,
        },
        v4: {
            type: Number,
        },
        pic:{type:String},
        
    });
    console.log("====================================================");
    console.log("====================================================");
    return mongoose.model('Word', WordSchema);
};