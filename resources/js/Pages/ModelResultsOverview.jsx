import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Head } from '@inertiajs/react';
import PropTypes from 'prop-types';
import AppLayout from '../Layouts/AppLayout';
import SupportOverview from '../Components/SupportOverview';
import Shap from '../Components/Shap';
import SupportScores from '../Components/SupportScores';
import RocCurve from '../Components/RocCurve';
import ConfusionMatrix from '../Components/ConfusionMatrix';
import InterpretChart from '../Components/InterpretChart';
import FeatureValue from '../Components/FeatureValue';
import BoxWhiskerPlot from '../Components/BoxWhiskerPlot';
import InterpretChartSimple from '../Components/InterpretChartSimple';
import '../../css/landing.css';

const features = [
  {
    name: 'GPA Departure',
    desc: 'Students who have large changes to their GPA average.',
    type: 'Numerical',
    importance: 0.15,
    range: '0.12 to 0.2',
  },
  {
    name: 'Course Level 200',
    desc: 'Number of 200 courses taken',
    type: 'Numerical',
    importance: 0.09,
    range: '0.05 to 0.12',
  },
  {
    name: 'Course with MAT',
    desc: 'Students taking math courses this term',
    type: 'Numerical',
    importance: 0.08,
    range: '0.04 to 0.1',
  },
  {
    name: 'Grade B',
    desc: 'Number of B grades earned this term',
    type: 'Numerical',
    importance: 0.07,
    range: '0.03 to 0.12',
  },
  {
    name: 'Course prefix Bio',
    desc: 'Students taking biology courses this term',
    type: 'Numerical',
    importance: 0.06,
    range: '0.02 to 0.09',
  },
  {
    name: 'Modality In Person',
    desc: 'Taking in-person courses',
    type: 'Numerical',
    importance: 0.04,
    range: '0.01 to 0.07',
  },
  {
    name: 'Grade C',
    desc: 'Number of C grades earned this term',
    type: 'Numerical',
    importance: 0.04,
    range: '0.01 to 0.07',
  },
];

