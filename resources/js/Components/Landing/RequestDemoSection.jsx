import DemoForm from './DemoForm';
export default function RequestDemoSection() {
  return (
    <div className="request-demo-section">
      <div className="layout:grid">
        <div className="col-span-6">
          <p className="type:section-label mb-9 sm:mb-12">Request demo</p>
          <h2 className="type:section-title mb-9 sm:mb-32">
            How to get started with Student Success Tool
          </h2>
          <div className="hidden overflow-hidden rounded-[40px] sm:block">
            <img src="/form-thumbnail.jpg" alt="Request Demo" />
          </div>
        </div>
        <div className="tb:col-span-6 tb:col-start-2 col-span-full md:col-span-9 md:col-start-9 md:pt-14">
          <DemoForm formId="request-demo-form" className="w-full" />
        </div>
      </div>
    </div>
  );
}
