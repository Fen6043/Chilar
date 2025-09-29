const mongoose = require('mongoose')

const variableExpenseSchema = mongoose.Schema({
    userId:String,
    item: {type:String,required:true},
    cost: {type:Number,required:true},
    type: {type:Boolean,required:true},
    date: {type:Date, default:Date.now}
},{timestamps: true}) 

module.exports = mongoose.model('VariableExpense',variableExpenseSchema);