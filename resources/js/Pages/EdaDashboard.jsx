import React, { useState, useEffect } from 'react';
import { Head, usePage } from '@inertiajs/react';
import ReactECharts from 'echarts-for-react';
import axios from 'axios';
import AppLayout from '@/Layouts/AppLayout';
import PageHeading from '@/Components/PageHeading';
import H2 from '@/Components/H2';
import ChartTitle from '@/Components/ChartTitle';
import StatCard from '@/Components/StatCard';
import Card from '@/Components/Card';
import Spinner from '@/Components/Spinner';
import { getBatchInfo } from '@/utils/batchUtils';

// Wrapper component with default props for ECharts
const EChart = ({ option, style, ...props }) => (
    <ReactECharts
        option={option}
        opts={{ renderer: 'svg' }}
        {...props}
    />
);

// Centralized color palette for all charts
// Based on existing design system colors
const CHART_COLOR_PALETTE = [
    '#F79222', // Orange
    '#00CFEA', // Light blue
    '#25A95A', // Teal/green
    '#A92532', // Red
    '#385981', // Dark blue
    '#8B5CF6', // Purple
    '#EC4899', // Pink
    '#10B981', // Green
    '#F59E0B', // Amber
    '#3B82F6', // Blue
];

// Term-specific colors (for seasonal charts)
const termColors = {
    fall: CHART_COLOR_PALETTE[0],      // Orange
    winter: CHART_COLOR_PALETTE[1],    // Light blue
    spring: CHART_COLOR_PALETTE[2],    // Teal/green
    summer: CHART_COLOR_PALETTE[3],    // Red
};

// Base chart configuration shared across GPA charts
const createGpaChartOption = (legendData, seriesData, cohortYears) => ({
    color: CHART_COLOR_PALETTE.slice(0, 2), // Use first 2 colors for GPA charts
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
        data: cohortYears || [],
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

// Helper function to create enrollment type option from API data
const createEnrollmentTypeOptionFromData = (gpaData) => {
    if (!gpaData || !gpaData.series) {
        return null;
    }

    const legendData = gpaData.series.map(series => ({
        name: series.name,
        icon: series.name === 'First Time Student' ? 'diamond' : 'rect',
        itemStyle: {
            color: series.name === 'First Time Student' ? '#FDE9D3' : '#CCF5FB',
            borderColor: series.name === 'First Time Student' ? '#F79222' : '#00CFEA',
            borderWidth: 1,
        },
    }));

    const seriesData = gpaData.series.map(series => ({
        name: series.name,
        symbol: series.name === 'First Time Student' ? 'diamond' : 'rect',
        symbolSize: series.name === 'First Time Student' ? 16 : 12,
        itemStyle: {
            color: series.name === 'First Time Student' ? '#FDE9D3' : '#CCF5FB',
            borderColor: series.name === 'First Time Student' ? '#F79222' : '#00CFEA',
            borderWidth: 1,
        },
        data: series.data,
    }));

    return createGpaChartOption(legendData, seriesData, gpaData.cohort_years);
};

// Helper function to create enrollment intensity option from API data
const createEnrollmentIntensityOptionFromData = (gpaData) => {
    if (!gpaData || !gpaData.series) {
        return null;
    }

    const legendData = gpaData.series.map(series => ({
        name: series.name,
        icon: series.name === 'Full Time Student' ? 'diamond' : 'rect',
        itemWidth: series.name === 'Part Time Student' ? 12 : undefined,
        itemHeight: series.name === 'Part Time Student' ? 12 : undefined,
        itemStyle: {
            color: series.name === 'Full Time Student' ? '#FDE9D3' : '#CCF5FB',
            borderColor: series.name === 'Full Time Student' ? '#F79222' : '#00CFEA',
            borderWidth: 1,
        },
    }));

    const seriesData = gpaData.series.map(series => ({
        name: series.name,
        symbol: series.name === 'Full Time Student' ? 'diamond' : 'rect',
        symbolSize: series.name === 'Full Time Student' ? 16 : 12,
        itemStyle: {
            color: series.name === 'Full Time Student' ? '#FDE9D3' : '#CCF5FB',
            borderColor: series.name === 'Full Time Student' ? '#F79222' : '#00CFEA',
            borderWidth: 1,
        },
        data: series.data,
    }));

    return createGpaChartOption(legendData, seriesData, gpaData.cohort_years);
};


// Base configuration for horizontal stacked bar charts
const createHorizontalStackedBarOption = (title, xAxisName, data, maxValue, cohortYears = null) => ({
    color: [termColors.fall, termColors.winter, termColors.spring, termColors.summer], // Term-specific colors
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
        data: cohortYears ? cohortYears.map(year => year.replace('-', ' - ')) : [],
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
        },
        {
            name: 'Winter',
            type: 'bar',
            stack: 'terms',
            data: data.winter,
        },
        {
            name: 'Spring',
            type: 'bar',
            stack: 'terms',
            data: data.spring,
        },
        {
            name: 'Summer',
            type: 'bar',
            stack: 'terms',
            data: data.summer,
        },
    ],
});

