import classNames from 'classnames';

const Button = ({
                    href,
                    children,
                    className = '',
                    type = 'button',
                    kind = 'primary',
                    disabled = false,
                    ...rest
                }) => {
    const baseStyles =
        'whitespace-nowrap group relative h-[38px] inline-block overflow-hidden px-5 sm:px-6 py-[6px] rounded-full font-regular transition text-center z-0 no-underline text-black';

    const primaryStyles = 'bg-primary hover:bg-primary/70';
    const secondaryStyles = 'bg-white';
    const darkStyles = 'bg-black text-white hover:bg-white hover:text-black';

    const kindStyles = {
        primary: primaryStyles,
        secondary: secondaryStyles,
        dark: darkStyles,
    };

    const disabledStyles = disabled
        ? 'opacity-50 cursor-not-allowed pointer-events-none hover:bg-primary' // pointer-events-none disables clicks
        : 'cursor-pointer';

    const combinedClassName = classNames(
        baseStyles,
        kindStyles[kind],
        disabledStyles,
        className
    );

    const Tag = href ? 'a' : 'button';

    const specificProps = href
        ? { href, 'aria-disabled': disabled ? true : undefined }
        : { type, disabled };

    return (
        <Tag className={combinedClassName} {...specificProps} {...rest}>
            {kind === 'secondary' && (
                <span
                    className="absolute inset-y-0 left-0 -z-10 w-0 rounded-full bg-primary transition-all duration-300 ease-in-out group-hover:w-full"
                    aria-hidden="true"
                />
            )}
            <span className="relative top-[0.125em] z-10 duration-300 ease-in-out">
        {children}
      </span>
        </Tag>
    );
};

export default Button;
