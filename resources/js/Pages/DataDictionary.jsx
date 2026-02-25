import React, { useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import PropTypes from 'prop-types';
import AppLayout from '@/Layouts/AppLayout';
import PageHeading from '@/Components/PageHeading';

import { toTitleCase } from '../utils/stringUtils';

export default function DataDictionary({ features = [] }) {
  usePage().props; // shared props (e.g. inst_id) available if needed
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('readable_feature_name');
  const [sortDirection, setSortDirection] = useState('asc');

  const filteredAndSortedFeatures = (Array.isArray(features) ? features : [])
    .filter(
      feature =>
        feature.readable_feature_name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        feature.short_feature_desc
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()),
    )
    .sort((a, b) => {
      const aValue = a[sortField] || '';
      const bValue = b[sortField] || '';

      if (sortDirection === 'asc') {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
    });

  const handleSort = field => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  return (
    <AppLayout title="Data Dictionary">
      <Head title="Data Dictionary" />
      <div className="font-[Helvetica Neue] mb-8 min-w-full">
        <PageHeading>Data Dictionary</PageHeading>

        {/* Unified Content Section */}
        <div className="bg-white p-6 px-12 shadow">
          {/* Submission Data Requirements Section */}
          <div className="mb-8">
            <h2 className="mb-4 text-3xl font-light">
              Submission Data Requirements
            </h2>
            <div className="space-y-4 text-xl font-light">
              <p>
                DataKind receives de-identified &ldquo;Analysis Ready
                (AR)&rdquo; files from the National Student Clearinghouse (NSC)
                using a &ldquo;StudyID&rdquo; field. Users should upload files
                aligned with{' '}
                <span className="font-bold underline">
                  AR file templates provided by NSC
                </span>
                .
              </p>
              <p>
                Important: If uploading a StudyID file, the &ldquo;Student
                ID&rdquo; column must be deleted. Only &ldquo;Study ID&rdquo; or
                &ldquo;Student GUID&rdquo; (both in quotes) should be included
                in data uploaded to Edvise.
              </p>
            </div>
          </div>

          {/* Output Data Format Section */}
          <div className="mb-8">
            <h2 className="mb-4 text-3xl font-light">Output Data Format</h2>
            <div className="mb-4 text-base font-light">
              <p>
                The model results output file is a CSV, with each row
                representing a student and providing insights into support needs
                and contributing features. The file contains the following
                columns:
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-[#E5E7EB]">
                <thead>
                  <tr className="bg-[#F9FAFB]">
                    <th className="whitespace-nowrap border border-[#e5e7eb] p-3 text-left text-xs font-medium text-[#6B7280]">
                      COLUMN NAME
                    </th>
                    <th className="border border-[#e5e7eb] p-3 text-left text-xs font-medium text-[#6B7280]">
                      INTERPRETATION
                    </th>
                    <th className="border border-[#e5e7eb] p-3 text-left text-xs font-medium text-[#6B7280]">
                      VALUE POSSIBILITIES
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-[#e5e7eb]">
                    <td className="whitespace-nowrap border border-[#e5e7eb] p-3 text-base font-medium">
                      Support Score
                    </td>
                    <td className="border border-[#e5e7eb] p-3 text-base font-light">
                      The degree to which a student needs support.
                    </td>
                    <td className="border border-[#e5e7eb] p-3 text-base font-light">
                      A value between 0 and 1:
                      <ul className="list-disc pl-5">
                        <li>
                          Closer to 0 means the student likely needs very little
                          support
                        </li>
                        <li>
                          Closer to 1 means the student likely needs more
                          support
                        </li>
                      </ul>
                    </td>
                  </tr>
                  <tr className="border-b border-[#e5e7eb]">
                    <td className="whitespace-nowrap border border-[#e5e7eb] p-3 text-base font-medium">
                      Support Needed
                    </td>
                    <td className="border border-[#e5e7eb] p-3 text-base font-light">
                      A binary indicator of whether or not a student is in need
                      of support
                    </td>
                    <td className="border border-[#e5e7eb] p-3 text-base font-light">
                      There are two possible values for this field:
                      <ul className="list-disc pl-5">
                        <li>0 = less likely to be in need of support</li>
                        <li>1 = more likely to be in need of support</li>
                      </ul>
                    </td>
                  </tr>
                  <tr className="border-b border-[#e5e7eb]">
                    <td className="whitespace-nowrap border border-[#e5e7eb] p-3 text-base font-medium">
                      Feature Name (1-5)
                    </td>
                    <td className="border border-[#e5e7eb] p-3 text-base font-light">
                      There are five columns that provide the top 5 features
                      impacting the support score for each student, in order of
                      decreasing importance for the student (the most important
                      feature is at the top).
                    </td>
                    <td className="border border-[#e5e7eb] p-3 text-base font-light">
                      The values will be strings describing the features. For a
                      more detailed understanding of each feature, please see
                      &ldquo;about this model.&rdquo;
                    </td>
                  </tr>
                  <tr className="border-b border-[#e5e7eb]">
                    <td className="whitespace-nowrap border border-[#e5e7eb] p-3 text-base font-medium">
                      Feature Value (1-5)
                    </td>
                    <td className="border border-[#e5e7eb] p-3 text-base font-light">
                      The value of the specified feature for the student.
                    </td>
                    <td className="border border-[#e5e7eb] p-3 text-base font-light">
                      This depends on the range of possibilities for the
                      feature: some are categorical (i.e. major) and some are
                      numerical (i.e. GPA).
                    </td>
                  </tr>
                  <tr className="border-b border-[#e5e7eb]">
                    <td className="whitespace-nowrap border border-[#e5e7eb] p-3 text-base font-medium">
                      Feature Importance (1-5)
                    </td>
                    <td className="border border-[#e5e7eb] p-3 text-base font-light">
                      The degree to which this particular feature impacts the
                      student&apos;s support score. Statistically, this is the
                      feature&apos;s SHAP value for the student. In interpreting
                      it, simply compare this number to other feature importance
                      values to understand the relative impact.
                    </td>
                    <td className="border border-[#e5e7eb] p-3 text-base font-light">
                      This will be a positive or negative decimal:
                      <ul className="list-disc pl-5">
                        <li>
                          A positive value indicates that the feature being
                          higher increases the student&apos;s support score
                        </li>
                        <li>
                          A negative value indicates that this feature being
                          higher decreases the student&apos;s support score
                        </li>
                      </ul>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Original Feature Value Table Section */}
          <div>
            {/* Header with title/description on left, search on right */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <h2 className="mb-2 text-3xl font-light">
                  Original Feature Value Table
                </h2>
                <p className="text-base font-light">
                  This chart provides more context on all features utilized by the model.
                </p>
              </div>

              {/* Search Bar */}
              <div className="relative w-64 ml-4">
                <input
                  type="text"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full rounded-full border border-[#e5e7eb] px-4 py-2 pr-10 focus:border-[#007C8C] focus:outline-none"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Table Container */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-[#e5e7eb]">
                <thead>
                  <tr className="bg-[#f9fafb]">
                    <th
                      className="cursor-pointer border border-[#e5e7eb] p-3 text-left text-xs font-medium text-[#6B7280]"
                      onClick={() => handleSort('readable_feature_name')}
                    >
                      <div className="flex items-center gap-2">
                        FEATURE NAME
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                          />
                        </svg>
                      </div>
                    </th>
                    <th className="border border-[#e5e7eb] p-3 text-left text-xs font-medium text-[#6B7280]">
                      DESCRIPTION
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAndSortedFeatures.map(feature => (
                    <tr
                      key={feature.readable_feature_name}
                      className="border-b border-[#E5E7EB] align-top last:border-b-0"
                    >
                      <td className="border border-[#e5e7eb] py-3 pl-4 pr-4">
                        <div className="text-base font-medium text-black">
                          {toTitleCase(feature.readable_feature_name)}
                        </div>
                      </td>
                      <td className="border border-[#e5e7eb] py-3 pl-4 pr-4">
                        <div className="text-base font-light text-[#696969]">
                          {feature.short_feature_desc}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

DataDictionary.propTypes = {
  features: PropTypes.arrayOf(PropTypes.object),
};
