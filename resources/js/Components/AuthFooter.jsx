export default function AuthFooter() {
  return (
    <div className="mx-auto -mb-24 mt-12 grid w-full grid-cols-4 gap-4 text-sm text-[#4F4F4F]">
      <div>
        <a href="/privacy-policy" className="text-[#4F4F4F] hover:underline">
          Privacy Policy
        </a>
      </div>
      <div>
        <a href="/terms-of-service" className="text-[#4F4F4F] hover:underline">
          Terms of Service
        </a>
      </div>
      <div className="">
        <a href="/license" className="text-[#4F4F4F] hover:underline">
          License
        </a>
      </div>
      <div className="">@2025 DataKind</div>
    </div>
  );
}
