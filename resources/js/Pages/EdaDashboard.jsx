import React from 'react';
import { Head } from '@inertiajs/react';
import ReactECharts from 'echarts-for-react';
import AppLayout from '@/Layouts/AppLayout';
import PageHeading from '@/Components/PageHeading';
import H2 from '@/Components/H2';
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

// Base chart configuration shared across GPA charts
const createGpaChartOption = (legendData, seriesData) => ({
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
        data: legendData,
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
    series: seriesData.map(series => ({
        ...series,
        type: 'line',
        lineStyle: {
            width: 0,
        },
    })),
});

const enrollmentTypeOption = createGpaChartOption(
    [
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
    [
        {
            name: 'First Time Student',
            symbol: 'diamond',
            symbolSize: 16,
            itemStyle: {
                color: '#FDE9D3',
                borderColor: '#F79222',
                borderWidth: 1,
            },
            data: [2.6, 2.7, 2.5, 2.7, 2.7, 2.7, 2.8],
        },
        {
            name: 'Transfer Student',
            symbol: 'rect',
            symbolSize: 12,
            itemStyle: {
                color: '#CCF5FB',
                borderColor: '#00CFEA',
                borderWidth: 1,
            },
            data: [3.3, 3.6, 3.1, 3.4, 3.1, 3.5, 3.6],
        },
    ]
);

const enrollmentIntensityOption = createGpaChartOption(
    [
        {
            name: 'Full Time Student',
            icon: 'diamond',
            itemStyle: {
                color: '#FDE9D3',
                borderColor: '#F79222',
                borderWidth: 1,
            },
        },
        {
            name: 'Part Time Student',
            icon: 'rect',
            itemWidth: 12,
            itemHeight: 12,
            itemStyle: {
                color: '#CCF5FB',
                borderColor: '#00CFEA',
                borderWidth: 1,
            },
        },
    ],
    [
        {
            name: 'Full Time Student',
            symbol: 'diamond',
            symbolSize: 16,
            itemStyle: {
                color: '#FDE9D3',
                borderColor: '#F79222',
                borderWidth: 1,
            },
            data: [3.25, 3.15, 3.0, 3.4, 3.25, 3.4, 3.5],
        },
        {
            name: 'Part Time Student',
            symbol: 'rect',
            symbolSize: 12,
            itemStyle: {
                color: '#CCF5FB',
                borderColor: '#00CFEA',
                borderWidth: 1,
            },
            data: [2.55, 2.9, 2.75, 3.15, 3.0, 3.15, 3.25],
        },
    ]
);

// Term colors for stacked bar charts
const termColors = {
    fall: '#F79222',      // Orange
    winter: '#00CFEA',    // Light blue
    spring: '#25A95A',    // Teal/green
    summer: '#A92532',    // Red
};

// Base configuration for horizontal stacked bar charts
const createHorizontalStackedBarOption = (title, xAxisName, data, maxValue) => ({
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow',
        },
    },
    legend: {
        bottom: 10,
        data: ['Fall', 'Winter', 'Spring', 'Summer'],
        itemGap: 20,
        textStyle: {
            color: '#1E343F',
            fontFamily: 'Helvetica Neue',
        },
    },
    grid: {
        left: '15%',
        right: '4%',
        bottom: '20%',
        top: '5%',
        containLabel: false,
    },
    xAxis: {
        type: 'value',
        name: xAxisName,
        nameLocation: 'middle',
        nameGap: 30,
        nameTextStyle: {
            color: '#637381',
            fontFamily: 'Helvetica Neue',
            fontSize: 14,
        },
        max: maxValue,
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
    yAxis: {
        type: 'category',
        data: ['2017 - 18', '2018 - 19', '2019 - 20', '2020 - 21', '2021 - 22', '2022 - 23', '2023 - 24'],
        axisLabel: {
            color: '#637381',
            fontFamily: 'Helvetica Neue',
        },
        axisLine: {
            lineStyle: { color: '#D7DCE5' },
        },
    },
    series: [
        {
            name: 'Fall',
            type: 'bar',
            stack: 'terms',
            data: data.fall,
            itemStyle: {
                color: termColors.fall,
            },
        },
        {
            name: 'Winter',
            type: 'bar',
            stack: 'terms',
            data: data.winter,
            itemStyle: {
                color: termColors.winter,
            },
        },
        {
            name: 'Spring',
            type: 'bar',
            stack: 'terms',
            data: data.spring,
            itemStyle: {
                color: termColors.spring,
            },
        },
        {
            name: 'Summer',
            type: 'bar',
            stack: 'terms',
            data: data.summer,
            itemStyle: {
                color: termColors.summer,
            },
        },
    ],
});

