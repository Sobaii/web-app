import { Suspense, useState } from "react";
import {
  Input,
  Button,
  Card,
  Modal,
  Loader,
  Icon,
  Popover,
} from "../components/ui";
import { useNavigate } from "react-router-dom";
import { EllipsisIcon } from "../assets/icons";
import { convertToReadableDate } from "../util/dateUtils";
import { useSpreadsheets } from "../hooks/useSpreadsheets";

function DashboardDumm() {
  const [search, setSearch] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [spreadsheetToDelete, setSpreadsheetToDelete] = useState(null);
  const [spreadsheetName, setSpreadsheetName] = useState("");

  const navigate = useNavigate();

  const { createSpreadsheet, deleteSpreadsheet, spreadsheets } = useSpreadsheets();

  const handleCreateSpreadsheet = async () => {
    if (!spreadsheetName) return;
    try {
      const response = await createSpreadsheet(spreadsheetName);
      navigate(`/dashboard/spreadsheet?spreadsheet=${response.id}`);
    } catch (error) {
      console.error("Error creating spreadsheet", error);
    }
  };

  const handleDeleteSpreadsheet = async () => {
    try {
      await deleteSpreadsheet(spreadsheetToDelete.id);
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Error deleting spreadsheet", error);
    }
  };

  const filteredSpreadsheets = spreadsheets.filter((spreadsheet) =>
    spreadsheet.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex w-full gap-4">
          <Input
            placeholder="Search collections"
            fullWidth
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button
            text="Create new collection"
            handleClick={() => setShowCreateModal(true)}
          />
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4">
          {filteredSpreadsheets.length === 0 ? (
            <p>No spreadsheets found</p>
          ) : (
            filteredSpreadsheets.map((spreadsheet, index) => (
              <Card
                key={index}
                className="p-0 gap-0 border-2 overflow-hidden col-span-1 max-h-[600px] hover:border-blue-500 cursor-pointer flex"
                onClick={() =>
                  navigate(
                    `/dashboard/spreadsheet?spreadsheet=${spreadsheet.id}`
                  )
                }
              >
                <div className="p-5 gap-1 flex flex-col">
                  <div className="flex gap-3 justify-between items-center">
                    <h2 className="whitespace-nowrap truncate">
                      {spreadsheet.name}
                    </h2>
                    <Popover position="down-left">
                      <Icon image={EllipsisIcon} />
                      <Card className="w-fit p-2">
                        <Button
                          handleClick={() => {
                            setShowDeleteModal(true);
                            setSpreadsheetToDelete(spreadsheet);
                          }}
                          text="Delete"
                          variant="destructive"
                        />
                      </Card>
                    </Popover>
                  </div>
                  <p className="text-slate-500">
                    {spreadsheet.numberOfExpenses} items
                  </p>
                  <p className="text-slate-500">
                    Opened {convertToReadableDate(spreadsheet.lastOpened)}
                  </p>
                </div>

                <img src={spreadsheet.imageUrl} className="w-full" />
              </Card>
            ))
          )}
        </div>
      </div>
      <Modal showModal={showCreateModal} setShowModal={setShowCreateModal}>
        <h2>Create new collection</h2>
        <Input
          label="Name"
          error={!spreadsheetName ? "Collection name cannot be empty" : null}
          value={spreadsheetName}
          onChange={(e) => setSpreadsheetName(e.target.value)}
        />
        <Button
          disabled={!spreadsheetName}
          text="Create"
          handleClick={handleCreateSpreadsheet}
        />
      </Modal>
      <Modal showModal={showDeleteModal} setShowModal={setShowDeleteModal}>
        <h2>Are you sure you want to delete {spreadsheetToDelete?.name}?</h2>
        <Button
          handleClick={handleDeleteSpreadsheet}
          text="Delete"
          variant="destructive"
        />
      </Modal>
    </>
  );
}

const Dashboard = () => {
  return (
    <Suspense fallback={<Loader />}>
      <DashboardDumm />
    </Suspense>
  );
};

export default Dashboard;
