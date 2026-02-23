import PropTypes from 'prop-types';

/**
 * General-purpose Card component with Figma-specified styling
 * - border-radius: 2.5rem
 * - background: #FFF
 * - box-shadow: 0 10px 20px 0 rgba(92, 115, 160, 0.07)
 * - padding: 2rem (p-8) by default
 *
 * @param {ReactNode} children - Card content
 * @param {string} className - Optional additional classes. Can override default padding if needed.
 * @param {string} title - Optional small title (18px) to display at the top of the card
 * @param {string} titleLarge - Optional large title (32px) to display at the top of the card
 * @param {string} description - Optional description text below the title
 */
export default function Card({ children, className = '', title, titleLarge, description }) {
  const baseTitleClasses = 'font-light font-[Helvetica Neue]';
  const smallTitleClasses = 'mb-4 text-lg text-[#171717] leading-[120%] overflow-hidden text-ellipsis whitespace-nowrap';
  const largeTitleClasses = 'mb-4 text-3xl text-black leading-[130%]';

  return (
    <div className={`rounded-[2.5rem] bg-white shadow-card p-6 ${className}`}>
      {titleLarge && <h3 className={`${baseTitleClasses} ${largeTitleClasses}`}>{titleLarge}</h3>}
      {title && <h3 className={`${baseTitleClasses} ${smallTitleClasses}`}>{title}</h3>}
      {description && <p className="mb-4 mt-2 text-sm font-light text-[#4F4F4F]">{description}</p>}
      {children}
    </div>
  );
}

Card.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  title: PropTypes.string,
  titleLarge: PropTypes.string,
  description: PropTypes.string,
};