function ModelResultsOverview({ run_id, modelName }) {
  console.log('run_id:', run_id);
  console.log('ModelResultsOverview - Received run_id:', run_id);
  console.log('ModelResultsOverview - Received modelName:', modelName);

  const [inst_id, setInstId] = useState(null);
  const [runDetails, setRunDetails] = useState(null);

  // Get institution ID when component mounts
  useEffect(() => {
    const fetchInstitutionId = async () => {
      try {
        const response = await axios.get('/user-current-inst-api');
        console.log(
          'ModelResultsOverview - Institution API response:',
          response.data,
        );
        if (response.data && response.data.length > 0) {
          setInstId(response.data[0]); // First element is the institution ID
          console.log(
            'ModelResultsOverview - Set institution ID to:',
            response.data[0],
          );
        }
      } catch (error) {
        console.error('Error fetching institution ID:', error);
        console.error('Error response:', error.response?.data);
      }
    };

    fetchInstitutionId();
  }, []);

  // Get run details when we have both inst_id and run_id
  useEffect(() => {
    const fetchRunDetails = async () => {
      if (!inst_id || !run_id) return;

      const apiUrl = `/institutions/${inst_id}/models/${modelName}/run/${run_id}`;
      console.log('ModelResultsOverview - Making API call to:', apiUrl);
      console.log(
        'ModelResultsOverview - Full URL:',
        window.location.origin + apiUrl,
      );

      try {
        const response = await axios.get(apiUrl);
        setRunDetails(response.data);
        console.log('Run details fetched:', response.data);
      } catch (error) {
        console.error('Error fetching run details:', error);
        console.error('Error response:', error.response?.data);
      }
    };

    fetchRunDetails();
  }, [inst_id, run_id, modelName]);

  // Get output_link and output_filename from run details
  const output_link = runDetails ? runDetails.output_file_link : null;
  const output_filename = runDetails ? runDetails.output_filename : null;

  console.log('ModelResultsOverview - Fetched inst_id:', inst_id);
  console.log('ModelResultsOverview - Run details:', runDetails);
  console.log('ModelResultsOverview - Constructed output_link:', output_link);

  const [tab, setTab] = useState('results');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState(null);

  const handleFeatureClick = feature => {
    setSelectedFeature(feature);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedFeature(null);
  };

  const handleExportData = () => {
    if (output_link) {
      // Create a temporary link element to trigger the download
      const link = document.createElement('a');
      link.href = output_link;
      link.download = output_filename || 'model_results.csv';
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      console.error('No output file available for download');
    }
  };

  return (
    <AppLayout title="Model Results Overview">
      <Head title="Model Results Overview" />
      <div className="font-[Helvetica Neue] mb-8 min-w-full">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="mx-auto text-5xl font-light">
            Model Results Overview
          </h1>
        </div>
        <div className="my-6">
          <button
            onClick={handleExportData}
            disabled={!output_link}
            className={`ml-8 rounded-full px-4 py-2 text-base font-normal text-black shadow ${
              output_link
                ? 'bg-[#f79222] hover:bg-[#e67c00]'
                : 'cursor-not-allowed bg-gray-400'
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="mr-2 inline-block size-5 pb-1"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
              />
            </svg>
            {output_link ? 'Export Data' : 'No Data Available'}
          </button>
        </div>
        <div className="min-w-full bg-[#FAFAFA] p-6">
          <div className="mb-2 flex items-center gap-4">
            <button
              className={`px-2 pb-1 text-xl font-light ${tab === 'results' ? 'rounded-t-lg border-b-2 border-black bg-[#EEF2F6] p-1 font-semibold text-black' : 'text-[#637381]'}`}
              onClick={() => setTab('results')}
            >
              Latest Model Results
            </button>
            <button
              className={`px-2 pb-1 text-xl font-light ${tab === 'about' ? 'rounded-t-lg border-b-2 border-black bg-[#EEF2F6] p-1 font-semibold text-black' : 'text-[#637381]'}`}
              onClick={() => setTab('about')}
            >
              About this Model
            </button>
          </div>
          <hr className="-mt-2 mb-4 w-full border-black" />

          {/* Show batch and model info on both tabs */}
          <div className="mb-4 flex justify-between px-2 text-lg font-light text-black">
            <div>
              Showing results for data batch:{' '}
              <a
                href={route('manage-uploads')}
                className="text-black hover:underline"
              >
                {runDetails?.batch_name || 'Loading...'}
              </a>
            </div>
            <div>Run on model: {modelName}</div>
          </div>

          {tab === 'results' ? (
            <>
              <div className="mb-8">
                <SupportOverview tab={tab} setTab={setTab} run_id={run_id} />
              </div>
              <div className="rounded-3xl bg-[#EEF2F6] p-8 shadow">
                <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="pb-4 text-2xl font-light">
                      Top 10 Areas with the Most Impact
                    </h2>
                    <div className="text-sm text-black">
                      <div className="mb-1 font-semibold">
                        How to read these charts
                      </div>
                      <ul className="ml-5 list-disc">
                        <li>
                          Charts show the features that have the most influence
                          on this cohort of students&apos; support scores.
                        </li>
                        <li>
                          Features are sorted from top to bottom in order of
                          importance.
                        </li>
                        <li>Each dot represents a student record.</li>
                        <li>
                          The relation between dot distribution and color tells
                          you how each feature affects student support needs.
                          <ul className="ml-5 list-disc">
                            <li>
                              For example, if darker dots are all clustered
                              further to the right, that means students with a
                              higher value for that feature are more likely to
                              need support.
                            </li>
                          </ul>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <InterpretChart />
                </div>
                <div className="-mx-8 -mb-8 overflow-x-auto rounded-b-3xl bg-white">
                  <table className="w-full text-left">
                    <thead>
                      <tr>
                        <th
                          scope="col"
                          className="w-1/3 p-2 text-sm text-xs font-bold text-black"
                        >
                          Click any of the feature names to learn more
                        </th>
                        <th
                          className="w-2/3 p-2 text-center text-xs font-semibold text-[#3E3E3E]"
                          colSpan="2"
                          scope="col"
                        >
                          <span className="text-grey-700 float-left text-xs font-medium">
                            <span className="font-bold">Decreasing</span>{' '}
                            likelihood of support needs
                            {/* Left arrow */}
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="#000"
                              className="size-6"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18"
                              />
                            </svg>
                          </span>
                          <span className="float-right font-medium">
                            <span className="font-bold">Increasing</span>{' '}
                            likelihood of support needs
                            {/* Right arrow */}
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="#000"
                              className="size-6"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
                              />
                            </svg>
                          </span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {features.slice(0, 10).map((feature, idx) => (
                        <tr
                          key={feature.name}
                          className={`border-b border-[#E5E7EB] align-top last:border-b-0 ${idx % 2 === 1 ? 'bg-[#F7F9FB]' : ''}`}
                        >
                          <td className="w-1/3 border-b border-r border-t border-[#e5e7eb] border-r-[#CDCDCD] py-3 pl-4 pr-4">
                            <div
                              className="cursor-pointer text-2xl font-light text-[#007C8C] hover:underline"
                              onClick={() => handleFeatureClick(feature)}
                            >
                              {feature.name}
                            </div>
                            <div className="text-base text-[#4F4F4F]">
                              {feature.desc}
                            </div>
                          </td>
                          <td className="w-2/3 border-b border-t border-[#e5e7eb] py-3">
                            <Shap />
                          </td>
                        </tr>
                      ))}
                      <tr>
                        <td className="w-1/3 p-2 text-sm text-xs font-bold text-black"></td>
                        <td
                          className="w-2/3 p-2 text-center text-xs font-semibold text-[#3E3E3E]"
                          colSpan="2"
                        >
                          <span className="text-grey-700 float-left text-xs font-medium">
                            <span className="font-bold">Decreasing</span>{' '}
                            likelihood of support needs
                            {/* Left arrow */}
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="#000"
                              className="size-6"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18"
                              />
                            </svg>
                          </span>
                          <span className="float-right font-medium">
                            <span className="font-bold">Increasing</span>{' '}
                            likelihood of support needs
                            {/* Right arrow */}
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="#000"
                              className="size-6"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
                              />
                            </svg>
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  <div className="my-8 text-center text-sm font-bold text-[#4F4F4F]">
                    Questions about how to interpret these results? Contact your
                    account representative, and they&apos;d be happy to help!
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Introduction Card */}
              <div className="mb-8 rounded-2xl bg-white p-6 shadow">
                <h2 className="mb-2 text-2xl font-light">Introduction</h2>
                <div className="text-xl text-black">
                  This model was built to identify students who may need support
                  to be retained or graduate on time. It&apos;s intended to
                  empower academic advisors who provide intervention strategies
                  with information on the factors impacting student need for
                  support. The following figures demonstrate the performance of
                  the model. You can also{' '}
                  <a
                    href="#"
                    onClick={e => {
                      e.preventDefault();
                      if (inst_id && modelName) {
                        const apiUrl = `/institutions/${inst_id}/training/model-cards/${modelName}`;
                        console.log('Downloading model card from:', apiUrl);
                        // Make API call to download model card through backend
                        window.open(apiUrl, '_blank');
                      } else {
                        console.error(
                          'Missing inst_id or modelName for model card download',
                        );
                      }
                    }}
                    className="cursor-pointer font-semibold text-black underline hover:opacity-80"
                  >
                    download the model card here
                  </a>{' '}
                  for a comprehensive report on the model, including
                  methodology, performance, and bias assessment.
                </div>
              </div>
              <div className="mb-8">
                {/* Feature Value Table */}
                <FeatureValue features={features} />
              </div>
              {/* Confusion Matrix */}
              <div className="mb-8">
                <ConfusionMatrix />
              </div>
              {/* ROC Curve */}
              <div className="mb-8">
                <RocCurve />
              </div>
              {/* Support Scores Histogram */}
              <div className="mb-8">
                <SupportScores tab={tab} setTab={setTab} />
              </div>
            </>
          )}
        </div>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="fixed inset-0 bg-black bg-opacity-80"
            onClick={closeModal}
          ></div>
          <div className="relative mx-4 max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg border border-2 border-[#F79122] bg-white shadow-xl">
            <button
              onClick={closeModal}
              className="absolute right-4 top-4 text-black hover:opacity-80"
              aria-label="Close modal"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="#F79122"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            </button>
            <div className="p-8">
              <div className="mb-6">
                <h2 className="mb-2 text-3xl font-medium text-black">
                  Details: {selectedFeature?.name}
                </h2>
                <p className="text-xl font-light text-[#4F4F4F]">
                  {selectedFeature?.desc}
                </p>
              </div>
              <div className="mb-6">
                <h3 className="mb-2 text-xl font-medium">Range</h3>
                <hr className="mb-4 border-[#4F4F4F]" />
                <div className="mb-4 text-sm text-[#4F4F4F]">
                  This box and whiskers plot shows the minimum, median, maximum,
                  and quartile points for this feature in the student
                  dataset.{' '}
                </div>
                <div className="mb-16">
                  <BoxWhiskerPlot />
                </div>
              </div>
              <div className="mb-6">
                <h3 className="mb-2 text-xl font-medium">Student Plot Chart</h3>
                <hr className="mb-4 border-[#4F4F4F]" />
                <div className="flex gap-8">
                  <div className="w-1/2">
                    <div className="text-sm text-[#4F4F4F]">
                      <p className="mb-2">
                        <strong>How to interpret this chart:</strong>
                      </p>
                      <ul className="list-disc space-y-1 pl-5">
                        <li>
                          Charts show the features that have the most influence
                          on this cohort of students’ support scores.
                        </li>
                        <li>
                          Features are sorted from top to bottom in order of
                          importance.
                        </li>
                        <li>Each dot represents a student record.</li>
                        <li>
                          The relation between dot distribution and color tells
                          you how each feature affects student support needs.
                          <ul className="list-disc space-y-1 pl-5">
                            <li>
                              For example, if darker dots are all clustered
                              further to the right, that means students with a
                              higher value for that feature are more likely to
                              need support.
                            </li>
                          </ul>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="w-1/2">
                    <InterpretChartSimple />
                  </div>
                </div>
                <div className="mt-6 border-b border-[#767676] bg-[#F7F9FB] p-6">
                  <Shap />
                </div>
                <div className="mt-4 flex justify-center gap-16 px-2 text-sm text-[#4F4F4F]">
                  <div className="flex flex-col items-end">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18"
                      />
                    </svg>
                    <span className="mt-1 text-right">
                      <span className="text-xs font-bold">Decreasing</span>{' '}
                      likelihood of support needs
                    </span>
                  </div>
                  <div className="flex flex-col items-start">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
                      />
                    </svg>
                    <span className="mt-1 text-left">
                      <span className="text-xs font-bold">Increasing</span>{' '}
                      likelihood of support needs
                    </span>
                  </div>
                </div>
                <div className="mt-8 text-center text-xs font-bold text-[#767676]">
                  Questions about how to interpret these results? Contact your
                  account representative, and they&apos;d be happy to help!
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}

ModelResultsOverview.propTypes = {
  run_id: PropTypes.string.isRequired,
  output_link: PropTypes.string,
  modelName: PropTypes.string,
};

export default ModelResultsOverview;
