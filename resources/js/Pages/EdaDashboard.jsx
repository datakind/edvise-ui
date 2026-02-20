import React, { useState, useEffect } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import ReactECharts from 'echarts-for-react';
import axios from 'axios';
import AppLayout from '@/Layouts/AppLayout';
import PageHeading from '@/Components/PageHeading';
import H2 from '@/Components/H2';
import StatCard from '@/Components/StatCard';
import Card from '@/Components/Card';
import Spinner from '@/Components/Spinner';
import wrap from 'word-wrap';
import { getBatchInfo } from '@/utils/batchUtils';

// Wrapper component with default props for ECharts
const EChart = ({ option, style, ...props }) => (
    <ReactECharts
        option={option}
        style={style || { height: '400px', width: '100%' }}
        opts={{ renderer: 'svg' }}
        {...props}
    />
);

// Base ECharts configuration with defaults
const baseEChartsConfig = {
    color: [
        '#F79222', // Orange
        '#00CFEA', // Light blue
        '#00CAAC', // Teal/green
        '#F66760', // Red
        '#385981', // Dark blue
        '#8B5CF6', // Purple
        '#EC4899', // Pink
        '#10B981', // Green
        '#F59E0B', // Amber
        '#3B82F6', // Blue
    ],
    legend: {
        icon: 'circle',
        textStyle: {
            color: '#1E343F',
            fontFamily: 'Helvetica Neue',
        },
    },
    textStyle: {
        fontFamily: 'Helvetica Neue',
    },
};

const lightenHexColor = (hexColor, amount = 0.75) => {
    const normalized = hexColor.replace('#', '');
    const r = parseInt(normalized.slice(0, 2), 16);
    const g = parseInt(normalized.slice(2, 4), 16);
    const b = parseInt(normalized.slice(4, 6), 16);
    const toHex = (value) => Math.round(value).toString(16).padStart(2, '0');
    const mix = (value) => value + (255 - value) * amount;
    return `#${toHex(mix(r))}${toHex(mix(g))}${toHex(mix(b))}`;
};

// Base chart configuration shared across GPA charts
const GpaChartOptions = ({ gpaData }) => {
    const styles = [
        { symbol: 'diamond', color: baseEChartsConfig.color[0] },
        { symbol: 'rect', color: baseEChartsConfig.color[1] },
        { symbol: 'circle', color: baseEChartsConfig.color[2] },
    ];

    const legendData = gpaData.series.map((series, index) => {
        const displayName = series.name.includes('Student')
            ? series.name
            : `${series.name} Student`;
        return {
            name: displayName,
            icon: styles[index].symbol,
            itemStyle: {
                color: lightenHexColor(styles[index].color),
                borderColor: styles[index].color,
                borderWidth: 1,
            },
        };
    });

    const seriesData = gpaData.series.map((series, index) => {
        const displayName = series.name.includes('Student')
            ? series.name
            : `${series.name} Student`;
        return {
            name: displayName,
            symbol: styles[index].symbol,
            symbolSize: styles[index].symbol === 'diamond' ? 16 : 12,
            itemStyle: {
                color: lightenHexColor(styles[index].color),
                borderColor: styles[index].color,
                borderWidth: 1,
            },
            data: series.data,
        };
    });

    return ({
    ...baseEChartsConfig,
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'line',
        },
        formatter: (params) => {
            if (!params?.length) return '';
            let result = params[0].axisValue + '<br/>';
            params.forEach(param => {
                if (typeof param.value !== 'number' || !Number.isFinite(param.value)) {
                    return;
                }
                result += `${param.marker}${param.seriesName}: ${param.value.toFixed(2)}<br/>`;
            });
            return result;
        },
    },
    legend: {
        ...baseEChartsConfig.legend,
        top: 10,
        right: 20,
        itemWidth: 16,
        itemHeight: 16,
        data: legendData,
    },
    xAxis: {
        type: 'category',
        name: 'Cohort Year',
        nameLocation: 'middle',
        nameGap: 30,
        nameTextStyle: {
            color: '#637381',
            fontSize: 14,
        },
        boundaryGap: false,
        data: gpaData?.cohort_years || [],
        axisLine: {
            lineStyle: { color: '#D7DCE5' },
        },
        axisLabel: {
            color: '#637381',
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
            fontSize: 14,
        },
        startValue: Math.round((gpaData.min_gpa - 0.2) / 0.2) * 0.2,
        interval: 0.2,
        axisLabel: {
            color: '#637381',
            formatter: (value) => value.toFixed(2),
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
        type: 'scatter',
    })),
    });
};

