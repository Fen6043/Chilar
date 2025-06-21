const mongoose = require("mongoose")

const fixedExpenseSchema = mongoose.Schema({
    userId:String,
    item: {type:String,required:true},
    cost: {type:Number,required:true}
})

module.exports = mongoose.model('FixedExpense',fixedExpenseSchema);