import clx from 'classnames';
import { useState } from 'react';
export default function Accordion({ className, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className={clx(
        'landing-rounded-md min-h-[62px] transition-all duration-300',
        {
          'bg-[#D5E5EE]': open,
          'bg-[#EEF2F6]': !open,
        },
      )}
    >
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex min-h-[62px] w-full items-center justify-between px-6 text-base sm:min-h-[86px] sm:p-7 sm:text-[20px]"
      >
        <span>What does the SST model do?</span>
        <div className="plus-icon relative h-[18px] w-[18px]">
          <div className="plus-icon-line absolute left-1/2 top-1/2 h-[2px] w-full -translate-x-1/2 -translate-y-1/2 bg-black" />
          <div
            className={clx(
              'plus-icon-line absolute left-1/2 top-1/2 h-[2px] w-full -translate-x-1/2 -translate-y-1/2 rotate-90 bg-black transition-all duration-300',
              {
                'scale-x-0': open,
              },
            )}
          />
        </div>
      </button>
      <div
        className={clx(
          'grid grid-rows-[0fr] transition-all duration-300 sm:mt-[-15px]',
          {
            'grid-rows-[1fr]': open,
          },
        )}
      >
        <div className="inner overflow-hidden">
          <p className="p-7 pt-0 text-[20px] font-light">
            Student-Success-Tool is a data-assisted advising product to help
            schools identify the students, programs and opportunities to
            increase graduation rates.
          </p>
        </div>
      </div>
    </div>
  );
}
