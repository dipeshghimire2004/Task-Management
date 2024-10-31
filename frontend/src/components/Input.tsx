import React, { useId } from 'react';
import { InputHTMLAttributes, FC } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  className?: string;
}

const Input: FC<InputProps> = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, className = '', type = 'text', ...props }, ref) => {
    const id = useId();
    return (
      <div className="mb-4">
        {label && (
          <label htmlFor={id} className="block mb-1 text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        <input
          type={type}
          id={id}
          ref={ref}
          className={`w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
          {...props}
        />
      </div>
    );
  }
);

export default Input;
