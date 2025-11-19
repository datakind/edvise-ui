import React from 'react';
import { Head } from '@inertiajs/react';
import ReactECharts from 'echarts-for-react';
import AppLayout from '@/Layouts/AppLayout';
import PageHeading from '@/Components/PageHeading';
import H2 from '@/Components/H2';
import H3 from '@/Components/H3';
import ChartTitle from '@/Components/ChartTitle';
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

// Donut chart configuration
const createDonutChartOption = (data) => ({
    tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} ({d}%)',
    },
    legend: {
        bottom: 10,
        itemGap: 20,
        textStyle: {
            color: '#1E343F',
            fontFamily: 'Helvetica Neue',
        },
    },
    series: [
        {
            name: 'Degree Types',
            type: 'pie',
            radius: ['40%', '70%'], // Creates donut effect
            center: ['50%', '45%'],
            avoidLabelOverlap: false,
            itemStyle: {
                borderRadius: 5,
                borderColor: '#fff',
                borderWidth: 2,
            },
            label: {
                show: true,
                formatter: '{d}%',
                fontSize: 14,
                fontFamily: 'Helvetica Neue',
                color: '#1E343F',
            },
            emphasis: {
                label: {
                    show: true,
                    fontSize: 16,
                    fontWeight: 'bold',
                },
            },
            labelLine: {
                show: true,
            },
            data: data,
        },
    ],
});

// Flexible horizontal stacked bar chart for enrollment types
const createEnrollmentTypeStackedBarOption = (xAxisName, categories, data, maxValue, legendData) => ({
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow',
        },
    },
    legend: {
        bottom: 10,
        data: legendData,
        itemGap: 20,
        textStyle: {
            color: '#1E343F',
            fontFamily: 'Helvetica Neue',
        },
    },
    grid: {
        left: '20%',
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
        data: categories,
        axisLabel: {
            color: '#637381',
            fontFamily: 'Helvetica Neue',
        },
        axisLine: {
            lineStyle: { color: '#D7DCE5' },
        },
    },
    series: data,
});

// Hardcoded data for "Most Common Degree Types" donut chart
const degreeTypesData = [
    { value: 67, name: "Associate's Degree", itemStyle: { color: '#F79222' } },
    { value: 15, name: '1 - 2 year certificate', itemStyle: { color: '#00CFEA' } },
    { value: 8, name: '2 - 4 year certificate', itemStyle: { color: '#25A95A' } },
    { value: 7, name: 'Degree seeking', itemStyle: { color: '#A92532' } },
    { value: 3, name: 'Unknown', itemStyle: { color: '#385981' } },
];

// Hardcoded data for "Student Enrollment Type by Intensity"
const enrollmentTypeByIntensityData = [
    {
        name: 'Full Time',
        type: 'bar',
        stack: 'intensity',
        data: [9800, 600, 8500],
        itemStyle: {
            color: '#F79222',
        },
    },
    {
        name: 'Part Time',
        type: 'bar',
        stack: 'intensity',
        data: [200, 1100, 1200],
        itemStyle: {
            color: '#00CFEA',
        },
    },
];

const degreeTypesOption = createDonutChartOption(degreeTypesData);

const enrollmentTypeByIntensityOption = createEnrollmentTypeStackedBarOption(
    'Number of Students',
    ['First-Time', 'Re-Admit', 'Transfer-In'],
    enrollmentTypeByIntensityData,
    10000,
    ['Full Time', 'Part Time']
);

// Vertical stacked bar chart configuration
const createVerticalStackedBarOption = (yAxisName, xAxisName, categories, data, maxValue, legendData, legendTitle = null) => ({
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow',
        },
    },
    legend: {
        bottom: 10,
        data: legendData,
        itemGap: 20,
        textStyle: {
            color: '#1E343F',
            fontFamily: 'Helvetica Neue',
        },
        ...(legendTitle && {
            formatter: (name) => {
                const index = legendData.indexOf(name);
                return index === 0 ? `${legendTitle} ${name}` : name;
            },
        }),
    },
    grid: {
        left: '15%',
        right: '4%',
        bottom: '25%',
        top: '5%',
        containLabel: false,
    },
    xAxis: {
        type: 'category',
        name: xAxisName,
        nameLocation: 'middle',
        nameGap: 30,
        nameTextStyle: {
            color: '#637381',
            fontFamily: 'Helvetica Neue',
            fontSize: 14,
        },
        data: categories,
        axisLabel: {
            color: '#637381',
            fontFamily: 'Helvetica Neue',
        },
        axisLine: {
            lineStyle: { color: '#D7DCE5' },
        },
    },
    yAxis: {
        type: 'value',
        name: yAxisName,
        nameLocation: 'middle',
        nameGap: 50,
        nameTextStyle: {
            color: '#637381',
            fontFamily: 'Helvetica Neue',
            fontSize: 14,
        },
        max: maxValue,
        interval: maxValue / 5,
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
    series: data,
});

// Hardcoded data for "Pell Recipient by First Generation Status"
const pellRecipientData = [
    {
        name: 'Yes',
        type: 'bar',
        stack: 'firstGen',
        data: [3000, 3700],
        itemStyle: {
            color: '#F79222',
        },
    },
    {
        name: 'No',
        type: 'bar',
        stack: 'firstGen',
        data: [4200, 3000],
        itemStyle: {
            color: '#00CFEA',
        },
    },
    {
        name: 'Nan',
        type: 'bar',
        stack: 'firstGen',
        data: [1800, 1800],
        itemStyle: {
            color: '#25A95A',
        },
    },
];

