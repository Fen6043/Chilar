const mongoose = require('mongoose')

const variableExpenseSchema = mongoose.Schema({
    item: {type:String,required:true},
    cost: {type:Number,required:true},
    date: {type:Date, default:Date.Now}
},{timestamps: true}) 

module.exports = mongoose.model('VariableExpense',variableExpenseSchema);