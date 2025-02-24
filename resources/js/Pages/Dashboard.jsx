import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Chart } from "react-google-charts";

import Spinner from '@/Components/Spinner';
import AppLayout from '@/Layouts/AppLayout';
import ModelRunHistory from '@/Components/ModelRunHistory';
import HeaderLabel from '@/Components/HeaderLabel';
import BigDangerAlert from '@/Components/BigDangerAlert';
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
    // TODO below only gets the csv file, update to handle shap as well

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // These only need to be set once
  const [modelInfo, setModelInfo] = useState({});
  const [runs, setRuns] = useState([]);
  const [runDatesToJobDict, setRunDatesToJobDict] = useState({});
  // These need to be set depending on the current run.
  const [outputFilename, setOutputFilename] = useState('');
  const [currentRunId, setCurrentRunId] = useState('');
  const [data, setData] = useState([]); // the raw json data of the csv file

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
            console.log("aaaaaaaaaaaaaaaaa1");
            let specifiedModel = models.filter((m) => m.name == modelname);
            console.log("aaaaaaaaaaaaaaaaa2");

            if (specifiedModel.length == 0 ) {
              // Specified model not found
              console.log("aaaaaaaaaaaaaaaaa3");
              setModelInfo(null);
            } else {
              console.log("aaaaaaaaaaaaaaaaa4");
              model = specifiedModel[0];
              setModelInfo(model);
          }
          }
        }
        if (model != null) {
          const runs_response = await axios.get('/model/'+model.name);
          if (runs_response.data != null && runs_response.data.length != 0) {
            let run_results = runs_response.data;
            setRuns(run_results);
            var runDatesDict = {};
                                  
            for(var i in run_results) {
              runDatesDict[run_results[i].triggered_at.split("T")[0]] =  run_results[i].run_id;
            }

            setRunDatesToJobDict(runDatesDict);
            // TODO get the most recent run
            if (run_results[0].output_filename != null) {
              setOutputFilename(run_results[0].output_filename);
              const file_response = await axios.get('/output-file-bytes/'+run_results[0].output_filename);
              // Store output as json instead of bytes.
              setData(JSON.stringify(file_response.data));
            }

          }

        }
      } catch (err) {
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
    if (outputFile != null && outputFile != "") {
      return axios
      .get('/download-inf-data/' + outputFile)
      .then(res => {
        window.open(res.data, '_self');
      })
      .catch(err => {
        setError(err);
      });
    }
    
  };

  const chartData = processRiskScoreData(data);
  const chartData2 = processFeatureData(data);


  // TODO handle the case where multiple runs occurred in one day
  const applyDate = (event) => {
    event.preventDefault();
    if (event.target.elements.run_time.value == "") {
      return;
    }
    let run_id = runDatesToJobDict[event.target.elements.run_time.value];
    setCurrentRunId(run_id);
    let runInfo = runs.filter((r) => r.run_id == run_id);

    if (runInfo.output_filename != null) {
      setOutputFilename(runInfo.output_filename);
      return axios.get('/output-file-bytes/'+runInfo.output_filename).then(res =>{
              // Store file as json.
              setData(JSON.stringify(res.data));
            }
        ).catch(err => setError(err));
    }
  };

  return (
    <AppLayout
      title="Dashboard"
      renderHeader={() => (
        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
          Dashboard
        </h2>
      )} 
    >
    {
      <div className="w-full flex" id="main_area">
      {loading ? (<Spinner />) : (
              error != null ?
    (<BigDangerAlert
            mainMsg={error}
            className="flex h-fit mr-24 ml-24"
          ></BigDangerAlert>
      ) : (
              <div className="w-full flex flex-col items-center" id="main_area">
                  <HeaderLabel
          className="pl-12"
          iconObj={
            <ChartBarIcon aria-hidden="true" className="size-6 shrink-0" />
          }
          majorTitle="Dashboard"
          minorTitle={modelInfo == null || modelInfo == {} ? "Model not found" : modelInfo.name}
        ></HeaderLabel>
        
        <div className="flex flex-row justify-between w-full pr-12 pl-12 pt-12">
        <form onSubmit={applyDate} className="flex flex-row gap-x-2 justify-center items-center">
        <div className="flex">
          Run Date: 
          </div>
          <div className="flex">
          {(runDatesToJobDict == undefined ||
      Object.keys(runDatesToJobDict).length == 0) ?

      (  <select
            className="flex bg-white border border-gray-200 text-gray-700 py-2 px-3 rounded-lg focus:outline-none focus:border-gray-500 justify-center items-center"
            id="run_time"
          >
            <option disabled value="">No runs exist</option>
          </select>
          ) : (
               <select
            className="flex bg-white border border-gray-200 text-gray-700 py-2 px-3 rounded-lg focus:outline-none focus:border-gray-500 justify-center items-center"
            id="run_time"
          >
          {Object.keys(runDatesToJobDict).map((r) => <option>{r}</option>)}
          </select>) }
          </div>
        
        <button
            type="submit"
            className="flex bg-white text-[#f79222] border border-[#f79222] py-2 px-3 rounded-lg justify-center items-center rounded-lg"
          >
            Apply
          </button>

      </form>
        <button
            id="button_content"
            onClick={triggerDownload}
            className="bg-[#f79222] text-white py-2 px-3 rounded-md mb-4 flex flex-row gap-x-2 items-center justify-center"
          >
            <ArrowUpTrayIcon aria-hidden="true" className="size-6 shrink-0"/>Export
          </button>
          </div>
        { data != null && data != [] ?
        (<div className='flex justify-between items-center flex-col m-auto'>

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
          ) : (<></>)}
         </div>
        )
        )
      }
      </div> }
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