// Helper function to create term-based chart options from API data
const createTermChartOption = (title, xAxisName, termData, maxValue, cohortYears = null) => {
    if (!termData) {
        return null;
    }
    return createHorizontalStackedBarOption(title, xAxisName, termData, maxValue, cohortYears);
};

// Degree types donut chart configuration
const degreeTypesChartOptions = (data, totalStudents) => {
    const total = parseInt(totalStudents?.replace(/,/g, '') || '0', 10);
    return {
        color: CHART_COLOR_PALETTE, // Use full palette for donut charts
        tooltip: {
            trigger: 'item',
            formatter: (params) => {
                const count = params.value;
                const percentage = Math.round(params.data.percentage);
                return `${params.name}: ${count.toLocaleString()} out of ${total.toLocaleString()} total students (${percentage}%)`;
            },
        },
        legend: {
            show: true,
            bottom: -8,
        },
    series: [
        {
            name: 'Degree Types',
            type: 'pie',
            radius: ['40%', '70%'], // Creates donut effect
            center: ['50%', '45%'],
            itemStyle: {
                borderRadius: 5,
                borderColor: '#fff',
                borderWidth: 2,
            },
            label: {
                show: true,
                fontSize: 14,
                fontWeight: 'bold',
                formatter: (params) => {
                    return `${Math.round(params.data.percentage)}%`;
                },
            },
            emphasis: {
                label: {
                    show: true,
                    fontSize: 16,
                    fontWeight: 'bold',
                },
            },
            data: data
                .filter(dt => dt.percentage > 0)
                .map(dt => ({
                    value: dt.count,
                    name: dt.name,
                    percentage: dt.percentage,
                })),
        },
    ],
    };
};

