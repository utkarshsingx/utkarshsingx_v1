import React from 'react';

interface ButtonProps {
  title: string;
}

const Button: React.FC<ButtonProps> = ({ title }) => {
  return (
    <div className={`font-mono cursor-pointer min-h-[44px] ${title === 'Resume' ? 'py-2' : ''} flex p-4 items-center justify-center border-[1px] border-primary text-primary rounded-md max-w-fit hover:-translate-x-1 hover:-translate-y-1 active:scale-[0.98] duration-200 btn_hover_shadow`}>{title}</div>
  );
};

export default Button;
