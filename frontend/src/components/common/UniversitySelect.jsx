import React, { useEffect, useState } from 'react';
import universityService from '../../services/universityService';

const CUSTOM_UNIVERSITY = '__custom_university__';

export const UniversitySelect = ({ value, onChange, required = false }) => {
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [customSelected, setCustomSelected] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setLoadError('');

    universityService.getPakistaniUniversities(controller.signal)
      .then(setUniversities)
      .catch((error) => {
        if (error.name !== 'AbortError') {
          setLoadError('Could not load the Pakistan university directory. You can enter your university name below.');
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [retryCount]);

  const isListedUniversity = universities.includes(value);
  const showCustomInput = customSelected || (value !== '' && !isListedUniversity && !loading);
  const selectValue = isListedUniversity
    ? value
    : showCustomInput
      ? CUSTOM_UNIVERSITY
      : value && loading
        ? value
        : '';

  return (
    <div className="space-y-1.5">
      <select
        value={selectValue}
        onChange={(event) => {
          if (event.target.value === CUSTOM_UNIVERSITY) {
            setCustomSelected(true);
            onChange('');
          } else {
            setCustomSelected(false);
            onChange(event.target.value);
          }
        }}
        className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-slate-800 focus:outline-none focus:border-gold focus:bg-white"
        required={required && !showCustomInput}
        aria-label="University"
      >
        <option value="">
          {loading ? 'Loading universities...' : 'Select your university'}
        </option>
        {value && loading && <option value={value}>{value}</option>}
        {universities.map((university) => (
          <option key={university} value={university}>{university}</option>
        ))}
        <option value={CUSTOM_UNIVERSITY}>My university is not listed</option>
      </select>

      {showCustomInput && (
        <input
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Enter your university name"
          className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-slate-800 focus:outline-none focus:border-gold focus:bg-white"
          required={required}
          aria-label="Enter university name"
        />
      )}

      {loading && <p className="text-[10px] text-slate-500">Loading Pakistan university directory…</p>}
      {loadError && (
        <div role="status" className="text-[10px] text-amber-700">
          <p>{loadError}</p>
          <button
            type="button"
            onClick={() => setRetryCount((count) => count + 1)}
            className="font-semibold underline mt-1"
          >
            Retry loading universities
          </button>
        </div>
      )}
    </div>
  );
};

export default UniversitySelect;
