import { useMemo, useState, useEffect } from 'react';
import Button from '@/Components/Landing/Button';
import classNames from 'classnames';
import clx from 'classnames';
import DemoFormModal from '@/Components/Landing/DemoFormModal';
import { useLenis } from './LenisProvider';
export default function Header() {
  const [isFormModalOpen, setFormModalOpen] = useState(false);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const lenis = useLenis();
  const navLinks = useMemo(
    () => [
      {
        label: 'About us',
        href: 'https://www.datakind.org',
        external: true,
      },
    ],
    [],
  );

  const footerLinksOne = [
    {
      label: 'Contact us',
      href: '#',
    },
    {
      label: 'Press and resources',
      href: '#',
    },
  ];

  const footerLinksTwo = [
    {
      label: 'X',
      href: '#',
    },
    {
      label: 'Facebook',
      href: '#',
    },
    {
      label: 'LinkedIn',
      href: '#',
    },
  ];

  useEffect(() => {
    if (isFormModalOpen && isMenuOpen) {
      setMenuOpen(false);
    }

    if (isFormModalOpen || isMenuOpen) {
      lenis && lenis.stop();
    } else {
      lenis && lenis.start();
    }
  }, [isFormModalOpen, isMenuOpen, lenis]);

  return (
    <>
      <DemoFormModal open={isFormModalOpen} setOpen={setFormModalOpen} />
      <header className="fixed left-0 right-0 top-0 z-50 bg-[#EEF2F6]">
        {isMenuOpen && (
          <div className="fixed inset-0 z-30 bg-white pb-16">
            <div className="layout:max-width flex h-full flex-col justify-between">
              <div className="layout:grid">
                <nav className="col-span-full pt-36">
                  <ul className="space-y-4">
                    {navLinks.map(link => (
                      <li
                        key={`header-link-${link.label}`}
                        className="shrink-0"
                      >
                        <a
                          href={link.href}
                          className={classNames(
                            link.href === window.location.pathname
                              ? 'after:relative after:-top-1 after:ml-2 after:h-2.5 after:w-2.5 after:rounded-full after:bg-[#F79122] after:content-[""]'
                              : 'hover:underline',
                            'relative flex items-center gap-3 text-[32px] leading-none text-black',
                          )}
                        >
                          {link.label}
                          {link.external && (
                            <span className="relative -top-1 text-[#000]">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
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
              <div className="layout:grid">
                <div className="col-span-4 space-y-6">
                  <ul>
                    {footerLinksOne.map(link => (
                      <li key={link.href}>
                        <a
                          href={link.href}
                          className="text-base leading-[160%] text-[#000] underline"
                        >
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                  <ul>
                    {footerLinksTwo.map(link => (
                      <li key={link.href}>
                        <a
                          href={link.href}
                          className="text-base leading-[160%] text-[#000] underline"
                        >
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="col-span-2">
                  <img
                    className="mt-4"
                    src="https://storage.googleapis.com/staging-sst-01-staging-static/deemia-logo-footer.svg"
                    alt="Deemia Logo"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="layout:max-width relative z-40">
          <div className="layout:grid relative items-center py-4">
            <div className="col-span-2 md:col-span-4">
              <a href="/">
                <img
                  className="max-w-[110px] sm:max-w-[140px]"
                  src="https://storage.googleapis.com/staging-sst-01-staging-static/edvise-logo.svg"
                  alt="Edvise Logo"
                />
              </a>
            </div>
            <div className="hidden md:col-span-6 md:col-start-7 md:block">
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
                        <span className="relative top-[0.125em]">
                          {link.label}
                        </span>
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
            <div className="col-start-14 col-span-4 flex justify-end gap-1 tb:col-span-6 md:col-span-8 md:gap-8">
              <Button
                onClick={() => setFormModalOpen(true)}
                className="shrink-0"
              >
                Request demo
              </Button>
              <button
                type="button"
                className={clx(
                  'flex h-[38px] w-[38px] shrink-0 flex-col items-center justify-center gap-[3px] rounded-full bg-white md:hidden',
                  {
                    '!bg-[#EEF2F6]': isMenuOpen,
                  },
                )}
                onClick={() => setMenuOpen(!isMenuOpen)}
              >
                <span
                  className={clx('block h-px w-[14px] bg-black', {
                    'translate-y-[4px] rotate-45': isMenuOpen,
                  })}
                />
                <span
                  className={clx('block h-px w-[14px] bg-black', {
                    'opacity-0': isMenuOpen,
                  })}
                />
                <span
                  className={clx('block h-px w-[14px] bg-black', {
                    '-translate-y-[4px] -rotate-45': isMenuOpen,
                  })}
                />
              </button>
              {/* TODO: Replace login button here */}
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