// Helper function to create enrollment type option from API data
const GPAByEnrollmentType = (gpaData) => {
    if (!gpaData || !gpaData.series) {
        return null;
    }

    return GpaChartOptions({ gpaData });
};

const enrollmentIntensityOptions = (gpaData) => {
    if (!gpaData || !gpaData.series) {
        return null;
    }

    return GpaChartOptions({ gpaData });
};

const createHorizontalStackedBarOption = ({ xAxisName, termChartData, yAxisName = 'Cohort Year' }) => {
    const y_axis_labels = termChartData?.years || termChartData?.y_axis_labels || [];
    const terms = termChartData?.terms || [];
    
    return {
        ...baseEChartsConfig,
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow',
            },
        },
        legend: {
            ...baseEChartsConfig.legend,
            bottom: 10,
            data: terms.map((t) => t.label),
            itemGap: 20,
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
                fontSize: 14,
            },
            axisLabel: {
                color: '#637381',
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
            inverse: true,
            data: y_axis_labels,
            axisLabel: {
                color: '#637381',
            },
            axisLine: {
                lineStyle: { color: '#D7DCE5' },
            },
        },
        series: terms.map((t) => ({
            name: t.label,
            type: 'bar',
            stack: 'terms',
            data: t.data ?? [],
        })),
    };
};

// Degree types donut – API returns degree_types: { total, degrees: [{ count, percentage, name }] }
const degreeTypesOptions = (edaData) => {
    const { total = 0, degrees: items = [] } = edaData.degree_types ?? {};
    return {
        ...baseEChartsConfig,
        tooltip: {
            trigger: 'item',
            formatter: (params) =>
                `${params.name}: ${Number(params.value).toLocaleString()} of ${total.toLocaleString()} (${params.data.percentage}%)`,
        },
        series: [
            {
                name: 'Degree Types',
                type: 'pie',
                radius: ['40%', '70%'],
                center: ['50%', '45%'],
                itemStyle: { borderRadius: 5, borderColor: '#fff', borderWidth: 2 },
                label: {
                    show: true,
                    fontSize: 14,
                    fontWeight: 'bold',
                    formatter: (params) => `${params.data.percentage}%`,
                },
                emphasis: { label: { show: true } },
                data: items.map((d) => ({ value: d.count, name: d.name, percentage: d.percentage > 1 ? Math.round(d.percentage) : d.percentage })),
            },
        ],
    };
};

// Flexible horizontal stacked bar chart for enrollment types
const createEnrollmentTypeStackedBarOption = ({ xAxisName, categories, data, legendData }) => ({
    ...baseEChartsConfig,
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow',
        },
    },
    legend: {
        ...baseEChartsConfig.legend,
        bottom: 10,
        data: legendData,
        itemGap: 20,
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
            fontSize: 14,
        },
        axisLabel: {
            color: '#637381',
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
        },
        axisLine: {
            lineStyle: { color: '#D7DCE5' },
        },
    },
    series: data,
});

// Build ECharts stacked-bar series from API payload (categories + series with name/data only).
const toStackedBarSeries = (series, stackId) =>
    series.map(s => ({ name: s.name, data: s.data, type: 'bar', stack: stackId }));

