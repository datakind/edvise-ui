import React from 'react';
import { Head } from '@inertiajs/react';
import ReactECharts from 'echarts-for-react';
import AppLayout from '@/Layouts/AppLayout';
import PageHeading from '@/Components/PageHeading';
import StatCard from '@/Components/StatCard';
import Card from '@/Components/Card';

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
    color: ['#F79222', '#00CFEA'],
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'line',
        },
    },
    legend: {
        top: 10,
        right: 20,
        itemWidth: 16,
        itemHeight: 16,
        textStyle: {
            color: '#1E343F',
            fontFamily: 'Helvetica Neue',
        },
        data: [
            {
                name: 'First Time Student',
                icon: 'diamond',
                itemStyle: {
                    color: '#FDE9D3',
                    borderColor: '#F79222',
                    borderWidth: 1,
                },
            },
            {
                name: 'Transfer Student',
                icon: 'rect',
                itemStyle: {
                    color: '#CCF5FB',
                    borderColor: '#00CFEA',
                    borderWidth: 1,
                },
            },
        ],
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '15%',
        containLabel: true,
    },
    xAxis: {
        type: 'category',
        name: 'Cohort Year',
        nameLocation: 'middle',
        nameGap: 30,
        nameTextStyle: {
            color: '#637381',
            fontFamily: 'Helvetica Neue',
            fontSize: 14,
        },
        boundaryGap: false,
        data: ['2017-18', '2018-19', '2019-20', '2020-21', '2021-22', '2022-23', '2023-24'],
        axisLine: {
            lineStyle: { color: '#D7DCE5' },
        },
        axisLabel: {
            color: '#637381',
            fontFamily: 'Helvetica Neue',
        },
        splitLine: {
            show: true,
            lineStyle: {
                color: '#E5E7EB',
                type: 'dashed',
            },
        },
    },
    yAxis: {
        type: 'value',
        name: 'GPA',
        nameLocation: 'middle',
        nameGap: 50,
        nameTextStyle: {
            color: '#637381',
            fontFamily: 'Helvetica Neue',
            fontSize: 14,
        },
        min: 2,
        max: 4,
        interval: 0.5,
        axisLabel: {
            color: '#637381',
            fontFamily: 'Helvetica Neue',
        },
        axisLine: {
            lineStyle: { color: '#D7DCE5' },
        },
        splitLine: {
            show: true,
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
            symbol: 'diamond',
            symbolSize: 16,
            itemStyle: {
                color: '#FDE9D3',
                borderColor: '#F79222',
                borderWidth: 1,
            },
            data: [2.6, 2.7, 2.5, 2.7, 2.7, 2.7, 2.8],
            lineStyle: {
                width: 0,
            },
        },
        {
            name: 'Transfer Student',
            type: 'line',
            symbol: 'rect',
            symbolSize: 12,
            itemStyle: {
                color: '#CCF5FB',
                borderColor: '#00CFEA',
                borderWidth: 1,
            },
            data: [3.3, 3.6, 3.1, 3.4, 3.1, 3.5, 3.6],
            lineStyle: {
                width: 0,
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
                    <Card>
                        <div className="grid grid-cols-12 gap-6">
                            <div className="col-span-12 md:col-span-4">
                                <h3 className="text-lg font-medium text-[#1E343F]">
                                    Average Year 1 GPA by Enrollment Types
                                </h3>
                                <p className="mt-4 text-sm font-light text-[#4F4F4F]">
                                    This chart shows the average first-year GPA for first-time and transfer students separately. It highlights differences in academic performance by enrollment type, helping you:
                                </p>
                                <ul className="mt-4 list-disc space-y-2 pl-5 text-sm font-light text-[#4F4F4F]">
                                    <li>Spot where each group may face challenges</li>
                                    <li>Shape support strategies tailored to their needs</li>
                                    <li>Decide whether separate predictive models are needed for these student groups</li>
                                </ul>
                            </div>
                            <div className="col-span-12 md:col-span-8">
                                <ReactECharts
                                    option={enrollmentTypeOption}
                                    style={{ height: '320px', width: '100%' }}
                                    opts={{ renderer: 'svg' }}
                                />
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
