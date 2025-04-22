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
    <div className="footer pt-36">
      <div className="layout:grid mb-64">
        <div className="col-span-2 col-start-1">
          <img src="/images/landing/deemia-logo-footer.svg" alt="Deemia Logo" />
        </div>
        <div className="col-span-4 col-start-5">
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
        <div className="col-span-4 col-start-11">
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
        <div className="col-span-3">
          <p>© 2025 DataKind</p>
        </div>
        <div className="col-span-6 col-start-5">
          <a href="#" className="text-base text-[#000] underline">
            Terms of Use
          </a>
        </div>
        <div className="col-span-3 col-start-11">
          <a href="#" className="text-base text-[#000] underline">
            Privacy Policy
          </a>
        </div>
      </div>
    </div>
  );
}
