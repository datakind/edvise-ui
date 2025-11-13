import React from 'react';
import { Head } from '@inertiajs/react';
import ReactECharts from 'echarts-for-react';
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

const enrollmentTypeOption = {
    color: ['#F6A623', '#50B7F5'],
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow',
        },
    },
    legend: {
        top: 10,
        right: 20,
        icon: 'roundRect',
        itemWidth: 14,
        itemHeight: 14,
        textStyle: {
            color: '#1E343F',
            fontFamily: 'Helvetica Neue',
        },
        data: ['First Time Student', 'Transfer Student'],
    },
    grid: {
        left: '3%',
        right: '3%',
        bottom: '8%',
        containLabel: true,
    },
    xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['2017-18', '2018-19', '2019-20', '2020-21', '2021-22', '2022-23', '2023-24'],
        axisLine: {
            lineStyle: { color: '#D7DCE5' },
        },
        axisLabel: {
            color: '#637381',
            fontFamily: 'Helvetica Neue',
        },
    },
    yAxis: {
        type: 'value',
        min: 2,
        max: 4,
        interval: 0.5,
        axisLabel: {
            color: '#637381',
            fontFamily: 'Helvetica Neue',
        },
        splitLine: {
            lineStyle: {
                color: '#E5E7EB',
                type: 'dashed',
            },
        },
    },
    series: [
        {
            name: 'First Time Student',
            type: 'line',
            smooth: true,
            symbol: 'circle',
            symbolSize: 10,
            data: [2.6, 2.7, 2.6, 2.6, 2.5, 2.7, 2.8],
            lineStyle: {
                width: 3,
            },
        },
        {
            name: 'Transfer Student',
            type: 'line',
            smooth: true,
            symbol: 'rect',
            symbolSize: 10,
            data: [3.4, 3.6, 3.2, 3.4, 3.1, 3.5, 3.6],
            lineStyle: {
                width: 3,
            },
        },
    ],
};

export default function EdaDashboard() {
    return (
        <AppLayout title="EDA Dashboard">
            <Head title="EDA Dashboard" />
            <div className="font-[Helvetica Neue] mb-8 min-w-full">
                <PageHeading>Dashboard Home</PageHeading>
                <div className="min-w-full bg-[#FAFAFA] p-6">
                    <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                        <h2 className="text-2xl font-light text-[#1E343F]">At a Glance</h2>
                        <div className="flex flex-col gap-1 text-right text-sm font-light text-[#1E343F]/80 md:flex-row md:items-center md:gap-6">
                            <span>Showing analysis for: &lt;file name&gt;</span>
                            <span className="italic">Last updated August 2025</span>
                        </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-3 mb-5">
                        {summaryStats.map(stat => (
                            <StatCard key={stat.label} value={stat.value} label={stat.label} />
                        ))}
                    </div>
                    <section className="rounded-3xl bg-white p-8 shadow">
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
                            <div className="rounded-3xl bg-white p-4 shadow-inner">
                                <ReactECharts
                                    option={enrollmentTypeOption}
                                    style={{ height: '320px', width: '100%' }}
                                    opts={{ renderer: 'svg' }}
                                />
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </AppLayout>
    );
}
