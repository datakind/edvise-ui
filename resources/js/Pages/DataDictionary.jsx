import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Head } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

import { formatModelName } from '../utils/stringUtils';

export default function DataDictionary() {
  const [inst_id, setInstId] = useState(null);
  const [selectedModel, setSelectedModel] = useState(null);
  const [run_id, setRunId] = useState(null);
  const [features, setFeatures] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('feature_readable_name');
  const [sortDirection, setSortDirection] = useState('asc');

  // Get institution ID when component mounts
  useEffect(() => {
    const fetchInstitutionId = async () => {
      try {
        const response = await axios.get('/user-current-inst-api');
        console.log(
          'DataDictionary - Institution API response:',
          response.data,
        );
        if (response.data && response.data.length > 0) {
          setInstId(response.data[0]); // First element is the institution ID
          console.log(
            'DataDictionary - Set institution ID to:',
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

  // Get models when we have inst_id
  useEffect(() => {
    const fetchModels = async () => {
      if (!inst_id) return;

      try {
        const response = await axios.get('/models-api');
        console.log('Models fetched:', response.data);

        if (response.data && response.data.length > 0) {
          // Get the first valid model
          const validModel = response.data.find(
            model => model.valid === true || model.valid === 1,
          );
          if (validModel) {
            setSelectedModel(validModel);
            console.log('Selected model:', validModel);
          }
        }
      } catch (error) {
        console.error('Error fetching models:', error);
      }
    };

    fetchModels();
  }, [inst_id]);

  // Get most recent run when we have a selected model
  useEffect(() => {
    const fetchModelRuns = async () => {
      if (!inst_id || !selectedModel) return;

      try {
        const response = await axios.get(`/model-runs/${selectedModel.name}`);
        console.log('Model runs fetched:', response.data);

        if (response.data && response.data.length > 0) {
          // Get the most recent run (assuming runs are sorted by date, get the first one)
          const mostRecentRun = response.data[0];
          setRunId(mostRecentRun.run_id);
          console.log('Most recent run ID:', mostRecentRun.run_id);
        }
      } catch (error) {
        console.error('Error fetching model runs:', error);
      }
    };

    fetchModelRuns();
  }, [inst_id, selectedModel]);

  // Get top features when we have run_id
  useEffect(() => {
    const fetchTopFeatures = async () => {
      if (!inst_id || !run_id) return;

      const apiUrl = `/top-features/${run_id}`;
      console.log('Fetching top features from:', apiUrl);
      console.log('Full URL:', window.location.origin + apiUrl);

      try {
        const response = await axios.get(apiUrl);

        // Remove duplicates based on feature_readable_name, keeping only the first occurrence
        const uniqueFeatures = response.data.filter(
          (feature, index, self) =>
            index ===
            self.findIndex(
              f => f.feature_readable_name === feature.feature_readable_name,
            ),
        );

        setFeatures(uniqueFeatures);
        console.log('Raw features:', response.data);
        console.log('Top features fetched (deduplicated):', uniqueFeatures);
        console.log(
          'Original count:',
          response.data.length,
          'Deduplicated count:',
          uniqueFeatures.length,
        );
      } catch (error) {
        console.error('Error fetching top features:', error);
        console.error('Error response:', error.response?.data);
        // Set empty array as fallback
        setFeatures([]);
      }
    };

    fetchTopFeatures();
  }, [inst_id, run_id]);

  // Filter and sort features based on search term and sort settings
  const filteredAndSortedFeatures = features
    .filter(
      feature =>
        feature.feature_readable_name
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        feature.feature_short_desc
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        feature.feature_long_desc
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
        <div className="mb-6 flex items-center justify-center">
          <h1 className="text-5xl font-light">Data Dictionary</h1>
        </div>

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
            <h2 className="mb-4 text-3xl font-light">
              Original Feature
              <br />
              Value Table
            </h2>
            <div className="flex gap-8">
              {/* Left Side - Description and Search */}
              <div className="w-1/4">
                <div className="mb-4">
                  <p className="text-base font-light">
                    The chart shows how all features are weighed in the model.
                  </p>
                </div>
              </div>

              {/* Right Side - Table */}
              <div className="-mt-12 w-3/4 overflow-x-auto">
                {/* Search Bar */}
                <div className="relative float-right w-64 pb-4">
                  <input
                    type="text"
                    placeholder="Search"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full rounded-full border border-[#e5e7eb] px-4 py-2 pr-10 focus:border-[#007C8C] focus:outline-none"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <svg
                      className="mb-4 h-5 w-5 text-gray-400"
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
                <table className="w-full border-collapse border border-[#e5e7eb]">
                  <thead>
                    <tr className="bg-[#f9fafb]">
                      <th
                        className="cursor-pointer border border-[#e5e7eb] p-3 text-left text-xs font-medium text-[#6B7280]"
                        onClick={() => handleSort('feature_readable_name')}
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
                        key={feature.feature_readable_name}
                        className="border-b border-[#E5E7EB] align-top last:border-b-0"
                      >
                        <td className="border border-[#e5e7eb] py-3 pl-4 pr-4">
                          <div className="text-base font-medium text-black">
                            {feature.feature_readable_name}
                          </div>
                        </td>
                        <td className="border border-[#e5e7eb] py-3 pl-4 pr-4">
                          <div className="text-base font-light text-[#696969]">
                            {feature.feature_long_desc}
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
      </div>
    </AppLayout>
  );
}
