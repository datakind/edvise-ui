import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

export default function FeatureValue({ model_run_id }) {
  const [featureData, setFeatureData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch feature importance data when model_run_id is available
  useEffect(() => {
    const fetchFeatureImportance = async () => {
      if (!model_run_id) return;

      setLoading(true);
      setError(null);

      try {
        // Get the current user's institution ID
        const instResponse = await axios.get('/user-current-inst-api');
        if (instResponse.data && instResponse.data.length > 0) {
          const inst_id = instResponse.data[0];

          // Fetch feature importance data
          const response = await axios.get(
            `/institutions/${inst_id}/training/feature_importance/${model_run_id}`,
          );

          if (response.data) {
            setFeatureData(response.data);
          }
        }
      } catch (error) {
        console.error('Error fetching feature importance data:', error);
        console.error('Error details:', {
          message: error.message,
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          url: error.config?.url,
        });
        setError(
          `Failed to load feature importance data: ${error.response?.status || error.message}`,
        );
      } finally {
        setLoading(false);
      }
    };

    fetchFeatureImportance();
  }, [model_run_id]);

  // Show loading state
  if (loading) {
    return (
      <div className="mb-8 rounded-2xl bg-white p-6 shadow">
        <div className="flex items-center justify-center py-8">
          <div className="text-lg text-gray-600">
            Loading feature importance data...
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="mb-8 rounded-2xl bg-white p-6 shadow">
        <div className="flex items-center justify-center py-8">
          <div className="text-lg text-red-600">{error}</div>
        </div>
      </div>
    );
  }

  // Show empty state if no data
  if (!featureData || featureData.length === 0) {
    return (
      <div className="mb-8 rounded-2xl bg-white p-6 shadow">
        <div className="flex items-center justify-center py-8">
          <div className="text-lg text-gray-600">
            No feature importance data available
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8 rounded-2xl bg-white p-6 shadow">
      <div className="flex flex-col gap-8 md:flex-row">
        {/* Left column: heading and description */}
        <div className="mb-4 w-full md:mb-0 md:w-1/4">
          <h2 className="mb-2 text-2xl font-light">
            Original Feature Value Table
          </h2>
          <div className="mb-4 text-base text-black">
            The following chart shows how all features are weighted in the
            model.
          </div>
        </div>
        {/* Right column: table */}
        <div className="w-full overflow-x-auto rounded-3xl border border-gray-200 shadow-sm md:w-3/4">
          <div className="max-h-96 overflow-y-auto">
            <table className="w-full rounded-3xl text-left">
              <thead className="sticky top-0 z-10 bg-[#F9FAFB]">
                <tr className="rounded-t-3xl border-b border-b-black bg-[#F9FAFB]">
                  <th
                    scope="col"
                    className="pb-2 pl-6 pt-6 text-xs font-medium text-[#6B7280]"
                  >
                    FEATURE NAME
                  </th>
                  <th
                    scope="col"
                    className="pb-2 pr-6 pt-6 text-center text-xs font-medium text-[#6B7280]"
                  >
                    DATA TYPE
                  </th>
                  <th
                    scope="col"
                    className="pb-2 pr-6 pt-6 text-left text-xs font-medium text-[#6B7280]"
                  >
                    OVERALL FEATURE IMPORTANCE
                  </th>
                </tr>
              </thead>
              <tbody>
                {featureData
                  .sort((a, b) => {
                    // Handle values with '<' - put them at the bottom
                    const aHasLessThan = a.average_shap_magnitude.includes('<');
                    const bHasLessThan = b.average_shap_magnitude.includes('<');

                    if (aHasLessThan && !bHasLessThan) return 1;
                    if (!aHasLessThan && bHasLessThan) return -1;
                    if (aHasLessThan && bHasLessThan) return 0;

                    // Sort by numeric value in descending order
                    const aValue = parseFloat(a.average_shap_magnitude);
                    const bValue = parseFloat(b.average_shap_magnitude);
                    return bValue - aValue;
                  })
                  .map((feature, index) => (
                    <tr
                      key={index}
                      className="border-b border-[#E5E7EB] align-top last:border-b-0"
                    >
                      <td className="p-6 text-base font-normal text-black">
                        {feature.readable_feature_name.charAt(0).toUpperCase() +
                          feature.readable_feature_name.slice(1)}
                        <div className="text-sm font-light text-[#696969]">
                          {feature.short_feature_desc}
                        </div>
                      </td>
                      <td className="py-6 pr-6 text-center text-sm text-black">
                        {feature.data_type}
                      </td>
                      <td className="py-6 pr-6 text-left text-sm text-black">
                        {feature.average_shap_magnitude === '<0.0000'
                          ? '<0.0000'
                          : parseFloat(feature.average_shap_magnitude)
                              .toFixed(6)
                              .replace(/\.?0+$/, '')}
                        <div className="text-xs text-[#696969]">
                          {/* Range not provided by API */}
                          SHAP magnitude value
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
  );
}

FeatureValue.propTypes = {
  model_run_id: PropTypes.string,
};
