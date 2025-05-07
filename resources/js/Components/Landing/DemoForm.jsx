import clx from 'classnames';
import Button from './Button';
import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import React from 'react';
import PropTypes from 'prop-types';
import { usePage } from '@inertiajs/react';

export default function DemoForm({ className, formId, onSuccess }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { flash = {}, ziggy = {} } = usePage().props;

  const form = useForm({
    name: '',
    email: '',
    institution: '',
    focus: [],
  });

  const handleSubmit = e => {
    e.preventDefault();
    setIsSubmitting(true);

    // Get all checked focus options
    const focusInputs = document.querySelectorAll(
      `input[name="focus"]:checked`,
    );
    const focusValues = Array.from(focusInputs).map(input => input.value);

    form.post(route('demo.request'), {
      data: {
        ...form.data,
        focus: focusValues,
      },
      onSuccess: () => {
        form.reset();
        // Reset checkboxes
        focusInputs.forEach(input => (input.checked = false));
        // Wait for 2 seconds to show the success message before closing
        setTimeout(() => {
          if (onSuccess) {
            onSuccess();
          }
        }, 1000);
      },
      onFinish: () => {
        setIsSubmitting(false);
      },
    });
  };

  const handleCheckboxChange = e => {
    const { value, checked } = e.target;
    const currentFocus = form.data.focus || [];

    if (checked) {
      form.setData('focus', [...currentFocus, value]);
    } else {
      form.setData(
        'focus',
        currentFocus.filter(item => item !== value),
      );
    }
  };

  const renderInputText = (
    label,
    id,
    name,
    errorMessage,
    placeholder = '',
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
          className="block text-sm font-medium text-black sm:ml-5"
        >
          {label}
          {required && <span className="text-current"> *</span>}
        </label>
        <input
          type="text"
          id={inputId}
          name={name}
          value={form.data[name]}
          onChange={e => form.setData(name, e.target.value)}
          className="invalid-d:border-[#F52020] peer block h-12 w-full rounded-full border-[#949494] pl-5 pt-[calc(8px_+_0.125em)] focus:border-[#F79122] focus:ring-[#F79122]"
          required={required}
          placeholder={placeholder}
        />
        {form.errors[name] && (
          <p className="absolute left-4 top-[calc(100%_-_4px)] text-[#F52020]">
            {form.errors[name]}
          </p>
        )}
      </div>
    );
  };

  const renderCheckbox = (id, name, text) => {
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
            value={text}
            onChange={handleCheckboxChange}
            checked={form.data.focus?.includes(text)}
            className="peer sr-only"
          />
          <span className="checkmark block flex h-6 w-6 items-center justify-center rounded-[4px] border-2 border-landing-gray">
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
    <form
      onSubmit={handleSubmit}
      className={clx(className, 'space-y-7 sm:space-y-6')}
    >
      {renderInputText(
        'Name',
        'name',
        'name',
        'Please input your name',
        'E.g. John Johnson',
        '',
        true,
      )}

      <div className="sm:ml-5">
        <label
          className="mb-4 block text-sm font-medium text-gray-700"
          htmlFor="focus-options"
        >
          Your interest
        </label>
        <div className="mt-2 space-y-4" id="focus-options">
          {renderCheckbox('learn-product', 'focus', 'Learn about the product')}
          {renderCheckbox('request-demo', 'focus', 'Request a demo')}
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
        'Your email',
        '',
        true,
      )}
      {renderInputText(
        'Institution',
        'institution',
        'institution',
        'Please input the institution you represent',
        'Your institution',
        '',
        true,
      )}

      {flash?.success && (
        <div className="font-bold text-green-600">{flash.success}</div>
      )}

      {flash?.error && (
        <div className="font-bold text-red-600">{flash.error}</div>
      )}

      <div className="pt-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit request'}
        </Button>
      </div>

      <div>
        <p className="mb-3 mt-4 text-base">
          We will respond within two business days.
        </p>

        <p className="text-base text-[#4F4F4F]">
          <a href="/privacy-policy" className="text-[#4F4F4F] underline">
            Privacy policy
          </a>
        </p>
      </div>
    </form>
  );
}

DemoForm.propTypes = {
  className: PropTypes.string,
  formId: PropTypes.string.isRequired,
  onSuccess: PropTypes.func,
};
