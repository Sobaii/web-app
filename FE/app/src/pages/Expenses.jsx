import React, { useState, useEffect, useCallback } from "react";
import DataTable from "../components/DataTable";
import ConfidenceGradient from "../components/ConfidenceGradient";
import Input from "../components/Input";
import Button from "../components/Button";
import { getUserSpreadsheetsShallowInfo } from "../services/userServices";
import Card from "../components/Card";
import { useNavigate } from "react-router-dom";
import getBackgroundColor from "../util/getBackgroundColor";
import Modal from "../components/Modal";
import { createSpreadsheet, deleteSpreadsheet } from "../services/expenseServices";
import EllipsisIcon from '../assets/ellipsis.svg'
import Loader from "../components/Loader";
import Icon from "../components/Icon";
import Popover from "../components/Popover";

function Expenses() {
  const [search, setSearch] = useState("");
  const [spreadsheets, setSpreadsheets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [spreadsheetToDelete, setSpreadsheetToDelete] = useState(null);
  const [spreadsheetName, setSpreadsheetName] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const getSpreadsheetShallowData = async () => {
      setLoading(true);
      try {
        const response = await getUserSpreadsheetsShallowInfo();
        setSpreadsheets(response);
      } catch (error) {
        console.error("Error getting spreadsheet shallow data", error);
      }
      setLoading(false);
    };
    getSpreadsheetShallowData();
  }, []);

  const handleCreateSpreadsheet = async () => {
    if (!spreadsheetName) return;
    try {
      const response = await createSpreadsheet(spreadsheetName);
      navigate(`/expenses/spreadsheet?spreadsheet=${response._id}`);
    } catch (error) {
      console.error("Error creating spreadsheet", error);
    }
  };

  const handleDeleteSpreadsheet = async () => {
    try {
      await deleteSpreadsheet(spreadsheetToDelete.id);
      setSpreadsheets(spreadsheets.filter(spreadsheet => spreadsheet.id !== spreadsheetToDelete.id));
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Error deleting spreadsheet", error);
    }
  }

  const filteredSpreadsheets = spreadsheets.filter(spreadsheet =>
    spreadsheet.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex w-full gap-4">
          <Input placeholder="Search collections" fullWidth value={search} onChange={(e) => setSearch(e.target.value)} />
          <Button text='Create new collection' handleClick={() => setShowCreateModal(true)} />
        </div>
        <div className="grid grid-min-max gap-4">
          {loading ? <Loader /> : (
            filteredSpreadsheets.length === 0 ? <p>No spreadsheets found</p>
              :
              filteredSpreadsheets.map((spreadsheet, index) => (
                <Card key={index} className='col-span-1 hover:shadow-xl hover:border-neutral-800 transition-shadow cursor-pointer flex' onClick={() => navigate(`/expenses/spreadsheet?spreadsheet=${spreadsheet.id}`)}>
                  <div className='flex gap-3 justify-between'>
                    <h2 className="whitespace-nowrap truncate">{spreadsheet.name}</h2>
                    <Popover position="down-left">
                      <Icon image={EllipsisIcon} />
                      <Card className='w-fit p-2'>
                        <Button handleClick={() => { setShowDeleteModal(true); setSpreadsheetToDelete(spreadsheet) }} text='Delete' variant='destructive' />
                      </Card>
                    </Popover>
                  </div>
                  <p>{spreadsheet.numberOfExpenses} items</p>
                  <div className="flex flex-col border">
                    {spreadsheet.confidenceOverview.map((expense, index) => {
                      return (
                        <div key={index} className="flex">
                          {Object.keys(expense).map((key, index) => (
                            <p key={index} style={{ backgroundColor: getBackgroundColor(expense[key]?.confidence || 0) }} className="w-full h-3 border"></p>
                          ))}
                        </div>
                      )
                    })}
                  </div>
                </Card>
              ))
          )}
        </div>
      </div>
      <Modal showModal={showCreateModal} setShowModal={setShowCreateModal}>
        <h2>Create new collection</h2>
        <Input label='Name' error={!spreadsheetName ? 'Collection name cannot be empty' : null} value={spreadsheetName} onChange={(e) => setSpreadsheetName(e.target.value)} />
        <Button disabled={!spreadsheetName} text='Create' handleClick={handleCreateSpreadsheet} />
      </Modal>
      <Modal showModal={showDeleteModal} setShowModal={setShowDeleteModal}>
        <h2>Are you sure you want to delete {spreadsheetToDelete?.name}?</h2>
        <Button handleClick={handleDeleteSpreadsheet} text='Delete' variant='destructive' />
      </Modal>
    </>
  );
}

export default Expenses;