// Hardcoded data for "Student Age by Gender"
const studentAgeByGenderData = [
    {
        name: '20 or younger',
        type: 'bar',
        stack: 'age',
        data: [5000, 5000, 800, 2000, 1500],
        itemStyle: {
            color: '#F79222',
        },
    },
    {
        name: '20 - 24',
        type: 'bar',
        stack: 'age',
        data: [2500, 2500, 100, 1000, 1000],
        itemStyle: {
            color: '#00CFEA',
        },
    },
    {
        name: 'Older than 24',
        type: 'bar',
        stack: 'age',
        data: [2000, 1300, 100, 500, 1000],
        itemStyle: {
            color: '#25A95A',
        },
    },
];

const pellRecipientOption = createVerticalStackedBarOption(
    'Number of Students',
    'Pell Grant Status',
    ['Yes', 'No'],
    pellRecipientData,
    10000,
    ['Yes', 'No', 'Nan']
);

const studentAgeByGenderOption = createEnrollmentTypeStackedBarOption(
    'Number of Students',
    ['Female', 'Male', 'Nonbinary, intersex, and gender-nonconforming', 'Prefer not to specify', 'Unknown'],
    studentAgeByGenderData,
    10000,
    ['20 or younger', '20 - 24', 'Older than 24']
);

// Hardcoded data for "Race by Pell Status"
const raceByPellStatusData = [
    {
        name: 'Yes',
        type: 'bar',
        stack: 'pell',
        data: [30, 250, 400, 20, 50, 100, 150, 2000],
        itemStyle: {
            color: '#F79222',
        },
    },
    {
        name: 'No',
        type: 'bar',
        stack: 'pell',
        data: [20, 50, 200, 10, 25, 50, 50, 250],
        itemStyle: {
            color: '#00CFEA',
        },
    },
];

const raceByPellStatusOption = createVerticalStackedBarOption(
    'Number of Students',
    '',
    ['American Indian or Alaska Native', 'Asian', 'Black or African American', 'Native Hawaiian or other Pacific Islander', 'Nonresident Alien', 'Two or More Races', 'Unknown', 'White'],
    raceByPellStatusData,
    2500,
    ['Yes', 'No'],
    'Pell Status First Year:'
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
                                <ChartTitle variant="large">Average Year 1 GPA by Enrollment Types</ChartTitle>
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
                                <ChartTitle variant="large">Average Year 1 GPA by Enrollment Intensity</ChartTitle>
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
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mb-6">
                        <Card>
                            <div className="mb-4">
                                <ChartTitle variant="small">Students by Cohort Year and Term</ChartTitle>
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
                                <ChartTitle variant="small">Course Enrollments Over Time</ChartTitle>
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
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mb-6">
                        <Card>
                            <div className="mb-4">
                                <ChartTitle variant="small">Most Common Degree Types</ChartTitle>
                                <p className="mt-2 text-sm font-light text-[#4F4F4F]">
                                    The following is a breakdown of degree types being sought by the student body.
                                </p>
                            </div>
                            <ReactECharts
                                option={degreeTypesOption}
                                style={{ height: '400px', width: '100%' }}
                                opts={{ renderer: 'svg' }}
                            />
                        </Card>
                        <Card>
                            <div className="mb-4">
                                <ChartTitle variant="small">Student Enrollment Type by Intensity</ChartTitle>
                                <p className="mt-2 text-sm font-light text-[#4F4F4F]">
                                    This chart signifies students who are first time, re-admitted, or transferred into school, broken down by whether they are enrolled at full time or part time intensity.
                                </p>
                            </div>
                            <ReactECharts
                                option={enrollmentTypeByIntensityOption}
                                style={{ height: '400px', width: '100%' }}
                                opts={{ renderer: 'svg' }}
                            />
                        </Card>
                    </div>
                    <H2 className="mb-6">Student Characteristics & Demographics</H2>
                    <div className="mb-6 text-sm font-light text-[#4F4F4F]">
                        DataKind does not use any demographic categories to train our model; we only use them to assess bias in the model predictions. We display the full demographics of the raw dataset here to make sure they match your understanding of your student body. If this data looks inaccurate, please confirm you uploaded the correct files. If you have further questions, please contact your account representative.
                    </div>
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mb-6">
                        <Card>
                            <div className="mb-4">
                                <ChartTitle variant="small">Pell Recipient by First Generation Status</ChartTitle>
                                <p className="mt-2 text-sm font-light text-[#4F4F4F]">
                                    Here are students who are receiving a Pell Grant and whether they are first generation students.
                                </p>
                            </div>
                            <ReactECharts
                                option={pellRecipientOption}
                                style={{ height: '400px', width: '100%' }}
                                opts={{ renderer: 'svg' }}
                            />
                        </Card>
                        <Card>
                            <div className="mb-4">
                                <ChartTitle variant="small">Student Age by Gender</ChartTitle>
                                <p className="mt-2 text-sm font-light text-[#4F4F4F]">
                                    An overview of female-identifying vs male-identifying students. This chart is broken down by gender and then by age categories.
                                </p>
                            </div>
                            <ReactECharts
                                option={studentAgeByGenderOption}
                                style={{ height: '400px', width: '100%' }}
                                opts={{ renderer: 'svg' }}
                            />
                        </Card>
                    </div>
                    <Card className="mb-6">
                        <div className="mb-4">
                            <ChartTitle variant="large">Race by Pell Status</ChartTitle>
                            <p className="mt-2 text-sm font-light text-[#4F4F4F]">
                                This chart shows what race students identify as and who are receiving a Pell Grant.
                            </p>
                        </div>
                        <ReactECharts
                            option={raceByPellStatusOption}
                            style={{ height: '400px', width: '100%' }}
                            opts={{ renderer: 'svg' }}
                        />
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
