export default function AuthFooter() {
  return (
    <div className="mx-auto mt-12 -mb-24 grid w-full grid-cols-4 gap-4 text-sm text-[#4F4F4F]">
      <div>
        <a
          href="/privacy-policy"
          className="text-[#4F4F4F] underline hover:font-semibold"
        >
          Privacy Policy
        </a>
      </div>
      <div>
        <a
          href="/terms-of-service"
          className="text-[#4F4F4F] underline hover:font-semibold"
        >
          Terms of Service
        </a>
      </div>
      <div className="">
        <a
          href="/license"
          className="text-[#4F4F4F] underline hover:font-semibold"
        >
          License
        </a>
      </div>
      <div className="">@2025 DataKind</div>
    </div>
  );
}
