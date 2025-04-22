import classNames from 'classnames';

const Button = ({
  href,
  children,
  className = '',
  type = 'button',
  kind = 'primary',
  ...rest
}) => {
  const baseStyles =
    'group relative h-[38px] inline-block overflow-hidden px-6 py-[6px] rounded-full bg-white font-regular transition cursor-pointer text-center z-0 no-underline text-black';

  const primaryStyles = 'bg-landing-orange';
  const secondaryStyles = 'bg-white';

  const kindStyles = {
    primary: primaryStyles,
    secondary: secondaryStyles,
  };

  const combinedClassName =
    `${baseStyles} ${className} ${kindStyles[kind]}`.trim();

  const Tag = href ? 'a' : 'button';

  const specificProps = href ? { href } : { type };

  return (
    <Tag className={combinedClassName} {...specificProps} {...rest}>
      <span
        className="bg-landing-orange absolute inset-y-0 left-0 -z-10 w-0 rounded-full transition-all duration-300 ease-in-out group-hover:w-full"
        aria-hidden="true"
      ></span>
      <span className="relative z-10 duration-300 ease-in-out">{children}</span>
    </Tag>
  );
};

export default Button;
