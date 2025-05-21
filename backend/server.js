const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const app = express()
const Income = require("./income")
const Expense = require("./expense")

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
        const expense = await Expense.find();
        res.json(expense)
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
        const newExpense = new Expense({item:req.body.item ,cost:req.body.cost})
        await newExpense.save();
        res.status(200).json(newExpense)
    } catch (error) {
        console.log("error:",error)
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
        await Expense.findByIdAndDelete(req.params.id)
        res.status(200).json("successfully deleted")
    } catch (error) {
        res.status(500).json(error)
    }
})

const port = 5000
app.listen(port,()=>{console.log(`port ${port} opened for server`)})