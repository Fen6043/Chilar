'use client'
import React, { useState , useRef, useEffect } from 'react'
import Toolbar from '../components/Toolbar'
import axios from 'axios';
import { useRouter } from 'next/navigation';

const Report = () => {
    interface Expense {
        item:string;
        cost:number;
        date:string;
    }
    const apiLoc = process.env.NEXT_PUBLIC_API_LOC
    const router = useRouter()
    const [loading,setLoading] = useState(true)
    const [expenseDetail, setExpenseDetail] = useState<Expense[]>([])
    const [budgetList, setBudgetList] = useState<{[key:string]:number}>({})
    const today = new Date()
    const startDate = useRef(today)
    const endDate = useRef(today)
    let monthRef = ""
    let yearRef = -1

    const verifyMe = async() =>{
      await axios.get(apiLoc+'api/auth/me',{withCredentials:true})
      .then(()=>{
          //console.log(response)
          setLoading(false)
      })
      .catch((err) =>{
        console.log(err)
        router.replace('/auth/login')
      })
    }

    useEffect(()=>{
      verifyMe()
    },[])

    const setDate = (e:React.ChangeEvent<HTMLInputElement>,type:string) => {
      const getDate = e.target.value
      const tosetDate = new Date(parseInt(getDate.split("-")[0]),parseInt(getDate.split("-")[1])-1,parseInt(getDate.split("-")[2]))
      if(type === "StartDate"){
        startDate.current = tosetDate
      }
      else{
        endDate.current = tosetDate
      }
      //console.log("s:",startDate.current,"e:",endDate.current)
    }

    const getBudgetofMonth = async() =>{
      try {
        const listofMonth:string[] = []
        const current: Date = new Date(startDate.current)
        current.setDate(1)
        //console.log(current,endDate.current)
        while (current<=endDate.current) {
          const month = current.toLocaleString('default',{ month: 'short'})
          const year = current.getFullYear()
          listofMonth.push(`${month} ${year}`)
          current.setMonth(current.getMonth() + 1)
        }

        //console.log(listofMonth)
        const response = await axios.get(apiLoc+"api/getBudgetOftheMonth",{
          params: {
            list: listofMonth
          },
          withCredentials:true
        })

        //console.log(response.data)
        setBudgetList(response.data)
      } catch (error) {
        console.log(error)
        return 0
      }
    }

    const getExpenseDetail= async() => {
      try {
        const response = await axios.get(`${apiLoc}api/getVariableExpenseListByDate/${startDate.current.toUTCString()}/${endDate.current.toUTCString()}`,{withCredentials:true})
        if(response.status === 200){
          //console.log(response.data)
          setExpenseDetail(response.data);
        } 
        else
          console.log(response)
      } catch (error) {
        console.log(error)
      }
    }

    const calculateTotalExpense = (monthparam:string,yearparam:number) =>{
        let Sum = 0; 
        expenseDetail.forEach(expense => {
          const localdate = new Date(expense.date)
          const getmonth = localdate.toDateString().split(" ")[1]
          const getyear = localdate.getFullYear()
          if(getmonth === monthparam && yearparam ===getyear){
            Sum = Sum + expense.cost
          }
        });

        return Sum;
    }

    if(loading){
      return(
        <div></div>
      )
    }
    else{
    return (
      <div>
          <Toolbar/>
          <div className=' flex justify-center p-2 mb-2 select-none'>
            <form className=' flex flex-col sm:flex-row' onSubmit={(e) => {e.preventDefault();getExpenseDetail();getBudgetofMonth()}}>
              <label htmlFor="from" className='p-2 font-mono'>From:</label>
              <input type='date' id='from' className=' border border-amber-500 rounded-xl p-2 mr-2'
                onChange={(e) => {setDate(e,"StartDate")}} required/>
              <label htmlFor='to' className='p-2 font-mono'>To:</label>
              <input type='date' id='to' className=' border border-amber-500 rounded-xl p-2 mr-2'
                onChange={(e) => {setDate(e,"EndDate")}} required/>
              <button type='submit' className='bg-cyan-700 hover:bg-cyan-900 py-2 px-3 mt-4 sm:mt-0 rounded-xl cursor-pointer'>Search</button>
            </form>
          </div>
          <div className=' grid grid-cols-3'>
            <div className=' col-span-3 sm:col-span-2 border' style={{backgroundColor:'var(--background)'}}>
              {expenseDetail.map((expense,index) => {
                  //console.log(expense.date)
                  const localdate = new Date(expense.date)
                  const month = localdate.toDateString().split(" ")[1]
                  const year = localdate.getFullYear()
                  let displayMonth = false;
                  let totalExpense = 0;
                  let totalBudget = 0;
                  
                  // console.log("outside gaga with -",month,monthRef,year,yearRef)
                  if (month !== monthRef || year !== yearRef){
                    monthRef = month
                    yearRef = year
                    displayMonth = true
                    totalExpense = calculateTotalExpense(month,year)
                    totalBudget = budgetList[`${month} ${year}`]
                    // console.log("enter gaga for -",month,displayMonth)
                  }
                  return(
                    <div key={index}>
                    {displayMonth && (
                      <div className='bg-cyan-800 p-1 flex justify-between'>
                        <div className='font-mono text-lg p-1'>{`${month} ${year}`}</div>
                        <div className=' flex'>
                          <div className='bg-green-800 rounded-2xl p-1 px-2 text-sm sm:text-lg mx-2'><u><b>Monthly Budget </b>{`- ${totalBudget.toFixed(2)}`}</u></div>
                          <div className='bg-rose-800 rounded-2xl p-1 px-2 text-sm sm:text-lg'><u><b>Total Expense </b>{`- ${totalExpense.toFixed(2)}`}</u></div>
                        </div>
                      </div>)}
                    {displayMonth && (
                      <div className='grid grid-cols-3 text-center border border-amber-500 font-mono font-bold'>
                        <div>Item</div>
                        <div>Cost</div>
                        <div>Date</div>
                      </div>)}
                    <div className='grid grid-cols-3 mb-2 text-center'>
                      <div>{expense.item}</div>
                      <div>{expense.cost}</div>
                      <div>{localdate.toDateString()}</div>
                    </div>
                    </div>)
                  })}
            </div>
            <div className='border border-amber-900'>

            </div>
          </div>
      </div>
    )
  }
}

export default Report