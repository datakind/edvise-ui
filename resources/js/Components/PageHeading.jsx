export default function PageHeading({ children }) {
    return (
        <div className="font-[Helvetica Neue] mb-8 min-w-full">
            <div className="mb-6 flex items-center justify-center">
                <h1 className="text-5xl font-light">{children}</h1>
            </div>
        </div>);
}
