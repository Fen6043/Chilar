const mongoose = require("mongoose")

const fixedExpenseSchema = mongoose.Schema({
    item: {type:String,required:true},
    cost: {type:Number,required:true}
})

module.exports = mongoose.model('FixedExpense',fixedExpenseSchema);