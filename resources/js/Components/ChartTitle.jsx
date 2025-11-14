import PropTypes from 'prop-types';

/**
 * ChartTitle component with two variants:
 * - 'large': 32px, font-light, text-black, leading-130% (for main chart titles)
 * - 'small': 18px, font-light, text-[#171717], leading-120%, with text ellipsis (for secondary chart titles)
 *
 * @param {ReactNode} children - The title text
 * @param {string} variant - 'large' or 'small' (default: 'large')
 * @param {string} className - Optional additional classes
 */
export default function ChartTitle({ children, variant = 'large', className = '' }) {
    const baseClasses = 'font-light font-[Helvetica Neue]';
    
    const variantClasses = {
        large: 'text-3xl text-black leading-[130%]',
        small: 'text-lg text-[#171717] leading-[120%] overflow-hidden text-ellipsis whitespace-nowrap',
    };
    
    return (
        <h3 className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
            {children}
        </h3>
    );
}

ChartTitle.propTypes = {
    children: PropTypes.node.isRequired,
    variant: PropTypes.oneOf(['large', 'small']),
    className: PropTypes.string,
};

