'use client'
import React, { FormEvent, useEffect, useState } from 'react'
import Toolbar from '../components/Toolbar'
import axios from 'axios';

const Budget = () => {
    interface Budget {
        _id:string;
        item: string;
        cost: number;
    }

    const [item,setItem] = useState("")
    const [cost,setCost] = useState(0)
    const [toggleTable,setToggleTable] = useState(false)
    const [incomeTableData,setIncomeTableData] = useState<Budget[]>([])
    const [expenseTableData,setExpenseTableData] = useState<Budget[]>([])

    //get Income data from DB
    const getIncomedata = async() =>{
        await axios.get("http://localhost:5000/api/getIncome")
        .then((response) => {setIncomeTableData(response.data);console.log(response.data)})
        .catch((err)=>{console.log("error occured while getting income:",err)})
    }

    //get Expense data from DB
    const getExpensedata = async() =>{
        await axios.get("http://localhost:5000/api/getExpense")
        .then((response) => {setExpenseTableData(response.data);console.log(response.data)})
        .catch((err)=>{console.log("error occured while getting expense:",err)})
    }

    useEffect(()=>{
        getIncomedata()
        getExpensedata()
    },[])

    //submit form
    const formsubmit = async(e: FormEvent<HTMLFormElement>) =>{
        e.preventDefault();
        if (toggleTable){
            //send data to db
            await axios.post("http://localhost:5000/api/addIncome",{item:item,cost:cost})
            .then((response)=>{console.log(response.status,response.data); setIncomeTableData([...incomeTableData,response.data])})
            .catch((err)=>{console.log(err)})

            console.log("submited",incomeTableData)
        }
        else{
            //send data to db
            await axios.post("http://localhost:5000/api/addExpense",{item:item,cost:cost})
            .then((response)=>{console.log(response.status,response.data); setExpenseTableData([...expenseTableData,response.data])})
            .catch((err)=>{console.log(err)})

            console.log("submited",expenseTableData)
        }
    }

    const removeExpense = async(index:number,id:string) => {
        const tempdata = [...expenseTableData]

        await axios.delete(`http://localhost:5000/api/deleteExpense/${id}`)
        .then((response)=>{console.log(response.status,response.data)})
        .catch((err)=>{console.log("error occured while deleting income: ",err)})

        tempdata.splice(index,1)
        setExpenseTableData(tempdata)
    }

    const removeIncome = async(index:number,id:string) => {
        const tempdata = [...incomeTableData]

        await axios.delete(`http://localhost:5000/api/deleteIncome/${id}`)
        .then((response)=>{console.log(response.status,response.data)})
        .catch((err)=>{console.log("error occured while deleting income: ",err)})

        tempdata.splice(index,1)
        setIncomeTableData(tempdata)
    }

    const sumIncome = () => {
        let sum = 0;
        incomeTableData.map((income) => { sum = sum + income.cost})
        return sum
    }

    const sumExpense = () => {
        let sum = 0;
        expenseTableData.map((expense) => { sum = sum + expense.cost})
        return sum
    }

  return (
    <>
    <Toolbar></Toolbar>
    <div className=' w-full items-center justify-center flex'>
        <button className={`p-2 m-2 w-10 rounded-full text-2xl cursor-pointer ${toggleTable ? 'bg-emerald-600':'bg-rose-600'}`} onClick={() => {setToggleTable(!toggleTable)}}>
            {toggleTable ? "+":"-"}
        </button>
        <form className=' items-center justify-center grid grid-cols-3' onSubmit={(e) => formsubmit(e)}>
            <input className=' px-4 py-2 m-2 border border-emerald-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700' onChange={(e)=>{setItem(e.target.value)}} placeholder='Item' required/>
            <input type='number' className=' px-4 py-2 m-2 border border-emerald-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700' onChange={(e)=>{setCost(Number(e.target.value))}} placeholder='Cost'/>
            <button type='submit' className='px-4 py-2 m-2 bg-amber-500 rounded-full cursor-pointer hover:bg-amber-700 font-bold'>Submit</button>
        </form>
    </div>

    <div className='grid grid-cols-2'>
        <div className=' mx-2 p-2 border border-emerald-500 w-fit'><b>Total Income: {sumIncome()} </b></div>
        <div className=' mx-2 p-2 border border-rose-500 w-fit'><b>Total Expense:{sumExpense()} </b></div>
    </div>

    <div className='grid grid-cols-2'>
        <div className=' m-2'>
            <table className=' border-2 border-emerald-500 table-auto w-full'>
                <thead className=' border-2 border-emerald-500 '>
                    <tr>
                        <th className='p-2 w-1/2'>Income Item</th>
                        <th className='p-2 w-1/2'>Cost</th>
                    </tr>
                </thead>
                <tbody>
                    {incomeTableData.map((row,index) => {
                        return(
                        <tr key={index} className=' hover:bg-emerald-600' onClick={()=>removeIncome(index,row._id)}>
                            <td className='p-2 w-1/2 text-center'>{row.item}</td>
                            <td className='p-2 w-1/2 text-center'>{row.cost}</td>
                        </tr>)
                    })}
                </tbody>
            </table>
        </div>

        <div className=' m-2'>
            <table className=' border-2 border-rose-500 table-auto w-full'>
                <thead className=' border-2 border-rose-500 '>
                    <tr>
                        <th className='p-2 w-1/2'>Expense Item</th>
                        <th className='p-2 w-1/2'>Cost</th>
                    </tr>
                </thead>
                <tbody>
                    {expenseTableData.map((row,index) => {
                        return(
                        <tr key={index} className=' hover:bg-rose-600' onClick={()=>removeExpense(index,row._id)}>
                            <td className='p-2 w-1/2 text-center'>{row.item}</td>
                            <td className='p-2 w-1/2 text-center'>{row.cost}</td>
                        </tr>)
                    })}
                </tbody>
            </table>
        </div>
    </div>

    
    </>
  )
}

export default Budget