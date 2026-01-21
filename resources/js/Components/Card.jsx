import PropTypes from 'prop-types';

/**
 * General-purpose Card component with Figma-specified styling
 * - border-radius: 2.5rem
 * - background: #FFF
 * - box-shadow: 0 10px 20px 0 rgba(92, 115, 160, 0.07)
 * - padding: 2rem (p-8) by default
 *
 * @param {string} className - Optional additional classes. Can override default padding if needed.
 */
export default function Card({ children, className = '' }) {
  return (
    <div className={`rounded-[2.5rem] bg-white shadow-card p-6 ${className}`}>
      {children}
    </div>
  );
}

Card.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

