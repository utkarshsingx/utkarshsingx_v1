import React from 'react'
import { FiGithub, FiLinkedin } from "react-icons/fi"
import { FaXTwitter } from "react-icons/fa6"

const LeftSidebar = () => {
  return (
    <div className=' p-2 max-w-fit flex-col items-center fixed bottom-0 text-lightest_slate lg:flex hidden'>
        <div className='flex flex-col gap-4 text-2xl '>
            <a href='https://github.com/utkarshsingx' target='_blank' rel="noreferrer"><FiGithub className='  hover:text-primary cursor-pointer duration-200'/></a>
            <a href='https://www.linkedin.com/in/utkarsh-singh-0b9090227/' target='_blank' rel="noreferrer"><FaXTwitter className='  hover:text-primary cursor-pointer duration-200'/></a>
            <a href='https://twitter.com/utkarshsingx' target='_blank' rel="noreferrer"><FiLinkedin className='  hover:text-primary cursor-pointer duration-200'/></a>
        </div>

        <div className='h-[130px] bg-lightest_slate w-[1px] mt-8'>
        </div>
    </div>
  )
}

export default LeftSidebar