import { useMemo } from 'react';
import Button from '@/Components/Landing/Button';
import classNames from 'classnames';
export default function Header() {
  const navLinks = useMemo(
    () => [
      {
        label: 'The Product',
        href: '/',
      },
      {
        label: 'FAQ',
        href: '/faq',
      },
      {
        label: 'About us',
        href: '/about',
      },
    ],
    [],
  );
  return (
    <header className="py-4">
      <div className="layout:grid items-center">
        <div className="col-span-4">
          <img src="/images/deemia-logo.svg" alt="Deemia Logo" />
        </div>
        <div className="col-span-6 col-start-7">
          <nav>
            <ul className="flex gap-8">
              {navLinks.map(link => (
                <li key={link.href}>
                  <a
                    className={classNames(
                      link.href === window.location.pathname ? 'active' : '',
                      'text-[#000] font-normal text-[16px] leading-[100%]',
                    )}
                    href={link.href}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="col-span-7 col-start-14 flex justify-end gap-8">
          <Button>Get a quote</Button>
          <Button>Get a quote</Button>
        </div>
      </div>
    </header>
  );
}
