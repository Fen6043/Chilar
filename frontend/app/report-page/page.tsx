'use client'
import React, { useState , useEffect } from 'react'
import Toolbar from '../components/Toolbar'
import axios from 'axios';

const Report = () => {
    interface Expense {
        item:string;
        cost:number;
        date:string;
    }

    const [expenseDetail, setExpenseDetail] = useState<Expense[]>([])

    const getExpenseDetail= async() => {
        await axios.get("http://localhost:5000/api/getVariableExpense/0")
        .then((response) => {setExpenseDetail(response.data);console.log(typeof(response.data[0].date))})
        .catch((error)=>{console.log(error)})
    }

    useEffect(() => {
      getExpenseDetail()
    },[])

    return (
      <div>
          <Toolbar/>
          <div className=' flex justify-center'>
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
      </div>
    )
}

export default Report