// Hardcoded data for "Students by Cohort Year and Term"
const studentsByCohortData = {
    fall: [180, 200, 220, 250, 270, 290, 320],
    winter: [60, 65, 70, 75, 80, 85, 90],
    spring: [50, 55, 60, 65, 70, 75, 80],
    summer: [10, 12, 15, 18, 20, 22, 25],
};

// Hardcoded data for "Course Enrollments Over Time"
const courseEnrollmentsData = {
    fall: [3000, 3200, 3400, 3600, 3800, 4000, 4200],
    winter: [2000, 2100, 2200, 2300, 2400, 2500, 2600],
    spring: [1000, 1100, 1200, 1300, 1400, 1500, 1600],
    summer: [500, 550, 600, 650, 700, 750, 800],
};

const studentsByCohortOption = createHorizontalStackedBarOption(
    'Students by Cohort Year and Term',
    'Number of Students',
    studentsByCohortData,
    500
);

const courseEnrollmentsOption = createHorizontalStackedBarOption(
    'Course Enrollments Over Time',
    'Total Number of Course Enrollments',
    courseEnrollmentsData,
    10000
);

export default function EdaDashboard() {
    return (
        <AppLayout title="EDA Dashboard">
            <Head title="EDA Dashboard" />
            <div className="font-[Helvetica Neue] mb-8 min-w-full">
                <PageHeading>Dashboard Home</PageHeading>
                <div className="min-w-full bg-[#FAFAFA] p-6">
                    <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                        <H2>At a Glance</H2>
                        <div className="flex flex-col gap-1 text-right text-sm font-light text-heading/80 md:flex-row md:items-center md:gap-6">
                            <span>Showing analysis for: &lt;file name&gt;</span>
                            <span className="italic">Last updated August 2025</span>
                        </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-3 mb-5">
                        {summaryStats.map(stat => (
                            <StatCard key={stat.label} value={stat.value} label={stat.label} />
                        ))}
                    </div>
                    <Card className="mb-6">
                        <div className="grid grid-cols-12 gap-6">
                            <div className="col-span-12 md:col-span-4">
                                <h3 className="text-lg font-medium text-heading">
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
                    <Card className="mb-6">
                        <div className="grid grid-cols-12 gap-6">
                            <div className="col-span-12 md:col-span-4">
                                <h3 className="text-lg font-medium text-heading">
                                    Average Year 1 GPA by Enrollment Intensity
                                </h3>
                                <p className="mt-4 text-sm font-light text-[#4F4F4F]">
                                    This chart shows the average first-year GPA for full-time and part-time students. It highlights differences in academic performance by enrollment intensity, helping you:
                                </p>
                                <ul className="mt-4 list-disc space-y-2 pl-5 text-sm font-light text-[#4F4F4F]">
                                    <li>Identify support needs for each group</li>
                                    <li>Track performance trends over time</li>
                                    <li>Evaluate potential retention risks</li>
                                </ul>
                            </div>
                            <div className="col-span-12 md:col-span-8">
                                <ReactECharts
                                    option={enrollmentIntensityOption}
                                    style={{ height: '320px', width: '100%' }}
                                    opts={{ renderer: 'svg' }}
                                />
                            </div>
                        </div>
                    </Card>
                    <H2 className="mb-6">Key Insights</H2>
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        <Card>
                            <div className="mb-4">
                                <h3 className="text-lg font-medium text-heading">
                                    Students by Cohort Year and Term
                                </h3>
                                <p className="mt-2 text-sm font-light text-[#4F4F4F]">
                                    A year by year analysis of when students started their journey at the institution
                                </p>
                            </div>
                            <ReactECharts
                                option={studentsByCohortOption}
                                style={{ height: '400px', width: '100%' }}
                                opts={{ renderer: 'svg' }}
                            />
                        </Card>
                        <Card>
                            <div className="mb-4">
                                <h3 className="text-lg font-medium text-heading">
                                    Course Enrollments Over Time
                                </h3>
                                <p className="mt-2 text-sm font-light text-[#4F4F4F]">
                                    Displays total student course enrollments per academic year and semester, showing trends in overall enrollment activity.
                                </p>
                            </div>
                            <ReactECharts
                                option={courseEnrollmentsOption}
                                style={{ height: '400px', width: '100%' }}
                                opts={{ renderer: 'svg' }}
                            />
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
