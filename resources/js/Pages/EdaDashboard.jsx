import React from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import PageHeading from '@/Components/PageHeading';

export default function EdaDashboard() {
    return (
        <AppLayout title="EDA Dashboard">
            <Head title="EDA Dashboard" />
            <div className="font-[Helvetica Neue] mb-8 min-w-full px-6">
                <PageHeading>Dashboard Home</PageHeading>
                <p>Hello World</p>
            </div>
        </AppLayout>
    );
}
