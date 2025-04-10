import classNames from 'classnames';

const Button = ({
  href,
  children,
  className = '',
  type = 'button',
  ...rest
}) => {
  const baseStyles =
    'group relative h-[38px] inline-block overflow-hidden px-6 py-[6px] rounded-full bg-white font-regular transition cursor-pointer text-center z-0';

  const combinedClassName = `${baseStyles} ${className}`.trim();

  const Tag = href ? 'a' : 'button';

  const specificProps = href ? { href } : { type };

  return (
    <Tag className={combinedClassName} {...specificProps} {...rest}>
      <span
        className="absolute inset-y-0 left-0 w-0 bg-landing-orange rounded-full transition-all duration-300 ease-in-out group-hover:w-full -z-10"
        aria-hidden="true"
      ></span>
      <span className="relative z-10 duration-300 ease-in-out">{children}</span>
    </Tag>
  );
};

export default Button;
