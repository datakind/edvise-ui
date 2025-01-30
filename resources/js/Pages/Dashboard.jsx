import AppLayout from '@/Layouts/AppLayout';
import BigDangerAlert from '@/Components/BigDangerAlert';
import BigSuccessAlert from '@/Components/BigSuccessAlert';
import DangerAlert from '@/Components/DangerAlert';
import SuccessAlert from '@/Components/SuccessAlert';
import ProgressBar from '@/Components/ProgressBar';
import HeaderLabel from '@/Components/HeaderLabel';

import React, { useState, ChangeEvent, useRef, useEffect } from 'react';
import {
  PlusCircleIcon,
} from '@heroicons/react/24/outline';

export default function Dashboard() {


    return (
        <AppLayout
            title="Dashboard"
            renderHeader={() => (
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Dashboard
                </h2>
            )}
        >
            <div className="py-12 w-full">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    DEBUGGING USE: view components:
                                            <BigDangerAlert mainMsg="hello"></BigDangerAlert>
                        <BigSuccessAlert mainMsg="hello" msgDetails="hellohello"></BigSuccessAlert>
                </div>
            </div>
        </AppLayout>
    );
}
