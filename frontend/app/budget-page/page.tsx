'use client'
import React, { FormEvent, useState } from 'react'
import Toolbar from '../components/Toolbar'

const Budget = () => {
    interface Budget {
        item: string;
        cost: number;
    }

    const [item,setItem] = useState("")
    const [cost,setCost] = useState(0)
    const [tableData,setTableData] = useState<Budget[]>([])
    //submit form
    const formsubmit = (e: FormEvent<HTMLFormElement>) =>{
        e.preventDefault();
        let tempdata:Budget[] = []
        if (tableData !== undefined){
            tempdata = [...tableData]
        }
        tempdata.push({item,cost})
        setTableData(tempdata)
        console.log("submited",tableData)
    }

  return (
    <>
    <Toolbar></Toolbar>
    <div className=' w-full justify-center flex'>
    <form className=' items-center justify-center grid grid-cols-3' onSubmit={(e) => formsubmit(e)}>
        <input className=' px-4 py-2 m-2 border border-emerald-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700' onChange={(e)=>{setItem(e.target.value)}} placeholder='Item'/>
        <input className=' px-4 py-2 m-2 border border-emerald-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700' onChange={(e)=>{setCost(Number(e.target.value))}} placeholder='Cost'/>
        <button type='submit' className='px-4 py-2 m-2 bg-amber-500 rounded-full cursor-pointer hover:bg-amber-700 font-bold'>Submit</button>
    </form>
    </div>
    <div className=' mt-2 justify-center flex'>
        <table className=' border-2 border-amber-600 table-auto w-1/2'>
            <thead className=' border-2 border-amber-600 '>
                <tr>
                    <th className='p-2 w-1/4'>Expense Item</th>
                    <th className='p-2 w-1/4'>Cost</th>
                </tr>
            </thead>
            <tbody>
                {tableData.map((row,index) => {
                    return(
                    <tr key={index}>
                        <td className='p-2 w-1/4 text-center'>{row.item}</td>
                        <td className='p-2 w-1/4 text-center'>{row.cost}</td>
                    </tr>)
                })}
            </tbody>
        </table>
    </div>
    </>
  )
}

export default Budget