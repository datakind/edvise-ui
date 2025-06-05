import React, { useState } from 'react';
import AppLayout from '../Layouts/AppLayout';
import SupportOverview from '../Components/SupportOverview';
import Shap from '../Components/Shap';
import FullResults from '../Components/FullResults';
import SupportScores from '../Components/SupportScores';
import RocCurve from '../Components/RocCurve';
import ConfusionMatrix from '../Components/ConfusionMatrix';
import InterpretChart from '../Components/InterpretChart';

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

export default function ModelResultsOverview() {
  const [tab, setTab] = useState('results');

  return (
    <AppLayout title="Model Results Overview">
      <div className="w-full px-8 py-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="mx-auto text-5xl font-light">
            Model Results Overview
          </h1>
        </div>
        <div className="my-6">
          <button className="rounded-full bg-[#f79222] px-4 py-2 text-sm font-semibold text-white shadow hover:bg-[#e67c00]">
            Export Data
          </button>
        </div>
        <div className="mb-2 flex items-center gap-4">
          <button
            className={`px-2 pb-1 text-xl font-light ${tab === 'results' ? 'border-b-2 border-black text-[#222]' : 'text-[#637381]'}`}
            onClick={() => setTab('results')}
          >
            Latest Model Results
          </button>
          <button
            className={`px-2 pb-1 text-xl font-light ${tab === 'about' ? 'border-b-2 border-black text-[#222]' : 'text-[#637381]'}`}
            onClick={() => setTab('about')}
          >
            About this Model
          </button>
        </div>
        <hr className="-mt-2 mb-4 w-full border-black" />
        {tab === 'results' ? (
          <>
            <div className="mb-4 px-2 text-lg font-light text-black">
              Showing model results for: students.cohort.2024
            </div>
            <div className="mb-8">
              <SupportOverview />
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
                        Charts show the features that have the most influence on
                        this cohort of students' support scores.
                      </li>
                      <li>
                        Features are sorted from top to bottom in order of
                        importance.
                      </li>
                      <li>Each dot represents a student record.</li>
                      <li>
                        The relation between dot distribution and color tells
                        you how each feature affects student support needs.
                      </li>
                      <li>
                        For example, if darker dots are all clustered further to
                        the right, that means students with a higher value for
                        that feature are more likely to need support.
                      </li>
                    </ul>
                  </div>
                </div>
                <InterpretChart />
              </div>
              <div className="overflow-x-auto bg-white">
                <table className="w-full border-separate border-spacing-y-2 text-left">
                  <thead>
                    <tr>
                      <th className="w-1/3 pb-2 text-xs font-semibold text-[#637381]">
                        Click any of the feature names to learn more
                      </th>
                      <th
                        className="w-2/3 pb-2 text-center text-xs font-semibold text-[#637381]"
                        colSpan="2"
                      >
                        <span className="text-grey-700 float-left text-xs">
                          Decreasing likelihood of support needs
                        </span>
                        <span className="float-right">
                          Increasing likelihood of support needs
                        </span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {features.slice(0, 10).map((feature, idx) => (
                      <tr key={feature.name} className="align-top">
                        <td className="w-1/3 border-b border-r border-t border-[#e5e7eb] border-r-[#CDCDCD] py-3 pl-4 pr-4">
                          <div className="cursor-pointer text-2xl font-light text-[#007C8C] hover:underline">
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
                  </tbody>
                </table>
                <div className="text-grey-700 mx-auto mt-2 flex w-1/2 justify-between px-2 text-xs">
                  <span>Decreasing likelihood of support needs</span>
                  <span>Increasing likelihood of support needs</span>
                </div>
              </div>
            </div>
            <div className="mt-8 text-center text-xs text-[#637381]">
              Questions about how to interpret these results? Contact your
              account representative, and they'd be happy to help!
            </div>
          </>
        ) : (
          <>
            {/* Introduction Card */}
            <div className="mb-8 rounded-2xl bg-white p-6 shadow">
              <h2 className="mb-2 text-2xl font-light">Introduction</h2>
              <div className="text-xl text-black">
                This model was built to identify students who may need support
                to be retained or graduate on time. It's intended to empower
                academic advisors who provide intervention strategies with
                information on the factors impacting student need for support.
                The following figures demonstrate the performance of the model.
                You can also{' '}
                <a href="#" className="font-semibold underline">
                  download the model card here
                </a>{' '}
                for a comprehensive report on the model, including methodology,
                performance, and bias assessment.
              </div>
            </div>
            {/* Feature Value Table */}
            <div className="mb-8 rounded-2xl bg-white p-6 shadow">
              <h2 className="mb-2 text-2xl font-light">
                Original Feature Value Table
              </h2>
              <div className="mb-4 text-base text-black">
                The following chart shows how all features are weighted in the
                model.
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px] border-separate border-spacing-y-2 text-left">
                  <thead>
                    <tr>
                      <th className="pb-2 text-xs font-semibold text-[#637381]">
                        Feature Name
                      </th>
                      <th className="pb-2 text-xs font-semibold text-[#637381]">
                        Description
                      </th>
                      <th className="pb-2 text-xs font-semibold text-[#637381]">
                        Data Type
                      </th>
                      <th className="pb-2 text-xs font-semibold text-[#637381]">
                        Overall Feature Importance
                      </th>
                      <th className="pb-2 text-xs font-semibold text-[#637381]">
                        Range
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {features.map((f, i) => (
                      <tr key={f.name} className="align-top">
                        <td className="py-2 pr-2 font-semibold text-[#1a4b5c]">
                          {f.name}
                        </td>
                        <td className="py-2 pr-2 text-xs text-[#637381]">
                          {f.desc}
                        </td>
                        <td className="py-2 pr-2 text-xs text-[#637381]">
                          {f.type}
                        </td>
                        <td className="py-2 pr-2 text-xs text-[#637381]">
                          {f.importance}
                        </td>
                        <td className="py-2 pr-2 text-xs text-[#637381]">
                          {f.range}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
              <SupportScores />
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
}
