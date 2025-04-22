import clx from 'classnames';
import Button from './Button';

export default function DemoForm({ className, formId }) {
  const renderInputText = (
    label,
    id,
    name,
    errorMessage,
    className = '',
    required = false,
  ) => {
    const inputId = `${formId}-${id}`;
    return (
      <div
        className={clx(
          'relative flex flex-col gap-3 pb-2 text-base leading-none',
          className,
        )}
      >
        <label
          htmlFor={inputId}
          className="ml-5 block text-sm font-medium text-gray-700"
        >
          {label}
          {required && <span className="text-current"> *</span>}
        </label>
        <input
          type="text"
          id={inputId}
          name={name}
          className="invalid-d:border-[#F52020] peer block h-12 w-full rounded-full border-[#949494] pl-4 focus:border-[#F79122] focus:ring-[#F79122]"
          required={required}
        />
        {/* {errorMessage && (
          <p className="absolute left-4 top-[calc(100%_-_4px)] text-[#F52020] opacity-0 peer-invalid:opacity-100">
            {errorMessage}
          </p>
        )} */}
      </div>
    );
  };

  const renderCheckbox = (id, name, text, value) => {
    const inputId = `${formId}-${id}`;
    return (
      <div className="flex items-center">
        <label
          htmlFor={inputId}
          className="landing-checkbox group flex cursor-pointer items-center text-gray-600"
        >
          <input
            type="checkbox"
            id={inputId}
            name={name}
            value={value}
            className="peer sr-only"
          />
          <span className="checkmark block flex h-6 w-6 items-center justify-center rounded-[4px] border-2 border-[#949494]">
            <svg
              width="14"
              height="11"
              viewBox="0 0 14 11"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-[12px] opacity-0 group-[.checked]:opacity-100"
            >
              <title>Checkmark</title>
              <path
                d="M1.5 5.5L5.1001 9.1501L12.9001 1.3501"
                stroke="black"
                strokeWidth="2"
              />
            </svg>
          </span>
          <span className="ml-3">{text}</span>
        </label>
      </div>
    );
  };

  return (
    <form className={clx(className, 'space-y-6')}>
      {renderInputText(
        'Name',
        'name',
        'name',
        'Please input your name',
        '',
        true,
      )}

      <div className="ml-5">
        <label
          className="mb-4 block text-sm font-medium text-gray-700"
          htmlFor="focus-options"
        >
          Your focus
        </label>
        <div className="mt-2 space-y-4" id="focus-options">
          {renderCheckbox('request-demo', 'focus', 'Request a demo')}
          {renderCheckbox('learn-product', 'focus', 'Learn about the product')}
          {renderCheckbox(
            'talk-representative',
            'focus',
            'Talk to a representative',
          )}
        </div>
      </div>

      {renderInputText(
        'Email',
        'email',
        'email',
        'Please input your email so we can reach to you',
        '',
        true,
      )}
      {renderInputText(
        'Institution',
        'institution',
        'institution',
        'Please input the institution you represent',
        '',
        true,
      )}

      <div className="pt-4">
        <Button type="submit">Submit request</Button>
      </div>

      <p className="mt-4 text-base">
        We will reach out to you via email within 1 business to schedule a time
      </p>

      <p className="text-sm text-[#4F4F4F]">
        <a href="/privacy-policy" className="text-[#4F4F4F] underline">
          Privacy policy
        </a>{' '}
        of how we handle your data
      </p>
    </form>
  );
}
