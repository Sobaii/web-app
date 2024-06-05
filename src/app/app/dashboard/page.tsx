"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/input";
import Button from "@/components/button";
import { getUserSpreadsheetsShallowInfo } from "@/services/userAPI";
import { Card } from "@/components/card";
import { useRouter } from "next/navigation";
import { getBackgroundColor } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/dialog";
import { createSpreadsheet, deleteSpreadsheet } from "@/services/expenseAPI";
import Popover from "@/components/popover";
import Loader from "@/components/loader";
import Image from "next/image";

export default function Home() {
  const [search, setSearch] = useState("");
  const [spreadsheets, setSpreadsheets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [spreadsheetToDelete, setSpreadsheetToDelete] = useState(null);
  const [spreadsheetName, setSpreadsheetName] = useState("");

  const router = useRouter();

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
      router.push(`/expenses/spreadsheet?spreadsheet=${response._id}`);
    } catch (error) {
      console.error("Error creating spreadsheet", error);
    }
  };

  const handleDeleteSpreadsheet = async () => {
    try {
      await deleteSpreadsheet(spreadsheetToDelete.id);
      setSpreadsheets(
        spreadsheets.filter(
          (spreadsheet) => spreadsheet.id !== spreadsheetToDelete.id
        )
      );
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
            placeholder="Search spreadsheets"
            className="w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Dialog>
            <DialogTrigger asChild>
              <Button
                text="Create new spreadsheet"
                handleClick={() => setShowCreateModal(true)}
              />
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create new spreadsheet</DialogTitle>
                <DialogDescription>
                  Create a new spreadsheet to start tracking your expenses
                </DialogDescription>
              </DialogHeader>
              <h2>Create new spreadsheet</h2>
              <Input
                value={spreadsheetName}
                onChange={(e) => setSpreadsheetName(e.target.value)}
              />
              <Button
                disabled={!spreadsheetName}
                handleClick={() => handleCreateSpreadsheet()}
                text="Create"
              />
            </DialogContent>
          </Dialog>
        </div>
        <div className="grid grid-min-max gap-4">
          {loading ? (
            <Loader />
          ) : filteredSpreadsheets.length === 0 ? (
            <p>No spreadsheets found</p>
          ) : (
            filteredSpreadsheets.map((spreadsheet, index) => (
              <Card
                key={index}
                className="col-span-1 hover:shadow-xl hover:border-neutral-800 transition-shadow cursor-pointer gap-5 flex flex-col"
                onClick={() => router.push(`/app/dashboard/${spreadsheet.id}`)}
              >
                <div className="flex gap-6 justify-between">
                  <div className="flex gap-4 items-center">
                    <h3 className="whitespace-nowrap truncate">
                      {spreadsheet.name}
                    </h3>
                    <p>{spreadsheet.numberOfExpenses} items</p>
                  </div>
                  <div onClick={(e) => e.stopPropagation()}>
                    <Popover>
                      <Button
                        size="s"
                        variant="ghost"
                        imageSrc="/images/ellipsis.svg"
                      />
                      <Card className="p-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              handleClick={() => {
                                setShowDeleteModal(true);
                                setSpreadsheetToDelete(spreadsheet);
                              }}
                              variant="destructive"
                              text="Delete"
                            />
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle>Delete spreadsheet</DialogTitle>
                              <DialogDescription>
                                Are you sure you want to delete{" "}
                                {spreadsheetToDelete?.name}? This action cannot
                                be undone.
                              </DialogDescription>
                            </DialogHeader>
                            <Button
                              variant="destructive"
                              handleClick={() => handleDeleteSpreadsheet()}
                              text="Delete"
                            />
                          </DialogContent>
                        </Dialog>
                      </Card>
                    </Popover>
                  </div>
                </div>
                <div className="flex flex-col border">
                  {spreadsheet.confidenceOverview.map((expense, index) => {
                    return (
                      <div key={index} className="flex">
                        {Object.keys(expense).map((key, index) => (
                          <p
                            key={index}
                            style={{
                              backgroundColor: getBackgroundColor(
                                expense[key]?.confidence || 0
                              ),
                            }}
                            className="w-full h-3 border"
                          ></p>
                        ))}
                      </div>
                    );
                  })}
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </>
  );
}
