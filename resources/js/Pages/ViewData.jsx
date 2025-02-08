import React, { useState, useEffect } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import axios from 'axios';
import FileView from '@/Components/FileView';
import HeaderLabel from '@/Components/HeaderLabel';
import {
  Cog8ToothIcon,
} from '@heroicons/react/24/outline';

// Skeleton for the view data page.
export default function ViewData() {
  const [resultList, setResultList] = useState([]);
  const [error, setError] = useState(null);
  useEffect(() => {
    axios
      .get('/view-input-data')
      .then(res => {
        setResultList(res.data);
      })
      .catch(err => {
        setError(JSON.stringify(err));
      });
  }, []);

  return (
    <AppLayout
      title="View Data"
      renderHeader={() => (
        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
          FileUpload
        </h2>
      )}
    >     
    <div className="flex flex-col gap-y-12">
    <HeaderLabel
          className="pl-12"
          iconObj={
            <Cog8ToothIcon aria-hidden="true" className="size-6 shrink-0" />
          }
          majorTitle="Admin Actions"
          minorTitle="(temp) Debugging View of data"
        ></HeaderLabel>
         <FileView></FileView>
      <div className="py-12 flex">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <p id="result_area">Files in the GCP dev bucket:</p>
          <ul>
            {error}
            {resultList.map((item, itemIndex) => {
              return <li key={itemIndex}>{item}</li>;
            })}
          </ul>
        </div>
      </div>
      </div>
    </AppLayout>
  );
}
