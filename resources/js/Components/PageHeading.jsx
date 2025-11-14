export default function PageHeading({ children }) {
    return (
        <div className="mb-8 min-w-full text-center">
            <h1 className="text-5xl font-light text-black">{children}</h1>
        </div>
    );
}
