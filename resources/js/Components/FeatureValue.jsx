import React from 'react';

export default function FeatureValue({ features }) {
  const topFeatures = [
    {
      feature_name:
        'cumulative proportion of courses in program of study area term 1',
      data_type: 'Categorical',
      average_shap_magnitude: '0.0153',
    },
    {
      feature_name: 'year of enrollment at cohort institution',
      data_type: 'Categorical',
      average_shap_magnitude: '0.0143',
    },
    {
      feature_name: 'number of courses with failing or withdrawal grades',
      data_type: 'Categorical',
      average_shap_magnitude: '3.0E-4',
    },
    {
      feature_name: 'difference in credits earned from term 1 to term 2',
      data_type: 'Categorical',
      average_shap_magnitude: '2.0E-4',
    },
    {
      feature_name: 'has taken psychology 1001 ever',
      data_type: 'Categorical',
      average_shap_magnitude: '2.0E-4',
    },
    {
      feature_name: 'cumulative proportion of courses delivered by method H',
      data_type: 'Categorical',
      average_shap_magnitude: '0.0011',
    },
    {
      feature_name: 'difference in credits earned term 3 to term 4',
      data_type: 'Categorical',
      average_shap_magnitude: '8.0E-4',
    },
    {
      feature_name: 'number of courses in program of study area term 1',
      data_type: 'Categorical',
      average_shap_magnitude: '0.0014',
    },
    {
      feature_name: 'number of unique course subject areas',
      data_type: 'Categorical',
      average_shap_magnitude: '0.0011',
    },
    {
      feature_name: 'proportion of courses with grade W in term n-3',
      data_type: 'Categorical',
      average_shap_magnitude: '0.0011',
    },
    {
      feature_name: 'cumulative proportion of courses delivered by method o',
      data_type: 'Categorical',
      average_shap_magnitude: '0.0018',
    },
    {
      feature_name: 'difference in credits earned from previous term',
      data_type: 'Categorical',
      average_shap_magnitude: '0.0016',
    },
    {
      feature_name: 'difference in credits earned term 2 to term 3',
      data_type: 'Categorical',
      average_shap_magnitude: '0.0015',
    },
    {
      feature_name: 'student completion rate above sections average',
      data_type: 'Categorical',
      average_shap_magnitude: '<0.0000',
    },
    {
      feature_name: 'number of key general studies courses',
      data_type: 'Categorical',
      average_shap_magnitude: '5.0E-4',
    },
    {
      feature_name: 'number of courses difference term 2 to term 3',
      data_type: 'Categorical',
      average_shap_magnitude: '5.0E-4',
    },
    {
      feature_name: 'number of courses difference from previous term',
      data_type: 'Categorical',
      average_shap_magnitude: '4.0E-4',
    },
    {
      feature_name: 'standard deviation of course levels',
      data_type: 'Categorical',
      average_shap_magnitude: '4.0E-4',
    },
    {
      feature_name: 'has taken communication studies 1010 ever',
      data_type: 'Categorical',
      average_shap_magnitude: '3.0E-4',
    },
    {
      feature_name: 'cumulative count of terms during peak COVID',
      data_type: 'Categorical',
      average_shap_magnitude: '3.0E-4',
    },
    {
      feature_name:
        'standard deviation of number of students enrolled per section',
      data_type: 'Categorical',
      average_shap_magnitude: '0.0173',
    },
    {
      feature_name: 'has taken mathematical science 1080 ever',
      data_type: 'Categorical',
      average_shap_magnitude: '1.0E-4',
    },
    {
      feature_name: 'has taken philosophy 1010 ever',
      data_type: 'Categorical',
      average_shap_magnitude: '1.0E-4',
    },
    {
      feature_name: 'proportion of courses with grade F in term n-2',
      data_type: 'Categorical',
      average_shap_magnitude: '1.0E-4',
    },
    {
      feature_name: 'number of courses difference term 3 to term 4',
      data_type: 'Categorical',
      average_shap_magnitude: '2.0E-4',
    },
    {
      feature_name: 'proportion of courses delivered by method H',
      data_type: 'Categorical',
      average_shap_magnitude: '1.0E-4',
    },
    {
      feature_name: 'proportion of courses at level 1',
      data_type: 'Categorical',
      average_shap_magnitude: '1.0E-4',
    },
    {
      feature_name: 'cumulative proportion of fall/spring terms unenrolled',
      data_type: 'Categorical',
      average_shap_magnitude: '0.0067',
    },
    {
      feature_name: 'proportion of courses with grade F in term n-3',
      data_type: 'Categorical',
      average_shap_magnitude: '<0.0000',
    },
    {
      feature_name: 'has taken history 1210 ever',
      data_type: 'Categorical',
      average_shap_magnitude: '<0.0000',
    },
    {
      feature_name: 'term during peak COVID',
      data_type: 'Categorical',
      average_shap_magnitude: '<0.0000',
    },
    {
      feature_name: 'number of courses difference term 1 to term 2',
      data_type: 'Categorical',
      average_shap_magnitude: '<0.0000',
    },
    {
      feature_name: 'cumulative number of repeated courses',
      data_type: 'Categorical',
      average_shap_magnitude: '0.0026',
    },
    {
      feature_name: 'has taken mathematical science 1210 ever',
      data_type: 'Categorical',
      average_shap_magnitude: '0.0026',
    },
    {
      feature_name: 'proportion of courses with grade F in term n-1',
      data_type: 'Categorical',
      average_shap_magnitude: '0.0024',
    },
    {
      feature_name: 'proportion of courses at level 2',
      data_type: 'Categorical',
      average_shap_magnitude: '0.0053',
    },
    {
      feature_name: 'proportion of credits earned',
      data_type: 'Categorical',
      average_shap_magnitude: '0.005',
    },
    {
      feature_name: 'enrollment type',
      data_type: 'Categorical',
      average_shap_magnitude: '0.0085',
    },
    {
      feature_name: 'proportion of courses delivered by method F',
      data_type: 'Categorical',
      average_shap_magnitude: '0.0085',
    },
    {
      feature_name: 'number of courses in program of study area year 1',
      data_type: 'Categorical',
      average_shap_magnitude: '0.0068',
    },
    {
      feature_name: 'has taken biology 1080 ever',
      data_type: 'Categorical',
      average_shap_magnitude: '1.0E-4',
    },
    {
      feature_name: 'has taken philosophy 1030 ever',
      data_type: 'Categorical',
      average_shap_magnitude: '1.0E-4',
    },
    {
      feature_name: 'proportion of courses with grade W in term n-1',
      data_type: 'Categorical',
      average_shap_magnitude: '6.0E-4',
    },
    {
      feature_name: 'proportion of students who passed per section',
      data_type: 'Categorical',
      average_shap_magnitude: '0.0049',
    },
    {
      feature_name: 'cumulative minimum credits earned',
      data_type: 'Categorical',
      average_shap_magnitude: '0.0046',
    },
    {
      feature_name: 'student enrollment intensity this term',
      data_type: 'Categorical',
      average_shap_magnitude: '0.0041',
    },
    {
      feature_name: 'enrollment intensity in first term',
      data_type: 'Categorical',
      average_shap_magnitude: '0.0037',
    },
    {
      feature_name: 'student program of study area term 1',
      data_type: 'Categorical',
      average_shap_magnitude: '0.0033',
    },
    {
      feature_name: 'mean number of students enrolled per section',
      data_type: 'Categorical',
      average_shap_magnitude: '0.0028',
    },
    {
      feature_name: 'has taken history 1030 ever',
      data_type: 'Categorical',
      average_shap_magnitude: '<0.0000',
    },
    {
      feature_name: 'has taken english 1010 ever',
      data_type: 'Categorical',
      average_shap_magnitude: '0.0669',
    },
    {
      feature_name: 'cumulative proportion of courses at level 4',
      data_type: 'Categorical',
      average_shap_magnitude: '0.0547',
    },
    {
      feature_name: 'cumulative credits earned',
      data_type: 'Categorical',
      average_shap_magnitude: '0.0437',
    },
    {
      feature_name: 'proportion of courses at level 4',
      data_type: 'Categorical',
      average_shap_magnitude: '0.0326',
    },
    {
      feature_name: 'has taken english 1020 ever',
      data_type: 'Categorical',
      average_shap_magnitude: '0.0262',
    },
    {
      feature_name: 'academic term',
      data_type: 'Categorical',
      average_shap_magnitude: '0.0181',
    },
  ];

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
          <table className="w-full rounded-3xl text-left">
            <thead>
              <tr className="rounded-t-3xl border-b border-b-black bg-[#F9FAFB]">
                <th
                  scope="col"
                  className="pb-2 pl-6 pt-6 text-xs font-medium text-[#6B7280]"
                >
                  FEATURE NAME
                </th>
                <th
                  scope="col"
                  className="pb-2 pt-6 text-center text-xs font-medium text-[#6B7280]"
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
              {features.map(f => (
                <tr
                  key={f.name}
                  className="border-b border-[#E5E7EB] align-top last:border-b-0"
                >
                  <td className="p-6 text-base font-normal text-black">
                    {f.name}
                    <div className="text-sm font-light text-[#696969]">
                      {f.desc}
                    </div>
                  </td>
                  <td className="py-6 pr-2 text-center text-sm text-black">
                    {f.type}
                  </td>
                  <td className="py-6 pr-2 text-left text-sm text-black">
                    {f.importance}
                    <div className="text-xs text-[#696969]">
                      Range is {f.range}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
