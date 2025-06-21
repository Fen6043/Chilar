const mongoose = require('mongoose')

const budgetSchema = mongoose.Schema({
    userId:String,
    income:Number,
    expense:Number,
    monthlyBudget:Number,
    setMonth:{type:String,default: Date.now}
},{timestamps: true})

module.exports = mongoose.model("Budget",budgetSchema)