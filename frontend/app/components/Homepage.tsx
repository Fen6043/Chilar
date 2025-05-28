"use client"
import axios from 'axios';
import React, { useEffect, useState } from 'react'

const Homepage = () => {
  interface Expense {
    _id:string;
    item:string;
    cost:number;
    date:string;
  }

  const [activeTab,setActiveTab] = useState<string>("Daily")
  const [monthlyFixedBudget,setMonthlyFixedBudget] = useState(0);
  const [dailyFixedBudget,setDailyFixedBudget] = useState(0);
  const [monthlyVariableExpense,setMontlyVariableExpense] = useState(0)
  const [dailyVariableExpense,setDailyVariableExpense] =useState(0)
  const [item, setItem] = useState("")
  const [cost, setCost] = useState(0)
  const today = new Date();
  today.setHours(0,0,0,0)
  const lastday = new Date(today.getFullYear(),today.getMonth()+1,0,23,59,59,999)

  const formatDate = (date: Date) => {
    const tdate = date.getDate()
    const tmonth = date.getMonth()
    const tyear = date.getFullYear()

    return `${tyear}-0${tmonth+1}-${tdate}`
  }

  const [sdate, setSDate] = useState(formatDate(today))
  const [expenseDetail, setExpenseDetail] = useState<Expense[]>([])

  const getExpenseDetail= async() => {
    await axios.get("http://localhost:5000/api/getVariableExpenseList/4")
    .then((response) => {setExpenseDetail(response.data);})
    .catch((error)=>{console.log(error)})
  }

  const getBudgetorExpense = async() => {
    let monthlyFixedBudget = 0; //Total income - Monthly Fixed expense
    let dailyFixedBudget = 0;
    let monthlyVariableExpense = 0;
    let dailyVariableExpense = 0;
    await axios.get("http://localhost:5000/api/getFixedBudget")
    .then((response) => {monthlyFixedBudget = response.data.totalfixedBudget;})
    .catch((err) => {console.log("Error occured while fetching Budget",err)})

    await axios.get(`http://localhost:5000/api/getVariableExpense/${today.toUTCString()}`)
    .then((response) => {
      //console.log(response.data);
      setDailyVariableExpense(response.data.dailyVariableExpense);
      setMontlyVariableExpense(response.data.monthlyVariableExpense);
      monthlyVariableExpense = response.data.monthlyVariableExpense;
      dailyVariableExpense = response.data.dailyVariableExpense;
    })
    .catch((err) => {console.log("error occured while getting expense",err)})

    dailyFixedBudget = (monthlyFixedBudget-monthlyVariableExpense+dailyVariableExpense) / (lastday.getDate()-today.getDate()+1)
    //console.log("daily fixed budget set to :",dailyFixedBudget)
    setDailyFixedBudget(dailyFixedBudget)
    setMonthlyFixedBudget(monthlyFixedBudget)
  }

  useEffect(() => {
    console.log("start")
    getBudgetorExpense()
    getExpenseDetail()
  })

  const addToExpense = async(event:React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const sendlocalDate = new Date(parseInt(sdate.split("-")[0]),parseInt(sdate.split("-")[1])-1,parseInt(sdate.split("-")[2]))
    //console.log(sendlocalDate)
    const temp = {item:item,cost:cost,date:sendlocalDate}
    await axios.post("http://localhost:5000/api/addvariableExpense",temp)
    .then((response) => {console.log(response.data)})
    .catch((error) => {console.log("error occured while posting variableExpense",error)})
    getExpenseDetail()

    const getMonth1 = sdate.split("-")[1];
    const getMonth2 = formatDate(today).split("-")[1];
    const getYear1  = sdate.split("-")[0];
    const getYear2  = formatDate(today).split("-")[0];
    if(sdate === formatDate(today)){
      setDailyVariableExpense(dailyVariableExpense+cost)
    }
    else{
      //recalculate daily budget
      getBudgetorExpense()
    }
    if(getYear2 === getYear1 && getMonth2 ===getMonth1){
      setMontlyVariableExpense(monthlyVariableExpense+cost)
    }
  }

  const undoLatestEntry = async() => {
    await axios.delete("http://localhost:5000/api/deleteLatestVariableExpense")
    .then((response) => {console.log(response)})
    .catch((err) => {console.log(err)})

    getExpenseDetail()
    getBudgetorExpense()
  }
  
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
      <div className={`my-2 w-[300px] h-[300px] rounded-full flex justify-center items-center font-mono font-bold ${(activeTab === "Daily" && (dailyFixedBudget-dailyVariableExpense)>=0) || (activeTab === "Monthly" && (monthlyFixedBudget-monthlyVariableExpense)>=0)?'bg-emerald-600':'bg-rose-600'}`}>
        {(activeTab === "Daily")?Math.floor(dailyFixedBudget-dailyVariableExpense):monthlyFixedBudget-monthlyVariableExpense}
      </div>
      
      <div className=' w-full items-center justify-center flex'>
        <div className=' border border-amber-500 mt-6 rounded-xl'>
          <form className=' justify-center grid grid-cols-3 gap-x-2' onSubmit={(e) => addToExpense(e)}>
            <input className=' px-4 py-2 m-2 border border-emerald-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700' onChange={(e)=>{setItem(e.target.value)}} placeholder='Item' required/>
            <input type='number' className=' px-4 py-2 m-2 border border-emerald-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700' onChange={(e)=>{setCost(Number(e.target.value))}} placeholder='Cost'/>
            <input type='date' value={sdate} className=' px-4 py-2 m-2 border border-emerald-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700' style={{ colorScheme: "dark" }}
            onChange = {(e) => {setSDate(e.target.value)}}/>
            
            <table className="table-auto select-none my-4 ml-2 border-2 col-span-2 border-amber-500 min-w-[100px]">
              <thead>
                <tr className='text-center'>
                  <th className=" px-6 py-2">Details</th>
                  <th className=" px-4 py-2">Expense</th>
                  <th className=" px-4 py-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {expenseDetail.map((expense,index) => {
                  const localdate = new Date(expense.date)
                  return(
                  <tr key={index} className='text-center'>
                    <td className=" px-6 py-2">{expense.item}</td>
                    <td className=" px-4 py-2">{expense.cost}</td>
                    <td className=" px-4 py-2">{localdate.toDateString()}</td>
                  </tr>)
                })}

              </tbody>
            </table>

            <div className='w-full my-4 flex flex-col items-end sm:items-center'>
                <button type='submit' className=' h-10 w-1/2 sm:w-3/4 mr-2 bg-amber-500 rounded-full cursor-pointer select-none hover:bg-amber-700 font-bold'>Submit</button>
                <button type='reset' className=' h-10 w-1/2 sm:w-3/4 mr-2 bg-rose-500 rounded-full cursor-pointer select-none hover:bg-rose-700 font-bold mt-2' onClick={undoLatestEntry}>Undo</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Homepage