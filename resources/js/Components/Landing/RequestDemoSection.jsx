import DemoForm from './DemoForm';
export default function RequestDemoSection() {
  return (
    <div className="request-demo-section">
      <div className="layout:grid">
        <div className="col-span-6">
          <p className="type:section-label mb-12">Request a Demo</p>
          <h2 className="type:section-title mb-32">
            How to get started with Student Success Tool
          </h2>
          <div className="overflow-hidden rounded-[40px]">
            <img src="/images/landing/form-thumbnail.png" alt="Request Demo" />
          </div>
        </div>
        <div className="col-span-9 col-start-9 pt-14">
          <DemoForm formId="request-demo-form" className="w-full" />
        </div>
      </div>
    </div>
  );
}
