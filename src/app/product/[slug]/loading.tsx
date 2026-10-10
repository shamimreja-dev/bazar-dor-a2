
export default function ProductLoading() {
  return (
    <main className="min-h-screen animate-pulse bg-[#faf9f6]">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="h-5 w-40 rounded bg-gray-200" />

        <div className="mt-8 rounded-3xl bg-white p-6 sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row">
            <div className="h-28 w-28 rounded-2xl bg-gray-200" />
            <div className="flex-1 space-y-4">
              <div className="h-5 w-32 rounded bg-gray-200" />
              <div className="h-8 w-56 rounded bg-gray-200" />
              <div className="h-4 w-full max-w-md rounded bg-gray-200" />
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-28 rounded-2xl bg-gray-200" />
          ))}
        </div>

        <div className="mt-10 h-64 rounded-2xl bg-gray-200" />
      </div>
    </main>
  );
}
