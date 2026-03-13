import React, { useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import PropTypes from 'prop-types';
import AppLayout from '@/Layouts/AppLayout';
import PageHeading from '@/Components/PageHeading';

import { toTitleCase } from '../utils/stringUtils';
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from '@headlessui/react';

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
            <TabGroup className="app-tabs">
              <TabList>
                <Tab>Output Data Format</Tab>
                <Tab>Original Feature Value Table</Tab>
                <Tab>Data Science Terminology</Tab>
              </TabList>
              <hr />
              {/* Original Feature Value Table Section */}
              <TabPanels>
                <TabPanel>
                  <div className="mb-4 text-base font-light">
                    <p>
                      The model results output file is a CSV, with each row
                      representing a student and providing insights into support
                      needs and contributing features. The file contains the
                      following columns:
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
                                Closer to 0 means the student likely needs very
                                little support
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
                            A binary indicator of whether or not a student is in
                            need of support
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
                            There are five columns that provide the top 5
                            features impacting the support score for each
                            student, in order of decreasing importance for the
                            student (the most important feature is at the top).
                          </td>
                          <td className="border border-[#e5e7eb] p-3 text-base font-light">
                            The values will be strings describing the features.
                            For a more detailed understanding of each feature,
                            please see &ldquo;about this model.&rdquo;
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
                            feature: some are categorical (i.e. major) and some
                            are numerical (i.e. GPA).
                          </td>
                        </tr>
                        <tr className="border-b border-[#e5e7eb]">
                          <td className="whitespace-nowrap border border-[#e5e7eb] p-3 text-base font-medium">
                            Feature Importance (1-5)
                          </td>
                          <td className="border border-[#e5e7eb] p-3 text-base font-light">
                            The degree to which this particular feature impacts
                            the student&apos;s support score. Statistically,
                            this is the feature&apos;s SHAP value for the
                            student. In interpreting it, simply compare this
                            number to other feature importance values to
                            understand the relative impact.
                          </td>
                          <td className="border border-[#e5e7eb] p-3 text-base font-light">
                            This will be a positive or negative decimal:
                            <ul className="list-disc pl-5">
                              <li>
                                A positive value indicates that the feature
                                being higher increases the student&apos;s
                                support score
                              </li>
                              <li>
                                A negative value indicates that this feature
                                being higher decreases the student&apos;s
                                support score
                              </li>
                            </ul>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <p className="text-base font-light">
                    This chart provides more context on all features utilized by
                    the model.
                  </p>
                </TabPanel>
                <TabPanel>
                  <div className="relative ml-4 w-64">
                    <input
                      type="text"
                      placeholder="Search"
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
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
                </TabPanel>
                <TabPanel>
                  <div className="space-y-8 text-base font-light">
                    <section>
                      <h3 className="mb-3 text-xl font-medium">
                        Statistical and Data Processing terms
                      </h3>
                      <dl className="space-y-2">
                        <div>
                          <dt className="font-medium">Null values</dt>
                          <dd>Empty or missing data entries in a dataset.</dd>
                        </div>
                        <div>
                          <dt className="font-medium">Duplicate values</dt>
                          <dd>Repeated records of the same data point.</dd>
                        </div>
                        <div>
                          <dt className="font-medium">Variance</dt>
                          <dd>
                            A measure of how spread out values are from the
                            average.
                          </dd>
                        </div>
                        <div>
                          <dt className="font-medium">
                            Collinearity / Multicollinearity
                          </dt>
                          <dd>
                            When two or more features (variables) in a dataset
                            are strongly related, which can confuse a model.
                          </dd>
                        </div>
                        <div>
                          <dt className="font-medium">
                            Variance Inflation Factor (VIF)
                          </dt>
                          <dd>
                            A number that tells how much multicollinearity
                            exists among features; higher values mean more
                            redundancy.
                          </dd>
                        </div>
                        <div>
                          <dt className="font-medium">
                            Low variance threshold
                          </dt>
                          <dd>
                            A cutoff used to remove variables that don’t vary
                            much and therefore add little useful information.
                          </dd>
                        </div>
                        <div>
                          <dt className="font-medium">
                            Missing data threshold
                          </dt>
                          <dd>
                            A rule for deciding when too much data is missing
                            for a variable to be reliable.
                          </dd>
                        </div>
                        <div>
                          <dt className="font-medium">Sample weights</dt>
                          <dd>
                            A way of giving more or less importance to certain
                            examples during model training.
                          </dd>
                        </div>
                      </dl>
                    </section>
                    <section>
                      <h3 className="mb-3 text-xl font-medium">
                        Machine Learning and Modeling Terms
                      </h3>
                      <dl className="space-y-2">
                        <div>
                          <dt className="font-medium">Feature engineering</dt>
                          <dd>
                            Turning raw data into meaningful inputs (“features”)
                            that the model can learn from.
                          </dd>
                        </div>
                        <div>
                          <dt className="font-medium">Feature selection</dt>
                          <dd>
                            Choosing the most useful features and removing
                            redundant or irrelevant ones.
                          </dd>
                        </div>
                        <div>
                          <dt className="font-medium">
                            Model pipeline / MLOps
                          </dt>
                          <dd>
                            The process and infrastructure for managing how data
                            is processed, models are trained, and results are
                            deployed.
                          </dd>
                        </div>
                        <div>
                          <dt className="font-medium">
                            AutoML (Automated Machine Learning)
                          </dt>
                          <dd>
                            Software that automatically tests and tunes many
                            machine learning models to find the best one.
                          </dd>
                        </div>
                        <div>
                          <dt className="font-medium">
                            Model interpretability
                          </dt>
                          <dd>
                            How easily a person can understand how and why the
                            model made a certain prediction.
                          </dd>
                        </div>
                        <div>
                          <dt className="font-medium">
                            SHAP (Shapley Additive Explanations)
                          </dt>
                          <dd>
                            A method for explaining a model’s predictions by
                            showing how much each feature contributed to a
                            particular prediction.
                          </dd>
                        </div>
                        <div>
                          <dt className="font-medium">
                            Feature importance plot
                          </dt>
                          <dd>
                            A visual showing which features influenced
                            predictions the most.
                          </dd>
                        </div>
                      </dl>
                    </section>
                    <section>
                      <h3 className="mb-3 text-xl font-medium">
                        Model Evaluation Metrics
                      </h3>
                      <dl className="space-y-2">
                        <div>
                          <dt className="font-medium">Accuracy</dt>
                          <dd>
                            The percentage of predictions the model got right.
                          </dd>
                        </div>
                        <div>
                          <dt className="font-medium">Precision</dt>
                          <dd>
                            Of the cases the model predicted as “at-risk,” how
                            many were actually at-risk.
                          </dd>
                        </div>
                        <div>
                          <dt className="font-medium">Recall</dt>
                          <dd>
                            Of all the truly at-risk students, how many the
                            model correctly identified.
                          </dd>
                        </div>
                        <div>
                          <dt className="font-medium">F1 Score</dt>
                          <dd>A balance between precision and recall.</dd>
                        </div>
                        <div>
                          <dt className="font-medium">
                            AUC (Area Under the Curve)
                          </dt>
                          <dd>
                            Measures how well the model distinguishes between
                            positive and negative cases; closer to 1 is better.
                          </dd>
                        </div>
                        <div>
                          <dt className="font-medium">Log Loss</dt>
                          <dd>
                            A measure of how accurate the model’s probability
                            predictions are (lower is better).
                          </dd>
                        </div>
                        <div>
                          <dt className="font-medium">Confusion matrix</dt>
                          <dd>
                            A table showing how often the model’s predictions
                            matched or mismatched the true outcomes.
                          </dd>
                        </div>
                        <div>
                          <dt className="font-medium">Calibration curve</dt>
                          <dd>
                            A plot showing how well the predicted probabilities
                            match real-world outcomes.
                          </dd>
                        </div>
                      </dl>
                    </section>
                    <section>
                      <h3 className="mb-3 text-xl font-medium">Bias Terms</h3>
                      <dl className="space-y-2">
                        <div>
                          <dt className="font-medium">
                            False Negative Rate (FNR)
                          </dt>
                          <dd>
                            The proportion of true positive cases that the model
                            missed (predicted as negative).
                          </dd>
                        </div>
                        <div>
                          <dt className="font-medium">
                            False Negative Rate Parity (FNR Parity)
                          </dt>
                          <dd>
                            Checking whether the false negative rate is similar
                            across different groups (e.g., gender, race).
                          </dd>
                        </div>
                        <div>
                          <dt className="font-medium">
                            Statistical significance
                          </dt>
                          <dd>
                            Whether differences in model results are likely to
                            be real or just due to random chance.
                          </dd>
                        </div>
                        <div>
                          <dt className="font-medium">
                            Confidence interval (CI)
                          </dt>
                          <dd>
                            A range showing the uncertainty of a metric (e.g.,
                            “we’re 95% confident the true value is between these
                            two numbers”).
                          </dd>
                        </div>
                      </dl>
                    </section>
                    <section>
                      <h3 className="mb-3 text-xl font-medium">
                        Education Specific/Domain Terms
                      </h3>
                      <dl className="space-y-2">
                        <div>
                          <dt className="font-medium">Program of study area</dt>
                          <dd>The student’s academic discipline or field.</dd>
                        </div>
                        <div>
                          <dt className="font-medium">Enrollment intensity</dt>
                          <dd>
                            Whether the student is studying full-time or
                            part-time.
                          </dd>
                        </div>
                        <div>
                          <dt className="font-medium">
                            &ldquo;Peak COVID&rdquo; term
                          </dt>
                          <dd>
                            The academic terms that occurred during the height
                            of the COVID-19 pandemic.
                          </dd>
                        </div>
                        <div>
                          <dt className="font-medium">Pell Grant recipient</dt>
                          <dd>
                            A student receiving a U.S. federal grant for
                            low-income students.
                          </dd>
                        </div>
                        <div>
                          <dt className="font-medium">
                            Term-over-term comparisons
                          </dt>
                          <dd>
                            Measuring how metrics change between academic terms
                            (e.g., between fall and spring semesters).
                          </dd>
                        </div>
                      </dl>
                    </section>
                  </div>
                </TabPanel>
              </TabPanels>
            </TabGroup>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

DataDictionary.propTypes = {
  features: PropTypes.arrayOf(PropTypes.object),
};
