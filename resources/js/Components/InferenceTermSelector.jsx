import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Spinner from '@/Components/Spinner';

const requestKeyFor = (batchName, modelName) =>
  `${batchName ?? ''}\0${modelName ?? ''}`;

const studentCountLabel = count =>
  count === 1 ? '1 student' : `${count} students`;

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
  const nextKey = requestKeyFor(batchName, modelName);
  const [requestKey, setRequestKey] = useState(nextKey);
  const onSelectedTermsChangeRef = useRef(onSelectedTermsChange);
  const onReadyChangeRef = useRef(onReadyChange);
  onSelectedTermsChangeRef.current = onSelectedTermsChange;
  onReadyChangeRef.current = onReadyChange;

  if (requestKey !== nextKey) {
    setRequestKey(nextKey);
    setTerms([]);
    setReason(null);
    setLoading(Boolean(batchName && modelName));
  }

  const waitingForThisRequest = loading || requestKey !== nextKey;

  useEffect(() => {
    onSelectedTermsChangeRef.current([]);
    onReadyChangeRef.current(false);
    if (!batchName || !modelName) {
      return undefined;
    }

    let cancelled = false;
    setLoading(true);
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
      })
      .catch(() => {
        if (cancelled) return;
        setTerms([]);
        setReason('Could not load academic terms.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [batchName, modelName]);

  useEffect(() => {
    if (waitingForThisRequest) {
      onReadyChangeRef.current(false);
      return;
    }
    const available = new Set(terms.map(term => term.term_label));
    onReadyChangeRef.current(
      selectedTerms.some(label => available.has(label)),
    );
  }, [waitingForThisRequest, terms, selectedTerms]);

  if (!batchName || !modelName) {
    return null;
  }

  if (waitingForThisRequest) {
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
                  ({studentCountLabel(term.valid_student_count)})
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
