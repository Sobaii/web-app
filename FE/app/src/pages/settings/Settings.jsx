import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Input from '../../components/Input';
import SettingsGeneral from './components/SettingsGeneral';
import SettingsBilling from './components/SettingsBilling';
import SettingsInvoices from './components/SettingsInvoices';
import SettingsSecurity from './components/SettingsSecurity';

function Settings() {
  const [search, setSearch] = useState('');

  const location = useLocation();
  const navigate = useNavigate()

  const searchParams = new URLSearchParams(location.search);
  const section = searchParams.get('section');

  const renderPage = () => {
    switch (section) {
      case 'general':
        return <SettingsGeneral />;
      case 'billing':
        return <SettingsBilling />;
      case 'invoices':
        return <SettingsInvoices />;
      case 'security':
        return <SettingsSecurity />;
      default:
        return <h2>Page Not Found</h2>;
    }
  };

  const isSelected = (pageName) => {
    return section === pageName ? 'font-bold' : '';
  };

  const navigateToSection = (sectionName) => {
    navigate(`/settings?section=${sectionName}`);
  };

  return (
    <div className='flex flex-col gap-4'>
      <h1>Settings</h1>
      <hr />
      <div className='flex gap-10'>
        <div className='flex flex-col'>
          <Input placeHolder='Search...' value={search} onChange={(e) => setSearch(e.target.value)} />
          <div className='flex flex-col'>
            <p onClick={() => navigateToSection('general')} className={`rounded-md mt-5 p-3 hover:bg-neutral-200 cursor-pointer ${isSelected('general')}`}>General</p>
            <p onClick={() => navigateToSection('billing')} className={`rounded-md p-3 hover:bg-neutral-200 cursor-pointer ${isSelected('billing')}`}>Billing</p>
            <p onClick={() => navigateToSection('invoices')} className={`rounded-md p-3 hover:bg-neutral-200 cursor-pointer ${isSelected('invoices')}`}>Invoices</p>
            <p onClick={() => navigateToSection('security')} className={`rounded-md p-3 hover:bg-neutral-200 cursor-pointer ${isSelected('security')}`}>Security & Privacy</p>
          </div>
        </div>
        <div className='flex w-full flex-col gap-6'>
          {renderPage()}
        </div>
      </div>
    </div>
  );
}

export default Settings;
