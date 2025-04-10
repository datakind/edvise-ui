export default function Footer() {
  return (
    <div className="footer pt-20">
      <div className="layout:grid mb-64">
        <div className="col-span-3 col-start-2">
          <img src="/images/deemia-logo-footer.svg" alt="Deemia Logo" />
        </div>
        <div className="col-span-3 col-start-8">
          <ul>
            <li>
              <a href="#">Press and resources </a>
            </li>
            <li>
              <a href="#">Contact us</a>
            </li>
          </ul>
        </div>
        <div className="col-span-3">
          <ul>
            <li>
              <a href="#">Twitter</a>
            </li>
            <li>
              <a href="#">Facebook</a>
            </li>
            <li>
              <a href="#">Instagram</a>
            </li>
            <li>
              <a href="#">LinkedIn</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="layout:grid">
        <div className="col-span-3">
          <p>© 2025 DataKind</p>
        </div>
        <div className="col-span-6 col-start-8">
          <a href="#">Terms of Use</a> <span>•</span>{' '}
          <a href="#">Privacy Policy</a>
        </div>
      </div>
    </div>
  );
}
