import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Spinner from '@/Components/Spinner';

export default function InferenceTermSelector({
  batchName,
  modelName,
  selectedTerms,
  onSelectedTermsChange,
  onReadyChange,
  showCounts = false,
  stepLabel = null,
}) {
  const [terms, setTerms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reason, setReason] = useState(null);

  useEffect(() => {
    if (!batchName || !modelName) {
      setTerms([]);
      setReason(null);
      setLoading(false);
      onSelectedTermsChange([]);
      onReadyChange(false);
      return undefined;
    }

    let cancelled = false;
    setLoading(true);
    onReadyChange(false);
    axios
      .get('/eligible-inference-terms', {
        params: { batch_name: batchName, model_name: modelName },
      })
      .then(res => {
        if (cancelled) return;
        const valid = res.data?.status === 'valid';
        const nextTerms = valid ? (res.data.terms ?? []) : [];
        setTerms(nextTerms);
        setReason(
          valid
            ? null
            : res.data?.reason ||
                'No academic terms have eligible students and usable course rows.',
        );
        onSelectedTermsChange([]);
      })
      .catch(() => {
        if (cancelled) return;
        setTerms([]);
        setReason('Could not load academic terms.');
        onSelectedTermsChange([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [batchName, modelName, onReadyChange, onSelectedTermsChange]);

  useEffect(() => {
    onReadyChange(!loading && terms.length > 0 && selectedTerms.length > 0);
  }, [loading, terms.length, selectedTerms, onReadyChange]);

  if (!batchName || !modelName) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex w-full justify-center py-3">
        <Spinner mainMsg="Loading academic terms"></Spinner>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="py-3 font-thin">
        {stepLabel ? (
          <>
            <span className="text-2xl">{stepLabel}</span>
            <br />
          </>
        ) : null}
        <span className="text-lg">
          Select at least one academic term with eligible students and usable
          course rows.
        </span>
      </div>
      {terms.length > 0 ? (
        <div className="grid grid-cols-2 gap-x-6 gap-y-2">
          {terms.map(term => (
            <label
              key={term.term_label}
              className="flex items-center gap-x-2 text-gray-700"
            >
              <input
                type="checkbox"
                name="academic_terms"
                value={term.term_label}
                checked={selectedTerms.includes(term.term_label)}
                onChange={event =>
                  onSelectedTermsChange(previous =>
                    event.target.checked
                      ? [...previous, term.term_label]
                      : previous.filter(label => label !== term.term_label),
                  )
                }
                className="rounded border-gray-300"
              />
              <span className="capitalize">{term.term_label}</span>
              {showCounts ? (
                <span className="text-sm text-gray-500">
                  ({term.valid_student_count} students)
                </span>
              ) : null}
            </label>
          ))}
        </div>
      ) : (
        reason && <div className="py-3 text-gray-700">{reason}</div>
      )}
    </div>
  );
}
