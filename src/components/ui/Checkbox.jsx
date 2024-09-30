import React, { useEffect, useState } from 'react';
import { CheckboxIcon } from '../../assets/icons';

const Checkbox = ({
    primaryText,
    subText = '',
    checked = false,
    onChange = () => { },
    darkMode = false,
    className = '',
    ...props
}) => {

    return (
        <label
            {...props}
            className={`flex items-center cursor-pointer ${'text-gray-800'
                } ${className}`}
            role="checkbox"
            aria-checked={checked}
            aria-label={`Checkbox for ${primaryText}`}
        >
            <input
                type="checkbox"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
                className="hidden"
            />
            <span
                className={`inline-flex items-center justify-center border ${'border-gray-300'
                    } rounded w-6 h-6 ${checked
                        ? 'bg-green-500 border-green-600'
                        : ''
                    } hover:opacity-70`}
            >
                {checked && (
                    <img
                        src={CheckboxIcon}
                        alt="checkmark"
                        width={10}
                        height={10}
                        className={`w-3 h-3`}
                    />
                )}
            </span>
            <div className="flex flex-col">
                <p className={`text-sm font-medium ${subText ? 'mb-1' : ''}`}>
                    {primaryText}
                </p>
                {subText && (
                    <p className="text-xs text-gray-500">{subText}</p>
                )}
            </div>
        </label>
    );
};

export default Checkbox;
