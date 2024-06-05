"use client"
import React, { ReactNode, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Input } from '@/components/input';

export default function SettingsLayout({ children }: { children: ReactNode }) {
  const [search, setSearch] = useState('');
  const router = useRouter();
  const pathname = usePathname();

  const isSelected = (pageName: string) => {
    const currentPath = pathname.split('/').pop();
    return currentPath === pageName ? 'font-bold' : '';
  };

  const navigateToSection = (sectionName: string) => {
    router.push(`/app/settings/${sectionName}`);
  };

  return (
    <div className='flex flex-col gap-4'>
      <h1>Settings</h1>
      <hr />
      <div className='flex gap-10'>
        <div className='flex flex-col'>
          <Input placeholder='Search...' value={search} onChange={(e) => setSearch(e.target.value)} />
          <div className='flex flex-col'>
            <p onClick={() => navigateToSection('general')} className={`rounded-md mt-5 p-3 hover:bg-neutral-200 cursor-pointer ${isSelected('general')}`}>General</p>
            <p onClick={() => navigateToSection('billing')} className={`rounded-md p-3 hover:bg-neutral-200 cursor-pointer ${isSelected('billing')}`}>Billing</p>
            <p onClick={() => navigateToSection('invoices')} className={`rounded-md p-3 hover:bg-neutral-200 cursor-pointer ${isSelected('invoices')}`}>Invoices</p>
            <p onClick={() => navigateToSection('security')} className={`rounded-md p-3 hover:bg-neutral-200 cursor-pointer ${isSelected('security')}`}>Security & Privacy</p>
          </div>
        </div>
        <div className='flex w-full flex-col gap-6'>
          {children}
        </div>
      </div>
    </div>
  );
}
