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
    title: '',
  });

  const handleSubmit = e => {
    e.preventDefault();
    setIsSubmitting(true);

    form.post(route('demo.request'), {
      preserveScroll: true,
      onSuccess: () => {
        form.reset();
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
      {renderInputText(
        'Title',
        'title',
        'title',
        'Please input your job title',
        'Your job title',
        '',
        true,
      )}

      {flash?.success && (
        <div className="font-medium text-green-600">{flash.success}</div>
      )}

      {flash?.error && (
        <div className="font-medium text-red-600">{flash.error}</div>
      )}

      <div className="pt-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit request'}
        </Button>
      </div>

      <div>
        <p className="mb-3 mt-4 text-base">
          Edvise currently serves U.S.-based colleges and universities. We’ll
          respond to those inquiries within two business days. If you're outside
          the U.S. and want to learn more about our work, please{' '}
          <a
            className="text-[#4F4F4F] underline hover:font-semibold"
            href="https://www.datakind.org/newsletter/"
            target="_blank"
          >
            sign up for our newsletter
          </a>
          .
        </p>

        <p className="text-base text-[#4F4F4F]">
          <a
            href="/privacy-policy"
            className="text-[#4F4F4F] underline hover:font-semibold"
          >
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
