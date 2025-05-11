import React from 'react'

const Homepage = () => {
  return (
    <div className='flex flex-col items-center'>
      <select className='my-4 p-2 border-2 shadow-amber-500 focus:border-amber-500 hover:shadow-2xl'>
        <option className='bg-amber-500'>Daily</option>
        <option className='bg-amber-500'>Monthly</option>
      </select>
      <div className='bg-emerald-700 my-2 p-36 rounded-full'>300</div>
      <table className="table-auto mt-4 border-2 border-amber-500 min-w-[400px]">
        <thead>
          <tr className='text-left'>
            <th className=" px-6 py-2">Details</th>
            <th className=" px-4 py-2">Expense</th>
            <th className=" px-4 py-2">Date</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className=" px-6 py-2">Auto</td>
            <td className=" px-4 py-2">Rs 200</td>
            <td className=" px-4 py-2">20-12-1999</td>
          </tr>
          <tr>
            <td className=" px-6 py-2">Grocery</td>
            <td className=" px-4 py-2">RS 150</td>
            <td className=" px-4 py-2">20-12-1999</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default Homepage