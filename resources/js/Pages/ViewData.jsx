import React, { useState, ChangeEvent, useEffect } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import axios from 'axios';

// Skeleton for the view data page.
export default function ViewData() {
const [resultList, setResultList] = useState([]);
const [error, setError] = useState(null);
    useEffect(() => {
       axios.get('/view-input-data/'+'6488bd0c3715468fae3837bdd6e89199').then(res => {
                setResultList(res.data);
            }).catch(err => {
            setError(err);
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
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <p id="result_area">
                    Files in the GCP dev bucket:
                    </p>
                    <ul>
                    {error}
                    {resultList.map((item, itemIndex) => {
                        return (
                            <li key={itemIndex}>
                            {item}
                            </li>
                        )
                        })}
                    </ul>
                    </div>
            </div>

        </AppLayout>
    );
}
