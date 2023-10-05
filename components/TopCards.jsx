import React from 'react'

function TopCards() {
    return (
        <div className='grid lg:grid-cols-5 gap-4 p-4'>
            <div className='lg:col-span-2 col-span-1 bg-white flex justify-between w-full border p-4 rounded-lg'>
                <div className='felx-col w-full pb-4'>
                    <p className='text-2xl font-bold'>Rp. 2000.000</p>
                    <p className='text-gray-600'>Total Tagihan</p>
                </div>
            </div>
            <div className='lg:col-span-2 col-span-1 bg-white flex justify-between w-full border p-4 rounded-lg'>
                <div className='felx-col w-full pb-4'>
                    <p className='text-2xl font-bold'>Rp. 2000.000</p>
                    <p className='text-gray-600'>Tagihan Dibayar</p>
                </div>
            </div>
            <div className='bg-white flex justify-between w-full border p-4 rounded-lg'>
                <div className='felx-col w-full pb-4'>
                    <p className='text-2xl font-bold'>Rp. 2000.000</p>
                    <p className='text-gray-600'>Tagihan Belum Dibayar</p>
                </div>
            </div>
        </div>
    )
}

export default TopCards