// Helper function to create enrollment type by intensity option from API data
const createEnrollmentTypeByIntensityOptionFromData = (data) => {
    if (!data || !data.categories || !data.series) {
        return null;
    }
    const seriesData = toStackedBarSeries(data.series, 'intensity');
    return createEnrollmentTypeStackedBarOption({
        xAxisName: 'Number of Students',
        categories: data.categories,
        data: seriesData,
        legendData: data.series.map(s => s.name),
    });
};

// Vertical stacked bar chart configuration
const createVerticalStackedBarOption = ({ yAxisName, xAxisName, categories, data, maxValue, legendData }) => ({
    ...baseEChartsConfig,
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow',
        },
    },
    legend: {
        ...baseEChartsConfig.legend,
        bottom: 10,
        data: legendData,
        itemGap: 20,
    },
    xAxis: {
        type: 'category',
        name: xAxisName,
        nameLocation: 'middle',
        nameGap: 30,
        nameTextStyle: {
            color: '#637381',
            fontSize: 14,
        },
        data: categories,
        axisLabel: {
            color: '#637381',
        },
        axisLine: {
            lineStyle: { color: '#D7DCE5' },
        },
    },
    yAxis: {
        show: true,
        type: 'value',
        name: yAxisName,
        nameLocation: 'middle',
        nameGap: 50,
        nameTextStyle: {
            color: '#637381',
            fontSize: 14,
        },
        axisLabel: {
            color: '#637381',
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
const pellRecipientByGeneration = (data) => {
    if (!data || !data.categories || !data.series) {
        return null;
    }
    const seriesData = toStackedBarSeries(data.series, 'first_gen');
    const baseOption = createVerticalStackedBarOption({
        yAxisName: 'Number of Students',
        xAxisName: 'Pell Grant Status',
        categories: data.categories,
        data: seriesData,
        legendData: data.series.map(s => s.name),
    });

    return {
        ...baseOption,
        graphic: [
            {
                type: 'text',
                left: 125,
                bottom: 15,
                style: {
                    text: 'First Generation Status:',
                    fontSize: 12,
                },
            },
        ],
    };
};

const pellRecipientStatus = (data) => {
    if (!data || !data.series) {
        return null;
    }
    const derivedCategories = data.categories || Object.keys(data.series[0]?.data || {}).sort();
    const normalizedSeries = data.series.map(series => ({
        ...series,
        data: Array.isArray(series.data)
            ? series.data
            : derivedCategories.map(category => series.data?.[category] ?? 0),
    }));
    const seriesData = toStackedBarSeries(normalizedSeries, 'pell_status');
    const baseOption = createVerticalStackedBarOption({
        yAxisName: 'Number of Students',
        xAxisName: 'Pell Grant Status',
        categories: derivedCategories,
        data: seriesData,
        legendData: normalizedSeries.map(s => s.name),
    });
    return {
        ...baseOption,
        legend: {
            ...baseOption.legend,
            show: false,
        },
    };
};

// Helper function to create student age by gender option from API data
const createStudentAgeByGenderOptionFromData = (data) => {
    if (!data || !data.categories || !data.series) {
        return null;
    }
    const seriesData = toStackedBarSeries(data.series, 'age_gender');
    return createEnrollmentTypeStackedBarOption({
        xAxisName: 'Number of Students',
        categories: data.categories,
        data: seriesData,
        legendData: data.series.map(s => s.name),
    });
};

const raceByPellStatusOptions = (data) => {
    if (!data || !data.categories || !data.series) {
        return null;
    }
    const seriesData = toStackedBarSeries(data.series, 'pell');
    const baseOption = createVerticalStackedBarOption({
        yAxisName: 'Number of Students',
        categories: data.categories,
        data: seriesData,
        legendData: data.series.map(s => s.name),
    });
    return {
        ...baseOption,
        xAxis: {
            ...baseOption.xAxis,
            axisLabel: {
                ...baseOption.xAxis.axisLabel,
                interval: 0,
                formatter: (value) => wrap(String(value ?? ''), { width: 15, trim: true }),
            },
        },
        legend: {
            ...baseOption.legend,
            top: 10,
            right: 20,
            bottom: undefined,
        },
        graphic: [
            {
                type: 'text',
                right: 140,
                top: 15,
                style: {
                    text: 'Pell Status First Year',
                    textAlign: 'left',
                    fill: '#767676',
                    fontFamily: 'Helvetica Neue',
                    fontSize: 12,
                },
            },
        ],
    };
};

export default function EdaDashboard({ batch_id: propBatchId }) {
    // Get inst_id and set-inst message from Inertia shared props
    const { inst_id, set_inst_required_message } = usePage().props;

    const [batchInfo, setBatchInfo] = useState(null);
    const [batchLoading, setBatchLoading] = useState(true);
    const [edaData, setEdaData] = useState(null);
    const [loading, setLoading] = useState(false); // Start false, will be set when batch_id is resolved
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!inst_id) {
            const msg = set_inst_required_message ?? 'Set an institution to proceed.';
            router.visit(`/set-inst?message=${encodeURIComponent(msg)}`);
        }
    }, [inst_id, set_inst_required_message]);

    // Fetch batch info - either from propBatchId or get most recent
    useEffect(() => {
        const fetchBatchInfo = async () => {
            if (!inst_id) {
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
    const enrollmentIntensityOption = edaData?.gpa_by_enrollment_intensity
        ? enrollmentIntensityOptions(edaData.gpa_by_enrollment_intensity)
        : null;

    const enrollmentTypeByIntensityOption = edaData?.enrollment_type_by_intensity
        ? createEnrollmentTypeByIntensityOptionFromData(edaData.enrollment_type_by_intensity)
        : null;


    const studentAgeByGenderOption = edaData?.student_age_by_gender
        ? createStudentAgeByGenderOptionFromData(edaData.student_age_by_gender)
        : null;

    const summaryStats = ['total_students', 'transfer_students', 'avg_year1_gpa_all_students'].filter((k) => edaData?.[k] != null);
    if (!inst_id) {
        return null;
    }
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
                    {summaryStats.length > 0 && (
                        <div className="grid gap-4 md:grid-cols-3 mb-5">
                            {summaryStats.map((k) => (
                                <StatCard key={k} label={edaData[k].name} value={edaData[k].value} />
                            ))}
                        </div>
                    )}
                    {edaData?.gpa_by_enrollment_type && (
                        <Card className="mb-6" titleLarge="Average Year 1 GPA by Enrollment Types">
                            <div className="grid grid-cols-12 gap-6">
                                <div className="col-span-12 md:col-span-4">
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
                                    {edaData?.gpa_by_enrollment_type && (
                                        <EChart
                                            option={GPAByEnrollmentType(edaData.gpa_by_enrollment_type)}
                                            style={{ height: '320px', width: '100%' }}
                                        />
                                    )}
                                </div>
                            </div>
                        </Card>
                    )}
                    {edaData?.gpa_by_enrollment_intensity && (
                        <Card className="mb-6" titleLarge="Average Year 1 GPA by Enrollment Intensity">
                            <div className="grid grid-cols-12 gap-6">
                                <div className="col-span-12 md:col-span-4">
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
                    {(edaData?.students_by_cohort_term || edaData?.course_enrollments || edaData?.degree_types?.degrees || edaData?.enrollment_type_by_intensity) && (
                        <>
                            <H2 className="mb-6">Key Insights</H2>
                            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mb-6">
                                {edaData?.students_by_cohort_term && (
                                    <Card title="Students by Cohort Year and Term">
                                        <div className="mb-4">
                                            <p className="mt-2 text-sm font-light text-[#4F4F4F]">
                                                A year by year analysis of when students started their journey at the institution
                                            </p>
                                        </div>
                                        {edaData?.students_by_cohort_term && (
                                            <EChart
                                                option={createHorizontalStackedBarOption({
                                                    xAxisName: 'Number of Students',
                                                    termChartData: edaData.students_by_cohort_term,
                                                    yAxisName: 'Cohort Year',
                                                })}
                                            />
                                        )}
                                    </Card>
                                )}
                                {edaData?.course_enrollments && (
                                    <Card title="Course Enrollments Over Time">
                                        <div className="mb-4">
                                            <p className="mt-2 text-sm font-light text-[#4F4F4F]">
                                                Displays total student course enrollments per academic year and semester, showing trends in overall enrollment activity.
                                            </p>
                                        </div>
                                        {edaData?.course_enrollments && (
                                            <EChart option={createHorizontalStackedBarOption({
                                                title: 'Course Enrollments Over Time',
                                                xAxisName: 'Total Number of Course Enrollments',
                                                termChartData: edaData.course_enrollments
                                            })} />
                                        )}
                                    </Card>
                                )}
                            </div>
                            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mb-6">
                                {edaData?.degree_types?.degrees && (
                                    <Card title="Most Common Degree Types">
                                        <div className="mb-4">
                                            <p className="mt-2 text-sm font-light text-[#4F4F4F]">
                                                The following is a breakdown of degree types being sought by the student body.
                                            </p>
                                        </div>
                                        {edaData?.degree_types?.degrees && (
                                            <EChart option={degreeTypesOptions(edaData)} />
                                        )}
                                    </Card>
                                )}
                                {edaData?.enrollment_type_by_intensity && (
                                    <Card title="Student Enrollment Type by Intensity">
                                        <div className="mb-4">
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
                    {(edaData?.pell_recipient_by_first_gen || edaData?.pell_recipient_status || edaData?.student_age_by_gender) && (
                        <>
                            <H2 className="mb-6">Student Characteristics & Demographics</H2>
                            <div className="mb-6 text-sm font-light text-[#4F4F4F]">
                                DataKind does not use any demographic categories to train our model; we only use them to assess bias in the model predictions. We display the full demographics of the raw dataset here to make sure they match your understanding of your student body. If this data looks inaccurate, please confirm you uploaded the correct files. If you have further questions, please contact your account representative.
                            </div>
                            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mb-6">
                                {edaData?.pell_recipient_by_first_gen && (
                                    <Card title="Pell Recipient by First Generation Status">
                                        <div className="mb-4">
                                            <p className="mt-2 text-sm font-light text-[#4F4F4F]">
                                                Here are students who are receiving a Pell Grant and whether they are first generation students.
                                            </p>
                                        </div>
                                        {edaData?.pell_recipient_by_first_gen && (
                                            <EChart option={pellRecipientByGeneration(edaData.pell_recipient_by_first_gen)} />
                                        )}
                                    </Card>
                                )}
                                {!edaData?.pell_recipient_by_first_gen && edaData?.pell_recipient_status && (
                                    <Card title="Pell Grant Status">
                                        <div className="mb-4">
                                            <p className="mt-2 text-sm font-light text-[#4F4F4F]">
                                                An overview of Pell Grant recipient status.
                                            </p>
                                        </div>
                                        {edaData?.pell_recipient_status && (
                                            <EChart option={pellRecipientStatus(edaData.pell_recipient_status)} />
                                        )}
                                    </Card>
                                )}
                                {edaData?.student_age_by_gender && (
                                    <Card title="Student Age by Gender">
                                        <div className="mb-4">
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
                            {edaData?.race_by_pell_status && (
                                <Card className="mb-6 grid grid-cols-6 gap-6" titleLarge="Race by Pell Status">
                                    <div>
                                        <p className="mt-2 text-sm font-light text-[#4F4F4F]">
                                            This chart shows what race students identify as and who are receiving a Pell Grant.
                                        </p>
                                    </div>
                                    <div className="col-span-5">
                                        <EChart
                                            option={raceByPellStatusOptions(edaData.race_by_pell_status)}
                                            style={{ height: '600px', width: '100%' }}
                                        />
                                    </div>
                                </Card>
                            )}
                        </>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
