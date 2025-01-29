import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import BigDangerAlert from '@/Components/BigDangerAlert';
import BigSuccessAlert from '@/Components/BigSuccessAlert';
import DangerAlert from '@/Components/DangerAlert';
import SuccessAlert from '@/Components/SuccessAlert';
import ProgressBar from '@/Components/ProgressBar';

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
                                            <BigDangerAlert mainMsg="hello" msgList={["123", "234"]}></BigDangerAlert>
                        <BigSuccessAlert mainMsg="hello" msgDetails="hellohello"></BigSuccessAlert>
<SuccessAlert className="flex" errDict={[]} mainMsg="Submission can be uploaded!"></SuccessAlert>
<DangerAlert className="flex" errDict={{name:"key", val:"value"}} mainMsg="There were errors with your submission:"></DangerAlert>
<ProgressBar className="flex" progressMsg="Validation in progress..." amt="1/2"></ProgressBar>
                </div>
            </div>
        </AppLayout>
    );
}
