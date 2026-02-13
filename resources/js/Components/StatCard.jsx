import PropTypes from 'prop-types';

export default function StatCard({ value, label, className = '' }) {
  // Format the value based on its type
  const formatValue = (val) => {
    if (typeof val === 'number') {
      // Check if it's a float (has decimal part) - format GPA to 2 decimals
      if (val % 1 !== 0) {
        return val.toFixed(2);
      }
      // Format integers with comma separators
      return val.toLocaleString();
    }
    // If it's already a string, return as-is (backward compatibility)
    return val;
  };

  return (
    <div
      className={`rounded-3xl bg-[#E6EEF5] px-6 py-8 text-center shadow-sm ${className}`}
    >
      <div className="font-merriweather font-semibold text-4xl text-[#1E343F] md:text-5xl">
        {formatValue(value)}
      </div>
      <div className="mt-2 text-base font-semibold uppercase tracking-wide text-[#1E343F]/80">
        {label}
      </div>
    </div>
  );
}

StatCard.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  label: PropTypes.string.isRequired,
  className: PropTypes.string,
};
