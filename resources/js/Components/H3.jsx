import PropTypes from 'prop-types';

/**
 * Reusable H3 component matching the design system
 * Styles: text-lg, font-medium, text-heading
 *
 * @param {ReactNode} children - The heading text
 * @param {string} className - Optional additional classes
 */
export default function H3({ children, className = '' }) {
    return (
        <h3 className={`text-lg font-medium text-heading ${className}`}>
            {children}
        </h3>
    );
}

H3.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
};

