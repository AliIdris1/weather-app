import React from 'react'
import { cn } from '../utils/cn'



const Container = (props: React.HTMLProps<HTMLDivElement>) => {
  return (
    <div 
    {...props}
    className={cn("w-full bg-white border rounded-xl py-4 flex shadow-sm", props.className)}/>
  )
}

export default Container