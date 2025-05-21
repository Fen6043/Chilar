const mongoose = require("mongoose")

const expenseSchema = mongoose.Schema({
    item: {type:String,required:true},
    cost: {type:Number,required:true}
})

module.exports = mongoose.model('expense',expenseSchema);