// Flexible horizontal stacked bar chart for enrollment types
const createEnrollmentTypeStackedBarOption = (xAxisName, categories, data, maxValue, legendData) => ({
    color: CHART_COLOR_PALETTE, // Use full palette
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

// Helper function to create enrollment type by intensity option from API data
const createEnrollmentTypeByIntensityOptionFromData = (data) => {
    if (!data || !data.categories || !data.series) {
        return null;
    }
    // Remove color from series data - let ECharts use the palette
    const seriesData = data.series.map(s => {
        const { color, ...rest } = s;
        return rest;
    });
    return createEnrollmentTypeStackedBarOption(
        'Number of Students',
        data.categories,
        seriesData,
        10000,
        data.series.map(s => s.name)
    );
};

// Vertical stacked bar chart configuration
const createVerticalStackedBarOption = ({ yAxisName, xAxisName, categories, data, maxValue, legendData }) => ({
    color: CHART_COLOR_PALETTE, // Use full palette
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

// Helper function to create pell recipient option from API data
const createPellRecipientOptionFromData = (data) => {
    if (!data || !data.categories || !data.series) {
        return null;
    }
    // Remove color from series data - let ECharts use the palette
    const seriesData = data.series.map(s => {
        const { color, ...rest } = s;
        return rest;
    });
    return createVerticalStackedBarOption({
        yAxisName: 'Number of Students',
        xAxisName: 'Pell Grant Status',
        categories: data.categories,
        data: seriesData,
        maxValue: 10000,
        legendData: data.series.map(s => s.name),
    });
};

// Helper function to create student age by gender option from API data
const createStudentAgeByGenderOptionFromData = (data) => {
    if (!data || !data.categories || !data.series) {
        return null;
    }
    // Remove color from series data - let ECharts use the palette
    const seriesData = data.series.map(s => {
        const { color, ...rest } = s;
        return rest;
    });
    return createEnrollmentTypeStackedBarOption(
        'Number of Students',
        data.categories,
        seriesData,
        10000,
        data.series.map(s => s.name)
    );
};

// Helper function to create race by pell status option from API data
const createRaceByPellStatusOptionFromData = (data) => {
    if (!data || !data.categories || !data.series) {
        return null;
    }
    // Remove color from series data - let ECharts use the palette
    const seriesData = data.series.map(s => {
        const { color, ...rest } = s;
        return rest;
    });
    const baseOption = createVerticalStackedBarOption({
        yAxisName: 'Number of Students',
        xAxisName: '',
        categories: data.categories,
        data: seriesData,
        maxValue: 2500,
        legendData: data.series.map(s => s.name),
    });
    const wrapText = (text, maxLength = 20) => {
        const words = text.split(' ');
        const lines = [];
        let currentLine = '';
        
        words.forEach(word => {
            if ((currentLine + word).length <= maxLength) {
                currentLine += (currentLine ? ' ' : '') + word;
            } else {
                if (currentLine) lines.push(currentLine);
                currentLine = word;
            }
        });
        if (currentLine) lines.push(currentLine);
        
        return lines.length > 1 ? lines.join('\n') : text;
    };
    
    return {
        ...baseOption,
        grid: {
            ...baseOption.grid,
            left: '25%', // Increased from 15% to accommodate longer race category names
        },
        xAxis: {
            ...baseOption.xAxis,
            axisLabel: {
                ...baseOption.xAxis.axisLabel,
                rotate: 25, // Rotate labels 45 degrees to prevent overlap
                interval: 0, // Show all labels
                formatter: (value) => {
                    // Truncate very long labels and add ellipsis if needed
                    return value.length > 20 ? value.substring(0, 17) + '...' : value;
                },
            },
        },
        legend: {
            ...baseOption.legend,
            formatter: (name) => {
                // Show consistent format for both legend items
                return `Pell Status First Year: ${name}`;
            },
        },
    };
};

export default function EdaDashboard({ batch_id: propBatchId }) {
    // Get inst_id from Inertia shared props
    const { inst_id } = usePage().props;

    const [batchInfo, setBatchInfo] = useState(null);
    const [batchLoading, setBatchLoading] = useState(true);
    const [edaData, setEdaData] = useState(null);
    const [loading, setLoading] = useState(false); // Start false, will be set when batch_id is resolved
    const [error, setError] = useState(null);

    // Fetch batch info - either from propBatchId or get most recent
    useEffect(() => {
        const fetchBatchInfo = async () => {
            if (!inst_id) {
                setError('Missing institution ID');
                setBatchLoading(false);
                return;
            }

            try {
                setBatchLoading(true);
                setError(null);
                
                // getBatchInfo returns the most recent batch if no batch_id is provided
                const batch = await getBatchInfo(propBatchId);
                
                if (!batch) {
                    if (propBatchId) {
                        throw new Error(`Batch ${propBatchId} not found or not completed.`);
                    } else {
                        throw new Error('No completed batches found. Please create and complete a batch first.');
                    }
                }

                setBatchInfo(batch);
            } catch (err) {
                console.error('Error fetching batch info:', err);
                
                let errorMessage = 'Failed to fetch batch';
                if (err.response) {
                    errorMessage = err.response.data?.error 
                        || err.response.data?.detail 
                        || err.response.data?.message
                        || `HTTP ${err.response.status}: ${err.response.statusText}`;
                } else if (err.request) {
                    errorMessage = 'No response from server. Please check your connection.';
                } else {
                    errorMessage = err.message || 'Failed to fetch batch';
                }
                setError(errorMessage);
            } finally {
                setBatchLoading(false);
            }
        };

        fetchBatchInfo();
    }, [inst_id, propBatchId]);

    // Fetch EDA data from API once batch info is resolved
    useEffect(() => {
        const fetchEdaData = async () => {
            if (!inst_id) {
                setError('Missing institution ID');
                setLoading(false);
                return;
            }

            if (!batchInfo || !batchInfo.batch_id) {
                // Wait for batch info to be resolved
                return;
            }

            try {
                setLoading(true);
                setError(null);
                const response = await axios.get(`/institutions/${inst_id}/batch/${batchInfo.batch_id}/eda`);
                
                if (!response.data) {
                    throw new Error('No data received from API');
                }
                
                setEdaData(response.data);
            } catch (err) {
                console.error('Error fetching EDA data:', err);
                console.error('Error response:', err.response);
                console.error('Error status:', err.response?.status);
                console.error('Error details:', err.response?.data);
                console.error('Error config:', err.config);
                
                let errorMessage = 'Failed to load EDA data';
                if (err.response) {
                    // Try to extract error message from various possible formats
                    errorMessage = err.response.data?.error 
                        || err.response.data?.detail 
                        || err.response.data?.message
                        || `HTTP ${err.response.status}: ${err.response.statusText}`;
                } else if (err.request) {
                    errorMessage = 'No response from server. Please check your connection.';
                } else {
                    errorMessage = err.message || 'Failed to load EDA data';
                }
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        fetchEdaData();
    }, [inst_id, batchInfo]);

    // Create chart options from API data
    const enrollmentTypeOption = edaData?.gpa_by_enrollment_type
        ? createEnrollmentTypeOptionFromData(edaData.gpa_by_enrollment_type)
        : null;

    const enrollmentIntensityOption = edaData?.gpa_by_enrollment_intensity
        ? createEnrollmentIntensityOptionFromData(edaData.gpa_by_enrollment_intensity)
        : null;

    // Get cohort years from GPA data (they should be the same across all charts)
    const cohortYears = edaData?.gpa_by_enrollment_type?.cohort_years || null;

    const studentsByCohortOption = edaData?.students_by_cohort_term
        ? createTermChartOption(
            'Students by Cohort Year and Term',
            'Number of Students',
            edaData.students_by_cohort_term,
            Math.max(...[
                ...edaData.students_by_cohort_term.fall,
                ...edaData.students_by_cohort_term.winter,
                ...edaData.students_by_cohort_term.spring,
                ...edaData.students_by_cohort_term.summer
            ]) * 1.2,
            cohortYears
        )
        : null;

    const courseEnrollmentsOption = edaData?.course_enrollments
        ? createTermChartOption(
            'Course Enrollments Over Time',
            'Total Number of Course Enrollments',
            edaData.course_enrollments,
            Math.max(...[
                ...edaData.course_enrollments.fall,
                ...edaData.course_enrollments.winter,
                ...edaData.course_enrollments.spring,
                ...edaData.course_enrollments.summer
            ]) * 1.2,
            cohortYears
        )
        : null;

    const enrollmentTypeByIntensityOption = edaData?.enrollment_type_by_intensity
        ? createEnrollmentTypeByIntensityOptionFromData(edaData.enrollment_type_by_intensity)
        : null;

    const pellRecipientOption = edaData?.pell_recipient_by_first_gen
        ? createPellRecipientOptionFromData(edaData.pell_recipient_by_first_gen)
        : null;

    const studentAgeByGenderOption = edaData?.student_age_by_gender
        ? createStudentAgeByGenderOptionFromData(edaData.student_age_by_gender)
        : null;

    const raceByPellStatusOption = edaData?.race_by_pell_status
        ? createRaceByPellStatusOptionFromData(edaData.race_by_pell_status)
        : null;

    // Create summary stats from API data
    const summaryStats = edaData?.summary_stats ? [
        {
            label: 'Total Students',
            value: edaData.summary_stats.total_students,
        },
        {
            label: 'Transfer Students',
            value: edaData.summary_stats.transfer_students,
        },
        {
            label: 'Avg. Year 1 GPA - All Students',
            value: edaData.summary_stats.avg_year1_gpa_all_students,
        },
    ] : [];

    // Don't show full-screen spinner - use overlay instead

    if (error) {
        return (
            <AppLayout title="EDA Dashboard">
                <Head title="EDA Dashboard" />
                <div className="font-[Helvetica Neue] mb-8 min-w-full">
                    <PageHeading>Dashboard Home</PageHeading>
                    <div className="min-w-full bg-[#FAFAFA] p-6">
                        <div className="text-red-600 text-center py-8">
                            <p className="text-lg font-semibold">Error loading EDA data</p>
                            <p className="mt-2">{error}</p>
                            {!batchInfo && (
                                <p className="mt-4 text-sm">Unable to determine which batch to use. Please provide a batch_id in the URL query parameters or ensure you have at least one completed batch.</p>
                            )}
                            {batchInfo && (
                                <p className="mt-4 text-sm">Unable to load data from the backend API. Please check that the batch exists and contains valid data.</p>
                            )}
                        </div>
                    </div>
                </div>
            </AppLayout>
        );
    }
    
    // Helper to check if data has meaningful values (not all zeros/empty)
    const hasData = (data) => {
        if (!data) return false;
        if (Array.isArray(data)) return data.length > 0;
        if (typeof data === 'object') {
            if (data.total_students) {
                // Summary stats: check if any value is meaningful (not "0", "0", "N/A")
                const total = parseInt(data.total_students.replace(/,/g, '')) || 0;
                return total > 0;
            }
            if (data.cohort_years) return data.cohort_years.length > 0 && data.series?.some(s => s.data?.some(v => v !== 0));
            if (data.fall) return [...data.fall, ...data.winter, ...data.spring, ...data.summer].some(v => v > 0);
            if (data.categories) return data.categories.length > 0 && data.series?.some(s => s.data?.some(v => v > 0));
        }
        return true;
    };

    return (
        <AppLayout title="EDA Dashboard">
            <Head title="EDA Dashboard" />
            <div className={`font-[Helvetica Neue] mb-8 min-w-full ${batchLoading || loading ? 'waiting' : ''}`}>
                {(batchLoading || loading) && (
                    <div className="waiting-overlay">
                        <div className="waiting-spinner" role="status" aria-label="Loading"></div>
                    </div>
                )}
                <PageHeading>Dashboard Home</PageHeading>
                <div className="min-w-full bg-[#FAFAFA] p-6">
                    <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                        <H2>At a Glance</H2>
                        <div className="flex flex-row items-center gap-6 text-right text-sm font-light text-heading/80">
                            {batchInfo && (
                                <>
                                    <span>Showing analysis for: Batch {batchInfo.batch_id}</span>
                                    <span className="italic">
                                        {batchInfo.updated_at || batchInfo.created_at || ''}
                                    </span>
                                </>
                            )}
                        </div>
                    </div>
                    {hasData(edaData?.summary_stats) && (
                        <div className="grid gap-4 md:grid-cols-3 mb-5">
                            {summaryStats.map(stat => (
                                <StatCard key={stat.label} value={stat.value} label={stat.label} />
                            ))}
                        </div>
                    )}
                    {hasData(edaData?.gpa_by_enrollment_type) && (
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
                                    {enrollmentTypeOption && (
                                        <EChart
                                            option={enrollmentTypeOption}
                                            style={{ height: '320px', width: '100%' }}
                                        />
                                    )}
                                </div>
                            </div>
                        </Card>
                    )}
                    {hasData(edaData?.gpa_by_enrollment_intensity) && (
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
                                    {enrollmentIntensityOption && (
                                        <EChart
                                            option={enrollmentIntensityOption}
                                            style={{ height: '320px', width: '100%' }}
                                        />
                                    )}
                                </div>
                            </div>
                        </Card>
                    )}
                    {(hasData(edaData?.students_by_cohort_term) || hasData(edaData?.course_enrollments) || hasData(edaData?.degree_types) || hasData(edaData?.enrollment_type_by_intensity)) && (
                        <>
                            <H2 className="mb-6">Key Insights</H2>
                            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mb-6">
                                {hasData(edaData?.students_by_cohort_term) && (
                                    <Card>
                                        <div className="mb-4">
                                            <ChartTitle variant="small">Students by Cohort Year and Term</ChartTitle>
                                            <p className="mt-2 text-sm font-light text-[#4F4F4F]">
                                                A year by year analysis of when students started their journey at the institution
                                            </p>
                                        </div>
                                        {studentsByCohortOption && (
                                            <EChart option={studentsByCohortOption} />
                                        )}
                                    </Card>
                                )}
                                {hasData(edaData?.course_enrollments) && (
                                    <Card>
                                        <div className="mb-4">
                                            <ChartTitle variant="small">Course Enrollments Over Time</ChartTitle>
                                            <p className="mt-2 text-sm font-light text-[#4F4F4F]">
                                                Displays total student course enrollments per academic year and semester, showing trends in overall enrollment activity.
                                            </p>
                                        </div>
                                        {courseEnrollmentsOption && (
                                            <EChart option={courseEnrollmentsOption} />
                                        )}
                                    </Card>
                                )}
                            </div>
                            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mb-6">
                                {hasData(edaData?.degree_types) && (
                                    <Card>
                                        <div className="mb-4">
                                            <ChartTitle variant="small">Most Common Degree Types</ChartTitle>
                                            <p className="mt-2 text-sm font-light text-[#4F4F4F]">
                                                The following is a breakdown of degree types being sought by the student body.
                                            </p>
                                        </div>
                                        {edaData?.degree_types && (
                                            <EChart option={degreeTypesChartOptions(edaData.degree_types, edaData.summary_stats?.total_students)} />
                                        )}
                                    </Card>
                                )}
                                {hasData(edaData?.enrollment_type_by_intensity) && (
                                    <Card>
                                        <div className="mb-4">
                                            <ChartTitle variant="small">Student Enrollment Type by Intensity</ChartTitle>
                                            <p className="mt-2 text-sm font-light text-[#4F4F4F]">
                                                This chart signifies students who are first time, re-admitted, or transferred into school, broken down by whether they are enrolled at full time or part time intensity.
                                            </p>
                                        </div>
                                        {enrollmentTypeByIntensityOption && (
                                            <EChart option={enrollmentTypeByIntensityOption} />
                                        )}
                                    </Card>
                                )}
                            </div>
                        </>
                    )}
                    {(hasData(edaData?.pell_recipient_by_first_gen) || hasData(edaData?.student_age_by_gender) || hasData(edaData?.race_by_pell_status)) && (
                        <>
                            <H2 className="mb-6">Student Characteristics & Demographics</H2>
                            <div className="mb-6 text-sm font-light text-[#4F4F4F]">
                                DataKind does not use any demographic categories to train our model; we only use them to assess bias in the model predictions. We display the full demographics of the raw dataset here to make sure they match your understanding of your student body. If this data looks inaccurate, please confirm you uploaded the correct files. If you have further questions, please contact your account representative.
                            </div>
                            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mb-6">
                                {hasData(edaData?.pell_recipient_by_first_gen) && (
                                    <Card>
                                        <div className="mb-4">
                                            <ChartTitle variant="small">Pell Recipient by First Generation Status</ChartTitle>
                                            <p className="mt-2 text-sm font-light text-[#4F4F4F]">
                                                Here are students who are receiving a Pell Grant and whether they are first generation students.
                                            </p>
                                        </div>
                                        {pellRecipientOption && (
                                            <EChart option={pellRecipientOption} />
                                        )}
                                    </Card>
                                )}
                                {hasData(edaData?.student_age_by_gender) && (
                                    <Card>
                                        <div className="mb-4">
                                            <ChartTitle variant="small">Student Age by Gender</ChartTitle>
                                            <p className="mt-2 text-sm font-light text-[#4F4F4F]">
                                                An overview of female-identifying vs male-identifying students. This chart is broken down by gender and then by age categories.
                                            </p>
                                        </div>
                                        {studentAgeByGenderOption && (
                                            <EChart option={studentAgeByGenderOption} />
                                        )}
                                    </Card>
                                )}
                            </div>
                            {hasData(edaData?.race_by_pell_status) && (
                                <Card className="mb-6">
                                    <div className="mb-4">
                                        <ChartTitle variant="large">Race by Pell Status</ChartTitle>
                                        <p className="mt-2 text-sm font-light text-[#4F4F4F]">
                                            This chart shows what race students identify as and who are receiving a Pell Grant.
                                        </p>
                                    </div>
                                    {raceByPellStatusOption && (
                                        <EChart option={raceByPellStatusOption} />
                                    )}
                                </Card>
                            )}
                        </>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
