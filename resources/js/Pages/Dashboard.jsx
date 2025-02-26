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

const processRiskScoreData = (data) => {
  const chartData = [['Student ID', 'Support Score']];
  for (const item of data) {
    chartData.push([item['Student ID'], item['Support Score'] * 100]);
  }
  return chartData;
};

export default function Dashboard({ modelname }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // These only need to be set once
  const [modelInfo, setModelInfo] = useState({});
  const [runs, setRuns] = useState([]);
  const [runDatesToJobDict, setRunDatesToJobDict] = useState({});
  // These need to be set depending on the current run.
  const [currentRunId, setCurrentRunId] = useState('');
  const [currentRunCompleted, setCurrentRunCompleted] = useState(false); // Whether the current run has output and has completed.
  const [outputFilename, setOutputFilename] = useState('');
  const [outputApproved, setOutputApproved] = useState(false);
  const [data, setData] = useState([]); // the raw json data of the csv file
  const [shapImgBlob, setShapImgBlob] = useState(null); // the img blob

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
          throw new Error("This institution does not have any models.");
        } else {

          if (modelname == null || modelname == ""){
            // No model specified, so we just pick one.
            model = models[0];
            setModelInfo(model);
          } else {
            // Find the specific model specified.
            let specifiedModel = models.filter((m) => m.name == modelname);
            if (specifiedModel.length == 0 ) {
              // Specified model not found
              setModelInfo(null);
              throw new Error("Specified model "+modelname+" not found.");
            } else {
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
              // TODO: currently we show the full timestamp, so that multiple runs within a date can be shown
              // runDatesDict[run_results[i].triggered_at.split("T")[0]] =  run_results[i].run_id;
              runDatesDict[run_results[i].triggered_at] =  run_results[i].run_id;
            }

            setRunDatesToJobDict(runDatesDict);
            if (runDatesDict == {}) {
                throw new Error("Could not find run dates for "+model.name);      
            }
            let csv_filename = run_results.find(r => r.run_id === currentRunId)?.output_filename;
            if (csv_filename != null) {
              setCurrentRunCompleted(true);
              setOutputFilename(csv_filename);
              setOutputApproved(run_results.find(r => r.run_id === currentRunId)?.output_valid);
              const file_response = await axios.get('/output-file-json/'+csv_filename);
              let shap_filename = csv_filename.replace("inference_output.csv", "shap_chart.png");
              // For the csv data used for histogram, store output as json instead of bytes.
              setData(file_response.data);
              // Create a URL for the Blob
              setShapImgBlob('/output-file-png/'+shap_filename);
            } else {
              // If the output filename isn't present in the run, that means it hasn't completed.
              setCurrentRunCompleted(false);
            }

          } else {
            throw new Error(model.name+" does not have any runs.");
          }

        }
      } catch (err) {
        if (err.response != null && err.response.data != null && err.response.data.error != null) {          
          setError(Error(err.response.data.error));
        } else {
          setError(err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchModel();
  }, [currentRunId]);

  const triggerDownload = () => {
    if (outputFilename != null && outputFilename != "") {
      return axios
      .get('/download-inf-data/' + outputFilename)
      .then(res => {
        window.open(res.data, '_self');
      })
      .catch(err => {
        if (err.response != null && err.response.data != null && err.response.data.error != null) {          
          setError(Error(err.response.data.error));
        } else {
          setError(err);
        }
      });
    }
    
  };

  const chartData = processRiskScoreData(data);

  // TODO how to handle the case where multiple runs occurred in one day
  const applyDate = (event) => {
    event.preventDefault();
    if (event.target.elements.run_time.value == "") {
      return;
    }
    let run_id = runDatesToJobDict[event.target.elements.run_time.value];
    setCurrentRunId(run_id);
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
      {loading ? (<div className="flex justify-center w-full">
           <Spinner mainMsg="Loading"></Spinner>
        </div>) : (
              error != null ?
    (<BigDangerAlert
            mainMsg={"Error: "+ error.message}
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
        { currentRunCompleted ?
        (<div className='flex justify-between items-center flex-col m-auto'>
          {outputApproved ? (<div className="flex"> Output Validated by Datakinder.</div>) : (<div className="flex">Output NOT Validated by Datakinder.</div>)}
          <PrintableChart
            chartType="Histogram"
            data={chartData}
            options={histogramOptions}
            width={"800px"}
            height={"500px"}
          />
          {/* <PrintableChart
            chartType="BarChart"
            data={chartData2}
            options={barChartOptions}
            width={"800px"}
            height={chartData2.length * 25 + 100}
          /> */}
        <img id="ShapPreview" alt="shap value graph" src={shapImgBlob}/>
          </div>
          ) : (<div className="flex w-full justify-center font-bold text-xl">
            Data not yet available.
          </div>)}
          <div className="w-full max-w-[1057px] mx-auto">
            <ModelRunHistory />
          </div>
         </div>
        )
        )
      }
      </div> }
    </AppLayout>
  );
}

function bytesToBase64(bytes) {
  return new Promise((resolve, _) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    const blob = new Blob([bytes], { type: 'image/png' });
    reader.readAsDataURL(blob);
  });
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
