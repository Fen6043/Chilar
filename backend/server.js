const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const app = express()
/** @type {import('mongoose').Model<any>} */
const Income = require("./mongoDB/income")
/** @type {import('mongoose').Model<any>} */
const FixedExpense = require("./mongoDB/fixedExpense")
/** @type {import('mongoose').Model<any>} */
const VariableExpense = require("./mongoDB/variableExpense")
/** @type {import('mongoose').Model<any>} */
const Budget = require("./mongoDB/budget")

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

app.get("/api/getFixedExpense",async(req,res) => {
    try {
        const expense = await FixedExpense.find();
        res.json(expense)
    } catch (error) {
        res.status(500).json(error)
    }
})

app.get("/api/getVariableExpenseList/:num", async(req,res) => {
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

app.get("/api/getVariableExpense/:date", async(req,res) => {
    try {
        const today = new Date(req.params.date)
        //const stoday = new Date(today.getFullYear(),today.getMonth(),today.getDate())
        //console.log(today,req.params.date)
        const firstday = new Date(today.getFullYear(),today.getMonth(),1)
        const lastday = new Date(today.getFullYear(),today.getMonth()+1,0,23, 59, 59, 999)
        const monthlyExpense = await VariableExpense.aggregate([
            {
                $match: {
                    date: {
                        $gte:firstday,
                        $lte:lastday
                    }
                }
            }, 
            {
                $group: {
                    _id:null,
                    totalExpense: {$sum:"$cost"}
                }
            }
        ])

        const dailyExpense = await VariableExpense.aggregate([
            {
                $match:{
                    date:{
                        $eq:today
                    }
                }
            },
            {
                $group:{
                    _id:null,
                    totalExpense: {$sum:"$cost"}
                }
            }
        ])
        const sendDailyExpense = dailyExpense[0]?.totalExpense || 0
        const sendMonthlyExpense = monthlyExpense[0]?.totalExpense || 0
        res.json({dailyVariableExpense:sendDailyExpense,monthlyVariableExpense:sendMonthlyExpense})
    } catch (error) {
        console.log("error ocuured while getting expense",error)
        res.status(500).json(error)
    }
})

app.get("/api/getFixedBudget",async(req,res) => {
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

        //console.log(incomeSum,expenseSum)
        const totalIncome = incomeSum[0]?.totalCost || 0
        const totalExpense = expenseSum[0]?.totalCost || 0
        res.json({totalfixedBudget: (totalIncome - totalExpense)})
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
})

app.get("/api/getVariableExpenseListByDate/:startDate/:endDate",async(req,res)=>{
    try {
        const startDate = new Date(req.params.startDate)
        const endDate = new Date(req.params.endDate)

        const variableExpenseList = await VariableExpense.aggregate([
            {
                $match:{
                    date:{
                        $gte:startDate,
                        $lte:endDate
                    }
                }
            },
            {
                $sort:{
                    date: -1
                }
            }
        ])

        res.status(200).json(variableExpenseList)
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
})

app.get("/api/checkifBudgetSet/:setMonth",async(req,res) => {
    //console.log(req.params.setMonth)

    const budgetDetail = await Budget.exists({
        setMonth:{
            $eq:req.params.setMonth
        }
    })

    const sendBack = !!budgetDetail
    res.send(sendBack)
})

app.post("/api/BudgetSetForTheMonth",async(req,res) => {
    try {
        const setdata = {income:parseFloat(req.body.income), expense:parseFloat(req.body.expense), monthlyBudget:parseFloat(req.body.income) - parseFloat(req.body.expense),setMonth:req.body.setMonth}
        
        await Budget.findOneAndUpdate({
            setMonth:{
            $eq:req.body.setMonth
        }
        },setdata,{upsert:true}) // upsert is for adding if no data pass filter condition 

        res.status(200).send("Successfully added Budget")
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
        const newVarExpense = new VariableExpense({item:req.body.item, cost:req.body.cost, date:req.body.date})
        await newVarExpense.save();
        res.status(200).json(newVarExpense)
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

app.delete("/api/deleteLatestVariableExpense", async(req,res)=>{
    try {
        await VariableExpense.findOneAndDelete({},{
            sort: { createdAt: -1}
        })
        res.status(200).json("successfully deleted")
    } catch (error) {
        res.status(500).json(error)
    }
})

const port = 5000
app.listen(port,()=>{console.log(`port ${port} opened for server`)})