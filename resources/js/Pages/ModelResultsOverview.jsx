import React from 'react';
import AppLayout from '../Layouts/AppLayout';
import SupportOverview from '../Components/SupportOverview';
import Shap from '../Components/Shap';

const features = [
  {
    name: 'Degree GPA Departure Mean',
    desc: 'Students who have large changes to their GPA average.',
  },
  {
    name: 'Course Level 200',
    desc: 'Number of 200 courses taken',
  },
  {
    name: 'Course Prefix Mat',
    desc: 'Students taking a course in Math',
  },
  {
    name: 'Modified Course Hybrid',
    desc: 'Students taking a course that is in person and remote',
  },
  {
    name: 'Grade B',
    desc: 'Number of B grades earned this term',
  },
  {
    name: 'Course Prefix Bio',
    desc: 'Students taken a course in Biology',
  },
  {
    name: 'In Person Course Modality',
    desc: 'Course that is fully in person.',
  },
  {
    name: 'Degree Type Pursued',
    desc: 'Specific degrees students have for their major',
  },
  {
    name: 'Grade C',
    desc: 'Number of C grades earned this term',
  },
  {
    name: 'GPA Change',
    desc: 'Large shifts in a GPA over terms',
  },
  {
    name: 'Grade F',
    desc: 'Number of F grades earned this term',
  },
];

export default function ModelResultsOverview() {
  return (
    <AppLayout title="Model Results Overview">
      <div className="w-full px-8 py-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-semibold">Model Results Overview</h1>
          <button className="rounded-md bg-[#f79222] px-4 py-2 text-sm font-semibold text-white shadow hover:bg-[#e67c00]">
            Export Data
          </button>
        </div>
        <div className="mb-2 flex items-center gap-4">
          <button className="border-b-2 border-[#f79222] px-2 pb-1 font-semibold text-[#222]">
            Latest Model Results
          </button>
          <button className="px-2 pb-1 text-[#637381]">About this Model</button>
        </div>
        <div className="mb-2 text-sm text-[#637381]">
          Showing model results for:{' '}
          <span className="font-semibold">students.cohort.2024</span>
        </div>
        <div className="mb-8">
          <SupportOverview />
        </div>
        <div className="rounded-3xl bg-white p-8 shadow">
          <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="mb-1 text-xl font-semibold">
                Top 10 Areas with the Most Impact
              </h2>
              <div className="text-sm text-[#637381]">
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
                    The relation between dot distribution and color tells you
                    how each feature affects student support needs.
                  </li>
                  <li>
                    For example, if darker dots are all clustered further to the
                    right, that means students with a higher value for that
                    feature are more likely to need support.
                  </li>
                </ul>
              </div>
            </div>
            <div className="max-w-xs rounded-xl bg-[#F5FAFC] p-4 text-sm text-[#637381]">
              <div className="mb-1 font-semibold">
                How to interpret chart colors
              </div>
              <div>
                Lighter dots show lower student feature values
                <br />
                Darker dots show higher student feature values
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
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
                    <span className="float-left">
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
                    <td className="w-1/3 border-b border-t border-[#e5e7eb] py-3 pr-4">
                      <div className="cursor-pointer font-semibold text-[#1a4b5c] hover:underline">
                        {feature.name}
                      </div>
                      <div className="text-xs text-[#637381]">
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
            <div className="mt-2 flex justify-between px-2 text-xs text-[#637381]">
              <span>Decreasing likelihood of support needs</span>
              <span>Increasing likelihood of support needs</span>
            </div>
          </div>
        </div>
        <div className="mt-8 text-center text-xs text-[#637381]">
          Questions about how to interpret these results? Contact your account
          representative, and they'd be happy to help!
        </div>
      </div>
    </AppLayout>
  );
}
