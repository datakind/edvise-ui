import PropTypes from 'prop-types';

export default function StatCard({ value, label, className = '' }) {
  return (
    <div
      className={`rounded-3xl bg-[#E6EEF5] px-6 py-8 text-center shadow-sm ${className}`}
    >
      <div className="font-merriweather font-semibold text-4xl text-[#1E343F] md:text-5xl">
        {value}
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
