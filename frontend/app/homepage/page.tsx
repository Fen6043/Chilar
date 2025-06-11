"use client"
import axios from 'axios';
import Image from "next/image";
import React, { useEffect, useState } from 'react'
import Toolbar from '../components/Toolbar';
import { useRouter } from 'next/navigation';
import CircularProgress from '../components/CircularProgress';

const Homepage = () => {
  interface Expense {
    _id:string;
    item:string;
    cost:number;
    date:string;
  }

  const router = useRouter()
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
  const [modal,setModal] = useState(false)

  const formatDate = (date: Date) => {
    const month = (date.getMonth() + 1).toString().padStart(2,'0')
    const day = (date.getDate()).toString().padStart(2,'0')
    return `${date.getFullYear()}-${month}-${day}`
  }

  const [sdate, setSDate] = useState(formatDate(today))
  const [expenseDetail, setExpenseDetail] = useState<Expense[]>([])

  const getExpenseDetail= async() => {
    await axios.get("http://localhost:5000/api/getVariableExpenseList/4")
    .then((response) => {setExpenseDetail(response.data);})
    .catch((error)=>{console.log(error)})
  }

  const getBudgetorExpense = async () => {
    let monthlyFixedBudget = 0;//Total income - Monthly Fixed expense
    let dailyFixedBudget = 0;
    let monthlyVariableExpense = 0;
    let dailyVariableExpense = 0;

    try {
      const dateString = today.toDateString()
      const response = await axios.get(`http://localhost:5000/api/checkifBudgetSet/${dateString.split(" ")[1]} ${dateString.split(" ")[3]}`);
      //console.log(dateString.split(" ")[1],dateString.split(" ")[3])
      const isBudgetSet = response.data;

      setModal(!isBudgetSet);

      if (!isBudgetSet) {
        localStorage.setItem("isBudgetSet","No")
        return;
      }

      // Get fixed budget
      const fixedBudgetResponse = await axios.get("http://localhost:5000/api/getFixedBudget");
      monthlyFixedBudget = fixedBudgetResponse.data?.totalfixedBudget;

      // Get variable expense
      const variableExpenseResponse = await axios.get(`http://localhost:5000/api/getVariableExpense/${today.toUTCString()}`);
      dailyVariableExpense = variableExpenseResponse.data?.dailyVariableExpense;
      monthlyVariableExpense = variableExpenseResponse.data?.monthlyVariableExpense;

      setDailyVariableExpense(dailyVariableExpense);
      setMontlyVariableExpense(monthlyVariableExpense);

      const daysRemaining = lastday.getDate() - today.getDate() + 1;
      dailyFixedBudget = (monthlyFixedBudget - monthlyVariableExpense + dailyVariableExpense) / daysRemaining;

      setDailyFixedBudget(dailyFixedBudget);
      setMonthlyFixedBudget(monthlyFixedBudget);
    } catch (error) {
      console.error("An error occurred in getBudgetorExpense:", error);
    }
  }

  useEffect(() => {
    console.log("start")
    getBudgetorExpense()
    getExpenseDetail()
  },[])

  const addToExpense = async(event:React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const localDate = new Date(parseInt(sdate.split("-")[0]),parseInt(sdate.split("-")[1])-1,parseInt(sdate.split("-")[2]))
    //const testTime = new Date("2025-05-27")
    //console.log("testtime - ",testTime.toISOString())
    //console.log(sendlocalDate)
    const temp = {item:item,cost:cost,date:localDate.toUTCString()}
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
    <>
    <Toolbar/>
    <div className='flex flex-col items-center'>
      <div className=' w-full flex items-center justify-center'>
        <div className=' flex'>
          <div className={`absolute rounded-2xl m-2 bg-amber-500 w-[120px] h-[44px] z-0 border-2 transition-transform duration-200 ${activeTab === "Daily"?" translate-x-0":" translate-x-[136px]"}`}/>
          <button className=' p-2 px-4 rounded-2xl m-2 min-w-[120px] h-[44px] text-center z-10 border-2 cursor-pointer font-mono' onClick={()=>{setActiveTab("Daily")}}>Daily</button>
          <button className=' p-2 px-4 rounded-2xl m-2 min-w-[120px] h-[44px] text-center z-10 border-2 cursor-pointer font-mono' onClick={()=>{setActiveTab("Monthly")}}>Monthly</button>
        </div>
      </div>

      {/* Budget Circle */}
      {/* <div className={`my-2 w-[300px] h-[300px] rounded-full flex justify-center items-center font-mono font-bold transition-colors duration-1000 ${(activeTab === "Daily" && (dailyFixedBudget-dailyVariableExpense)>=0) || (activeTab === "Monthly" && (monthlyFixedBudget-monthlyVariableExpense)>=0)?'bg-emerald-700':'bg-rose-700'}`}>
        {(activeTab === "Daily")?Math.floor(dailyFixedBudget-dailyVariableExpense):monthlyFixedBudget-monthlyVariableExpense}
      </div> */}
      {
        (activeTab === "Daily")?
        <CircularProgress value={parseFloat((((dailyFixedBudget - dailyVariableExpense)/dailyFixedBudget)*100).toFixed(2)) || 0} size ={300} remaining={dailyFixedBudget-dailyVariableExpense} outoff={dailyFixedBudget}/>:
        <CircularProgress value={parseFloat((((monthlyFixedBudget - monthlyVariableExpense)/monthlyFixedBudget)*100).toFixed(2)) || 0} size ={300} remaining={monthlyFixedBudget-monthlyVariableExpense} outoff={monthlyFixedBudget}/>
      }
      
      <div className=' w-full items-center justify-center flex'>
        <div className=' border border-amber-500 mt-6 p-1 rounded-xl' style={{backgroundColor: 'var(--background)'}}>
          <form className=' justify-center grid grid-cols-3 gap-x-2' onSubmit={(e) => addToExpense(e)}>
            <input className=' px-4 py-2 m-2 border border-emerald-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700' onChange={(e)=>{setItem(e.target.value)}} placeholder='Item' required/>
            <input type='number' step="any" className=' px-4 py-2 m-2 border border-emerald-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700' onChange={(e)=>{setCost(Number(e.target.value))}} placeholder='Cost'/>
            <input type='date' value={sdate} className=' px-4 py-2 m-2 border border-emerald-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700'
            onChange = {(e) => {setSDate(e.target.value)}}/>
            
            <table className="table-auto select-none my-4 ml-2 border-2 col-span-3 sm:col-span-2 border-amber-500 min-w-[100px]">
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
                  // console.log("test")
                  return(
                  <tr key={index} className='text-center'>
                    <td className=" px-6 py-2">{expense.item}</td>
                    <td className=" px-4 py-2">{expense.cost}</td>
                    <td className=" px-4 py-2">{localdate.toDateString()}</td>
                  </tr>)
                })}

              </tbody>
            </table>

            <div className='w-full col-span-3 sm:col-span-1 my-4 flex flex-col items-center'>
                <button type='submit' className=' h-10 w-1/2 mr-2 bg-amber-500 rounded-full cursor-pointer select-none hover:bg-amber-700 font-bold'>Submit</button>
                <button type='reset' className=' h-10 w-1/2 mr-2 bg-rose-500 rounded-full cursor-pointer select-none hover:bg-rose-700 font-bold mt-2' onClick={undoLatestEntry}>Undo</button>
            </div>
          </form>
        </div>
      </div>
    </div>
    
    
    {modal && <div className=' bg-stone-900 opacity-80 fixed top-0 left-0 w-screen h-screen z-20'/>}
    {modal && 
      <div className=' w-1/2 h-1/2 bg-green-800 opacity-100 z-30 fixed top-1/4 left-1/4 border border-amber-600 rounded-2xl flex flex-col justify-between items-center'>
        <Image src="/assets/Logo.png" alt="PropLogo" width={100} height={100}/>
        <p className='text-amber-500 text-2xl font-mono p-4 m-1'><b className='text-amber-50'>Hi,</b> could you please verify the budget that should be set for this month</p>
        <button className='bg-amber-600 p-2 relative bottom-4 rounded-2xl font-mono font-bold cursor-pointer' onClick={() => {router.push("/budget-page")}}>Take me there</button>
      </div>
    }
    </>
  )
}

export default Homepage