import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Chart } from "react-google-charts";

import Spinner from '@/Components/Spinner';
import AppLayout from '@/Layouts/AppLayout';
import ModelRunHistory from '@/Components/ModelRunHistory';
import HeaderLabel from '@/Components/HeaderLabel';
import {
  ChartBarIcon,
  ArrowUpTrayIcon,
} from '@heroicons/react/24/outline';
const histogramOptions = {
  title: "Distribution of Support Scores",
  titleTextStyle: { fontSize: 18, bold: false },
  chartArea: { width: "80%", height: "70%" },
  legend: { position: "none" },
  colors: ['#f79222'],
  hAxis: {
    viewWindow: { min: 0, max: 100 },
    buckets: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
    format: '#', // Integer formatting
  },
  series: {
    0: {
      annotations: {
        style: 'none',
        textStyle: { color: 'black' }
      }
    }
  }
};

const barChartOptions = {
  title: "Top Indicators",
  titleTextStyle: { fontSize: 18, bold: false },
  legend: { position: "none" },
  colors: ['#f79222'],
  chartArea: {
    left: "40%",
    top: 75,
    right: 75,
    bottom: 75,
  },
  vAxis: {
    textStyle: {
      fontSize: 12,
    }
  }
};

const processRiskScoreData = (data) => {
  const chartData = [['Student ID', 'Risk Score']];
  for (const item of data) {
    chartData.push([item['Student ID'], item['Risk Score'] * 100]);
  }
  return chartData;
};

const processFeatureData = (data) => {
  const features = new Set();
  for (let i = 1; i < data.length; i++) {
    features.add(data[i].Feature);
  }
  const featureCounts = {};
  for (const feature of features) {
    featureCounts[feature] = 0;
  }
  for (let i = 1; i < data.length; i++) {
    featureCounts[data[i].Feature] += 1;
  }
  const chartData2 = [["Feature", "Count"]];
  const sortedFeatures = Object.entries(featureCounts).sort((a, b) => b[1] - a[1]);
  for (const [feature, count] of sortedFeatures) {
    chartData2.push([feature, count]);
  }
  return chartData2;
};

export default function Dashboard({ modelname }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modelInfo, setModelInfo] = useState({});
  const [runs, setRuns] = useState([]);
  const [outputFile, setOutputFile] = useState(null);
  // TODO get the shap png

  useEffect(() => {
    const fetchModel = async () => {
      // Get list of models for a given institution
      try {
        const response = await axios.get('/models-api');
        let models = response.data;
        let model = null;
        if (models == null || models.length == 0 ){
          // No models for this institution exist.
          setModelInfo(null);
        } else {

          if (modelname == null || modelname == ""){
            // No model specified, so we just pick one.
            model = models[0];
            setModelInfo(model);
          } else {
            // Find the specific model specified.
            specifiedModel = models.filter((m) => m.name == modelname);
            if (specifiedModel.length == 0 ) {
              // Specified model not found
              setModelInfo(null);
            }
            model = specifiedModel[0];
            setModelInfo(model);
          }
        }
        if (model != null) {
          const runs_response = await axios.get('/model/'+model.name);
          if (runs_response.data != null && runs_response.data.length != 0) {
          setRuns(runs_response.data);
          const file_response = await axios.get('/output-file-bytes/'+runs_response.data[0].output_filename);
          setOutputFile(file_response.data);
          }

        }
      } catch (err) {
        console.log(JSON.stringify(err));
        setModelInfo(null);
        setError("Error fetching model info");
      } finally {
        setLoading(false);
      }

      
    };
    fetchModel();
  }, []);

  /*useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/model-data/foo/bar/baz');
        setData(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
*/
  const triggerDownload = () => {
/*
// TODO: xxx impl

    const output = axios
      .get('/download-inf-data/' + modelInfo.output_filename)
      .then(res => {
        window.open(res.data, '_self');
      })
      .catch(err => {
        document.getElementById('result_area').innerHTML =
          '3' + filename + ' url:' + err;
      });*/
  };

  const chartData = processRiskScoreData(data);
  const chartData2 = processFeatureData(data);

  return (
    <AppLayout
      title="Dashboard"
      renderHeader={() => (
        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
          Dashboard
        </h2>
      )} 
    >
    {modelInfo == null || modelInfo == {} ?
     <div className="w-full flex flex-col items-center" id="main_area">
      <HeaderLabel
          className="pl-12"
          iconObj={
            <ChartBarIcon aria-hidden="true" className="size-6 shrink-0" />
          }
          majorTitle="Dashboard"
          minorTitle="No models exist for this institution"
        ></HeaderLabel>
     </div>: 
        (
      <div className="w-full flex flex-col items-center" id="main_area">

          <HeaderLabel
          className="pl-12"
          iconObj={
            <ChartBarIcon aria-hidden="true" className="size-6 shrink-0" />
          }
          majorTitle="Dashboard"
          minorTitle={modelInfo == null || modelInfo == {} ? "No model" : modelInfo.name}
        ></HeaderLabel>
        
        <div className="flex flex-row justify-between w-full pr-12 pl-12 pt-12">
        <div className="flex flex-row">
          Run Date: 
        </div>
        <button
            id="button_content"
            onClick={triggerDownload}
            className="bg-[#f79222] text-white py-2 px-3 rounded-md mb-4 flex flex-row gap-x-2 items-center justify-center"
          >
            <ArrowUpTrayIcon aria-hidden="true" className="size-6 shrink-0"/>Export
          </button>
          </div>
      {error && <div className="text-red-500 text-center mb-4">{error.message}</div>}
      {loading ? <Spinner /> :
        <div className='flex justify-between items-center flex-col m-auto'>
          <PrintableChart
            chartType="Histogram"
            data={chartData}
            options={histogramOptions}
            width={"800px"}
            height={"500px"}
          />
          <PrintableChart
            chartType="BarChart"
            data={chartData2}
            options={barChartOptions}
            width={"800px"}
            height={chartData2.length * 25 + 100}
          />
          <div className="w-full max-w-[1057px] mx-auto">
            <ModelRunHistory />
          </div>
        </div>
      }
      </div>) }
    </AppLayout>
  );
}

function PrintableChart({ chartType, data, options, width, height }) {
  const [chartWrapper, setChartWrapper] = useState(null);

  const handleDownload = () => {
    if (chartWrapper) {
      const uri = chartWrapper.getChart().getImageURI();
      const link = document.createElement('a');
      link.href = uri;
      link.download = 'chart.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div style={{ textAlign: 'center', position: 'relative' }}>
      <Chart
        chartType={chartType}
        data={data}
        options={options}
        width={width}
        height={height}
        style={{ margin: "20px auto" }}
        getChartWrapper={(wrapper) => setChartWrapper(wrapper)}
      />
      {chartWrapper && (
        <a
          onClick={handleDownload}
          style={{
            position: 'absolute',
            top: '24px',
            right: '10px',
            fontSize: '12px',
            color: '#007bff',
            cursor: 'pointer',
          }}
        >
          Download Chart
        </a>
      )}
    </div>
  );
}
