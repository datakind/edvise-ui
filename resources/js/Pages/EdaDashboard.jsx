import React from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import PageHeading from '@/Components/PageHeading';
import StatCard from '@/Components/StatCard';

const summaryStats = [
    {
        label: 'Total Students',
        value: '15,203',
    },
    {
        label: 'Transfer Students',
        value: '806',
    },
    {
        label: 'Avg. Year 1 GPA - All Students',
        value: '3.1',
    },
];

export default function EdaDashboard() {
    return (
        <AppLayout title="EDA Dashboard">
            <Head title="EDA Dashboard" />
            <div className="font-[Helvetica Neue] mb-8 min-w-full px-6">
                <PageHeading>Dashboard Home</PageHeading>

                <section className="rounded-3xl bg-white p-8 shadow">
                    <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                        <h2 className="text-2xl font-light text-[#1E343F]">At a Glance</h2>
                        <div className="flex flex-col gap-1 text-right text-sm font-light text-[#1E343F]/80 md:flex-row md:items-center md:gap-6">
                            <span>Showing analysis for: &lt;file name&gt;</span>
                            <span className="italic">Last updated August 2025</span>
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                        {summaryStats.map(stat => (
                            <StatCard key={stat.label} value={stat.value} label={stat.label} />
                        ))}
                    </div>

                    <div className="mt-8 grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)]">
                        <div className="rounded-3xl bg-[#F6F7FB] p-6">
                            <h3 className="text-lg font-medium text-[#1E343F]">
                                Average Year 1 GPA by Enrollment Types
                            </h3>
                            <p className="mt-4 text-sm font-light text-[#4F4F4F]">
                                This chart highlights differences in academic performance between
                                first-time and transfer students, helping you identify where each
                                cohort may need additional support or separate predictive models.
                            </p>
                        </div>
                        <div className="flex items-center justify-center rounded-3xl border border-dashed border-[#D7DCE5] p-6 text-sm font-light text-[#637381]">
                            Placeholder for GPA by Enrollment Types chart
                        </div>
                    </div>
                </section>
            </div>
        </AppLayout>
    );
}
