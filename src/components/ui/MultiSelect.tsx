import React, { useState } from 'react';
import { Button, Popover } from './index';
import { DropdownArrowIcon } from '../../assets/icons';
import formatCamelCase from '../../util/formatCamelCase';

const MultiSelect = ({ selected, setSelected, darkMode = false, queries, placeholder = 'Search', ...props }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleOnClick = (query) => {
        if (selected.includes(query)) {
            setSelected(selected.filter(item => item !== query));
        } else {
            setSelected([...selected, query]);
        }
    };

    const formattedButtonText = selected.length
        ? selected.map(formatCamelCase).join(', ')
        : placeholder;

    return (
        <Popover isOpen={isOpen} setIsOpen={setIsOpen} className={`flex flex-col gap-2.5 ${darkMode ? 'dark' : ''}`} {...props}>
            <Button variant='outline' text={formattedButtonText} imageSrc={DropdownArrowIcon} />
            <div className='flex flex-col gap-1 shadow-md bg-white border p-1 w-full rounded-lg'>
                {queries.sort((a, b) => a.localeCompare(b)).map((query, index) => (
                    <div className="flex items-center gap-3 p-1 px-2 rounded-md hover:bg-neutral-200 cursor-pointer" onClick={() => handleOnClick(query)} key={index}>
                        <p className={`font-semibold ${selected.includes(query) ? 'text-green-600' : 'text-neutral-500'}`}>{formatCamelCase(query)}</p>
                        {selected.includes(query) && <h6 className="text-green-600">Selected</h6>}
                    </div>
                ))}
            </div>
        </Popover>
    );
};

export default MultiSelect;
