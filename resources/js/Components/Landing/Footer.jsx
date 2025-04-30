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
      href: 'https://x.com/DataKind',
    },
    {
      label: 'Facebook',
      href: 'https://www.facebook.com/DataKindOrg',
    },
    {
      label: 'LinkedIn',
      href: 'https://www.linkedin.com/company/datakind/',
    },
  ];

  const linkHoverClass = 'transition-colors duration-100 hover:text-black/60';
  const linkClass = 'text-base leading-[160%] text-[#000] underline ';

  return (
    <div className="footer pt-20 sm:pt-36">
      <div className="layout:grid mb-24 sm:mb-56">
        <div className="col-span-full mb-12 sm:col-span-2 sm:col-start-1">
          <div className="mx-auto max-w-[100px] sm:mx-0 md:max-w-full">
            <img
              className="h-full w-full"
              src="https://storage.googleapis.com/staging-sst-01-staging-static/deemia-logo-footer.svg"
              alt="Deemia Logo"
            />
          </div>
        </div>
        <div className="col-span-full mb-6 sm:col-span-4 sm:col-start-5">
          <ul>
            {footerLinksOne.map(link => (
              <li key={`footer-link-${link.label}`}>
                <a
                  href={link.href}
                  className={`${linkClass} ${linkHoverClass}`}
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
              <li key={`footer-link-${link.label}`}>
                <a
                  href={link.href}
                  className={`${linkClass} ${linkHoverClass}`}
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
          <a
            href="/terms-of-service"
            className={`${linkClass} ${linkHoverClass}`}
          >
            Terms of Use
          </a>
        </div>
        <div className="sm:row-start-0 col-span-3 col-start-1 row-start-2 sm:col-start-11 sm:row-start-1">
          <a
            href="/privacy-policy"
            className={`${linkClass} ${linkHoverClass}`}
          >
            Privacy Policy
          </a>
        </div>
      </div>
    </div>
  );
}
