"use client"
import axios from 'axios';
import React, { useEffect, useState } from 'react'

const Homepage = () => {
  interface Expense {
    item:string;
    cost:number;
    date:string;
  }

  const [activeTab,setActiveTab] = useState<string>("Daily")
  const [monthlyBudget,setMonthlyBudget] = useState(0);
  const [dailyBudget,setDailyBudget] = useState(0);
  const [item, setItem] = useState("")
  const [cost, setCost] = useState(0)
  const today = new Date();
  // const lastDay = new Date(today.getFullYear(),today.getMonth()+1,0);
  const formatDate = () => {
    const tdate = today.getDate()
    const tmonth = today.getMonth()
    const tyear = today.getFullYear()

    return `${tyear}-0${tmonth+1}-${tdate}`
  }
  const [sdate, setSDate] = useState(formatDate)
  const [expenseDetail, setExpenseDetail] = useState<Expense[]>([])

  const getExpenseDetail= async() => {
    await axios.get("http://localhost:5000/api/getVariableExpense/4")
    .then((response) => {setExpenseDetail(response.data);console.log(typeof(response.data[0].date))})
    .catch((error)=>{console.log(error)})
  }

  useEffect(() => {
    getExpenseDetail()
  },[])

  const addToExpense = async(event:React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const temp = {item:item,cost:cost,date:sdate}
    await axios.post("http://localhost:5000/api/addvariableExpense",temp)
    .then((response) => {console.log(response.data)})
    .catch((error) => {console.log("error occured while posting variableExpense",error)})
    getExpenseDetail()
  }

  const getBudget = async() => {
    await axios.get("http://localhost:5000/api/getBudget")
    .then((response) => {setMonthlyBudget(response.data.totalBuget); setDailyBudget(Math.floor(response.data.totalBuget/31)); console.log(response.data)})
    .catch((err) => {console.log("Error occured while fetching Budget",err)})
  }

  useEffect(()=>{
    getBudget()
  },[])
  
  return (
    <div className='flex flex-col items-center'>
      <div className=' w-full flex items-center justify-center'>
        <div className=' flex'>
          <div className={`absolute rounded-2xl m-2 bg-amber-500 w-[120px] h-[44px] z-0 border-2 transition-transform duration-200 ${activeTab === "Daily"?" translate-x-0":" translate-x-[136px]"}`}/>
          <button className=' p-2 px-4 rounded-2xl m-2 min-w-[120px] text-center z-10 border-2 cursor-pointer font-mono' onClick={()=>{setActiveTab("Daily")}}>Daily</button>
          <button className=' p-2 px-4 rounded-2xl m-2 min-w-[120px] text-center z-20 border-2 cursor-pointer font-mono' onClick={()=>{setActiveTab("Monthly")}}>Monthly</button>
        </div>
      </div>

      {/* Budget Circle */}
      <div className={`my-2 w-[300px] h-[300px] rounded-full flex justify-center items-center font-mono font-bold ${(activeTab === "Daily" && dailyBudget>=0) || (activeTab === "Monthly" && monthlyBudget>=0)?'bg-emerald-600':'bg-rose-600'}`}>{(activeTab === "Daily")?dailyBudget:monthlyBudget}</div>
      
      <div className=' w-full items-center justify-center flex'>
        <div className=' border border-amber-500 mt-6 rounded-xl'>
          <form className=' items-center justify-center grid grid-cols-4' onSubmit={(e) => addToExpense(e)}>
            <input className=' px-4 py-2 m-2 border border-emerald-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700' onChange={(e)=>{setItem(e.target.value)}} placeholder='Item' required/>
            <input type='number' className=' px-4 py-2 m-2 border border-emerald-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700' onChange={(e)=>{setCost(Number(e.target.value))}} placeholder='Cost'/>
            <input type='date' value={sdate} className=' px-4 py-2 m-2 border border-emerald-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700' style={{ colorScheme: "dark" }}
            onChange = {(e) => {setSDate(e.target.value)}}/>
            
            <button type='submit' className='px-4 py-2 m-2 bg-amber-500 rounded-full cursor-pointer select-none hover:bg-amber-700 font-bold'>Submit</button>
          </form>
        </div>
      </div>

      <table className="table-auto mt-4 border-2 border-amber-500 min-w-[400px]">
        <thead>
          <tr className='text-center'>
            <th className=" px-6 py-2">Details</th>
            <th className=" px-4 py-2">Expense</th>
            <th className=" px-4 py-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {expenseDetail.map((expense,index) => {
            return(
            <tr key={index} className='text-center'>
              <td className=" px-6 py-2">{expense.item}</td>
              <td className=" px-4 py-2">{expense.cost}</td>
              <td className=" px-4 py-2">{expense.date.split("T")[0]}</td>
            </tr>)
          })}
          
        </tbody>
      </table>
    </div>
  )
}

export default Homepage