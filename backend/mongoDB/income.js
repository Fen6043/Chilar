const mongoose = require("mongoose")

const incomeSchema = mongoose.Schema({
    item: {type:String , required:true},
    cost: {type:Number, required:true}
})

module.exports = mongoose.model("Income",incomeSchema);