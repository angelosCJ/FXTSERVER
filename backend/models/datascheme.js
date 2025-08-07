const mongoose = require("mongoose");

const schemaModel = new mongoose.Schema({
     userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
     date:{type:String,required:true},
     amountSpent:{type:String,required:true},
     productName:{type:String,required:true},
     categoryName:{type:String,required:true},
});

module.exports = mongoose.model("Economy",schemaModel);