import React, { Children } from 'react'

interface ButtonProps{
  children:React.ReactNode;
  bgColor?:string
  onClick?:()=>void;
  type?: 'button' | 'submit' |'reset';
  disabled?: boolean;
  className?: string;
}

const Button:React.FC<ButtonProps> = ({
  children,
  bgColor = 'bg-blue-600',
  onClick,
  type="button",
  disabled=false,
  className='',
  ...props
}) => {
  return (
    <button 
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 w-full rounded text-white hover:bg-opacity-90 disabled:bg-gray-400 ${bgColor} ${className}`}{...props}

    >{children}</button>
  )
}

export default Button