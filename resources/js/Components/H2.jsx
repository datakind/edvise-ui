import PropTypes from 'prop-types';

/**
 * Reusable H2 component matching the design system
 * Styles: text-2xl, font-light, text-heading
 *
 * @param {ReactNode} children - The heading text
 * @param {string} className - Optional additional classes
 */
export default function H2({ children, className = '' }) {
    return (
        <h2 className={`text-2xl font-light text-heading ${className}`}>
            {children}
        </h2>
    );
}

H2.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
};

