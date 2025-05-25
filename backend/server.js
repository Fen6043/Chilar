const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const app = express()
/** @type {import('mongoose').Model<any>} */
const Income = require("./income")
/** @type {import('mongoose').Model<any>} */
const FixedExpense = require("./fixedExpense")
/** @type {import('mongoose').Model<any>} */
const VariableExpense = require("./variableExpense")

app.use(express.json())
app.use(cors())

mongoose.connect("mongodb://localhost:27017/chillar")
.then(()=>{console.log("chillar db connected")})
.catch((err)=>{console.log("chillar db not connected, error:",err)})

app.get("/api/getIncome",async(req,res) => {
    try {
        const income = await Income.find();
        res.json(income)
    } catch (error) {
        res.status(500).json(error)
    }
})

app.get("/api/getExpense",async(req,res) => {
    try {
        const expense = await FixedExpense.find();
        res.json(expense)
    } catch (error) {
        res.status(500).json(error)
    }
})

app.get("/api/getVariableExpense/:num", async(req,res) => {
    try {
        const num =parseInt(req.params.num)
        let varExpense
        if(num>0){
            varExpense = await VariableExpense.find().sort({ createdAt: -1 }).limit(num);
        }
        else{
            varExpense = await VariableExpense.find().sort({ date: -1 });
        }
        res.json(varExpense)
    } catch (error) {
        res.status(500).json(error)
    }
})

app.get("/api/getBudget",async(req,res) => {
    try {
        const incomeSum = await Income.aggregate([
          {
            $group: {
              _id: null,
              totalCost: { $sum: "$cost" }
            }
          }
        ]);

        const expenseSum = await FixedExpense.aggregate([
            {
                $group: {
                    _id: null,
                    totalCost: { $sum: "$cost" }
                }
            }
        ])

        // console.log(incomeSum,expenseSum)
        const totalIncome = incomeSum[0]?.totalCost || 0
        const totalExpense = expenseSum[0]?.totalCost || 0
        res.json({totalBuget: (totalIncome - totalExpense)})
    } catch (error) {
        res.status(500).json(error)
    }
})

app.post("/api/addIncome",async(req,res) => {
    try {
        const newIncome = new Income({item:req.body.item ,cost:req.body.cost})
        await newIncome.save();
        res.status(200).json(newIncome)
    } catch (error) {
        console.log("error:",error)
        res.status(500).json(error)
    }
})

app.post("/api/addExpense",async(req,res) => {
    try {
        const newExpense = new FixedExpense({item:req.body.item ,cost:req.body.cost})
        await newExpense.save();
        res.status(200).json(newExpense)
    } catch (error) {
        console.log("error:",error)
        res.status(500).json(error)
    }
})

app.post("/api/addvariableExpense", async(req,res) => {
    try {
        const newVarExpense = new VariableExpense({item:req.body.item, cost:req.body.cost, date:new Date(req.body.date)})
        await newVarExpense.save();
        res.status(200).json({text:"Saved variableExpense successfully"})
    } catch (error) {
        res.status(500).json(error)
    }
})

app.delete("/api/deleteIncome/:id", async(req,res)=>{
    try {
        await Income.findByIdAndDelete(req.params.id)
        res.status(200).json("successfully deleted")
    } catch (error) {
        res.status(500).json(error)
    }
})

app.delete("/api/deleteExpense/:id", async(req,res)=>{
    try {
        await FixedExpense.findByIdAndDelete(req.params.id)
        res.status(200).json("successfully deleted")
    } catch (error) {
        res.status(500).json(error)
    }
})

const port = 5000
app.listen(port,()=>{console.log(`port ${port} opened for server`)})