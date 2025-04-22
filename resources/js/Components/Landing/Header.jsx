import { useMemo, useState } from 'react';
import Button from '@/Components/Landing/Button';
import classNames from 'classnames';
import { Dialog, DialogPanel } from '@headlessui/react';
import DemoForm from '@/Components/Landing/DemoForm';
export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const navLinks = useMemo(
    () => [
      {
        label: 'The Product',
        href: '/',
        external: false,
      },
      {
        label: 'About us',
        href: '/about',
        external: true,
      },
    ],
    [],
  );
  return (
    <>
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-50"
      >
        <div className="landing-modal fixed inset-0 flex w-screen items-center justify-center bg-black/50 p-4">
          <DialogPanel className="layout:max-width relative w-full overflow-y-auto rounded-[40px] border bg-white p-12">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute right-5 top-5 flex h-[40px] w-[40px] items-center justify-center rounded-full bg-[#1E343F] p-2 focus:outline-[var(--landing-color-orange)]"
              type="button"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
              >
                <title>Close</title>
                <path
                  d="M15.5452 1.72754L9.51685 7.75488L15.5452 13.7832L14.1311 15.1973L8.10278 9.16895L2.07544 15.1973L0.661377 13.7832L6.68872 7.75488L0.661377 1.72754L2.07544 0.313477L8.10278 6.34082L14.1311 0.313477L15.5452 1.72754Z"
                  fill="white"
                />
              </svg>
            </button>
            <div className="layout:grid">
              <div className="col-span-6">
                <p className="type:section-label mb-12">Request a demo</p>
                <p className="type:section-title">
                  How to get started with Student Success Tool
                </p>
              </div>
              <div className="col-span-9 col-start-10">
                <DemoForm formId="modal-form" />
              </div>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
      <header className="py-4">
        <div className="layout:grid items-center">
          <div className="col-span-4">
            <img src="/images/landing/deemia-logo.svg" alt="Deemia Logo" />
          </div>
          <div className="col-span-6 col-start-7">
            <nav>
              <ul className="flex items-center gap-8">
                {navLinks.map(link => (
                  <li key={link.href}>
                    <a
                      className={classNames(
                        link.href === window.location.pathname
                          ? 'gap-3 before:h-2.5 before:w-2.5 before:rounded-full before:bg-[#F79122] before:content-[""]'
                          : 'hover:underline',
                        'relative flex items-center gap-2 text-[16px] font-normal leading-[100%] text-[#000]',
                      )}
                      href={link.href}
                    >
                      {link.label}
                      {link.external && (
                        <span className="text-[#000]">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="11"
                            height="11"
                            viewBox="0 0 11 11"
                            fill="none"
                          >
                            <title>External Link</title>
                            <path
                              d="M0.974294 10.7035L0.208252 9.9375L8.84617 1.29167H1.12013V0.208332H10.7035V9.79167H9.62013V2.06562L0.974294 10.7035Z"
                              fill="#1C1B1F"
                            />
                          </svg>
                        </span>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          <div className="col-start-14 col-span-7 flex justify-end gap-8">
            <Button onClick={() => setIsOpen(true)}>Request a demo</Button>
            <Button kind="secondary" href="#">
              Log in
            </Button>
          </div>
        </div>
      </header>
    </>
  );
}
