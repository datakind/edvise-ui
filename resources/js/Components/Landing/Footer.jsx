export default function Footer() {
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

  return (
    <div className="footer pt-20 sm:pt-36">
      <div className="layout:grid mb-24 sm:mb-64">
        <div className="col-span-full mb-12 sm:col-span-2 sm:col-start-1">
          <div className="mx-auto max-w-[100px] sm:mx-0">
            <img
              src="/images/landing/deemia-logo-footer.svg"
              alt="Deemia Logo"
            />
          </div>
        </div>
        <div className="col-span-full mb-6 sm:col-span-4 sm:col-start-5">
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
        </div>
        <div className="col-span-full sm:col-span-4 sm:col-start-11">
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
      </div>
      <div className="layout:grid">
        <div className="col-span-3 col-start-4 row-start-2 text-right sm:col-start-1 sm:row-start-1 sm:text-left">
          <p>© 2025 DataKind</p>
        </div>
        <div className="col-span-6 row-start-1 sm:col-start-5">
          <a href="#" className="text-base text-[#000] underline">
            Terms of Use
          </a>
        </div>
        <div className="sm:row-start-0 col-span-3 col-start-1 row-start-2 sm:col-start-11 sm:row-start-1">
          <a href="#" className="text-base text-[#000] underline">
            Privacy Policy
          </a>
        </div>
      </div>
    </div>
  );
}
