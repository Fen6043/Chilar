'use client'
import React, { FormEvent, useEffect, useRef, useState } from 'react'
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
    const [error,setError] = useState(false)
    const timeRef = useRef<NodeJS.Timeout>(null)
    const [style,setStyle] = useState(false)
    const [isBudgetNotSet,setisBudgetNotSet] = useState(false)
    const keyRef = useRef("")
    const sendBudgetData = useRef(false);

    //get Income data from DB
    const getIncomedata = async() =>{
        await axios.get("http://localhost:5000/api/getIncome")
        .then((response) => {setIncomeTableData(response.data);})
        .catch((err)=>{console.log("error occured while getting income:",err)})
    }

    //get Expense data from DB
    const getExpensedata = async() =>{
        await axios.get("http://localhost:5000/api/getFixedExpense")
        .then((response) => {setExpenseTableData(response.data);})
        .catch((err)=>{console.log("error occured while getting expense:",err)})
    }

    useEffect(()=>{
        getIncomedata()
        getExpensedata()
        const getItem = localStorage.getItem("isBudgetSet")
        setisBudgetNotSet(!!getItem)
    },[])

    //submit form
    const formsubmit = async(e: FormEvent<HTMLFormElement>) =>{
        e.preventDefault();
        if (toggleTable){
            //send data to db
            await axios.post("http://localhost:5000/api/addIncome",{item:item,cost:cost})
            .then((response)=>{
                //console.log(response.status,response.data); 
                setIncomeTableData([...incomeTableData,response.data]);
                setError(false)
            })
            .catch((err)=>{console.log(err);setError(true)})

            //console.log("submited",incomeTableData)
        }
        else{
            //send data to db
            await axios.post("http://localhost:5000/api/addExpense",{item:item,cost:cost})
            .then((response)=>{
                //console.log(response.status,response.data); 
                setExpenseTableData([...expenseTableData,response.data]);
                setError(false)
            })
            .catch((err)=>{console.log(err);setError(true)})

            //console.log("submited",expenseTableData)
        }
        sendBudgetData.current = true
    }

    const removeExpense = async(index:number,id:string) => {
        const tempdata = [...expenseTableData]

        await axios.delete(`http://localhost:5000/api/deleteExpense/${id}`)
        .then((response)=>{console.log(response.status,response.data)})
        .catch((err)=>{console.log("error occured while deleting income: ",err)})

        tempdata.splice(index,1)
        setExpenseTableData(tempdata)
        setStyle(false)
        sendBudgetData.current = true
    }

    const removeIncome = async(index:number,id:string) => {
        const tempdata = [...incomeTableData]

        await axios.delete(`http://localhost:5000/api/deleteIncome/${id}`)
        .then((response)=>{console.log(response.status,response.data)})
        .catch((err)=>{console.log("error occured while deleting income: ",err)})

        tempdata.splice(index,1)
        setIncomeTableData(tempdata)
        setStyle(false)
        sendBudgetData.current = true
    }

    const removeTimer = (type:string,index:number,id:string) => {
        //console.log("inside remove timer")
        timeRef.current = null;
        if(type === "Expense"){
            setStyle(true)
            keyRef.current = "E"+index
            timeRef.current = setTimeout(() => removeExpense(index,id),500)
        }
        else{
            setStyle(true)
            keyRef.current = "I"+index
            timeRef.current = setTimeout(() => removeIncome(index,id),500)
        }
            
    }

    const removeTimerCancel = () => {
        if(timeRef.current){
            setStyle(false)
            keyRef.current = ""
            clearTimeout(timeRef.current)
        }
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

    const verifyBudget = () => {
        const today = new Date()
        const stoday = today.toDateString()
        const setMonth = stoday.split(" ")[1] + " " + stoday.split(" ")[3]
        const totalIncome = sumIncome()
        const totalExpense = sumExpense()
        const sendData = {income:totalIncome,expense:totalExpense,setMonth:setMonth}
        axios.post("http://localhost:5000/api/BudgetSetForTheMonth",sendData)
        .then((res) => {console.log(res);localStorage.removeItem("isBudgetSet")})
        .catch((err) => {console.log(err)})
    }

    useEffect(()=>{
        //console.log(sendBudgetData.current)
        if(sendBudgetData.current){
            verifyBudget()
            sendBudgetData.current = false
        }
    },[incomeTableData,expenseTableData])

  return (
    <>
    <Toolbar></Toolbar>
    <div className=' w-full items-center justify-center flex'>
        <button className={`m-2 w-12 h-10 rounded-full text-2xl cursor-pointer ${toggleTable ? 'bg-emerald-600':'bg-rose-600'}`} onClick={() => {setToggleTable(!toggleTable)}}>
            {toggleTable ? "+":"-"}
        </button>
        <form className=' items-center justify-center grid grid-cols-3' onSubmit={(e) => formsubmit(e)}>
            <input className=' px-4 py-2 m-2 border border-emerald-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700' onChange={(e)=>{setItem(e.target.value)}} placeholder='Item' required/>
            <input type='number' className=' px-4 py-2 m-2 border border-emerald-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700' onChange={(e)=>{setCost(Number(e.target.value))}} placeholder='Cost'/>
            <button type='submit' className='px-4 py-2 m-2 bg-amber-500 rounded-full cursor-pointer hover:bg-amber-700 font-bold'>Submit</button>
        </form>
    </div>
    {isBudgetNotSet && <button className='bg-amber-600 hover:bg-emerald-700 rounded-es-lg transition-all duration-300 animate-bounce hover:animate-none font-mono p-2 mx-2 cursor-pointer'
    onClick={()=>{verifyBudget();setisBudgetNotSet(false)}}>Verify</button>}
    {error && <div className= ' text-red-500 flex justify-center mb-2 w-3/4'>Error Occured. Try again later</div>}

    <div className='grid grid-cols-2 mt-10'>
        <div className=' mx-2 p-2 border border-emerald-500 w-fit' style={{backgroundColor:'var(--background)'}}><b>Total Income: {sumIncome()} </b></div>
        <div className=' mx-2 p-2 border border-rose-500 w-fit' style={{backgroundColor:'var(--background)'}}><b>Total Expense:{sumExpense()} </b></div>
    </div>

    <div className='grid grid-cols-2'>
        <div className=' m-2'>
            <table className=' select-none border-2 border-emerald-500 table-auto w-full' style={{backgroundColor:'var(--background)'}}>
                <thead className=' border-2 border-emerald-500 '>
                    <tr>
                        <th className='p-2 w-1/2'>Income Item</th>
                        <th className='p-2 w-1/2'>Cost</th>
                    </tr>
                </thead>
                <tbody>
                    {incomeTableData.map((row,index) => {
                        return(
                        <tr key={"I"+index} className={`hover:bg-emerald-600 ${(style && keyRef.current === "I"+index)?"transition-colors duration-500 hover:bg-emerald-800 bg-emerald-800":""}`} 
                        onMouseDown={()=>removeTimer("Income",index,row._id)} 
                        onTouchStart={()=>removeTimer("Income",index,row._id)}
                        onTouchEnd={removeTimerCancel}
                        onMouseUp={removeTimerCancel} 
                        onMouseLeave={removeTimerCancel}>
                            <td className='p-2 w-1/2 text-center'>{row.item}</td>
                            <td className='p-2 w-1/2 text-center'>{row.cost}</td>
                        </tr>)
                    })}
                </tbody>
            </table>
        </div>

        <div className=' m-2'>
            <table className=' select-none border-2 border-rose-500 table-auto w-full' style={{backgroundColor:'var(--background)'}}>
                <thead className=' border-2 border-rose-500 '>
                    <tr>
                        <th className='p-2 w-1/2'>Expense Item</th>
                        <th className='p-2 w-1/2'>Cost</th>
                    </tr>
                </thead>
                <tbody>
                    {expenseTableData.map((row,index) => {
                        return(
                        <tr key={"E"+index} className={`hover:bg-rose-600 ${(style && keyRef.current === "E"+index)?"transition-colors duration-500 hover:bg-rose-800 bg-rose-800":""}`} 
                        onMouseDown={()=>removeTimer("Expense",index,row._id)} 
                        onTouchStart={()=>removeTimer("Expense",index,row._id)}
                        onTouchEnd={removeTimerCancel}
                        onMouseUp={removeTimerCancel} 
                        onMouseLeave={removeTimerCancel}>
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