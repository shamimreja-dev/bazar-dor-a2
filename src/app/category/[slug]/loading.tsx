
export default function CategoryLoading() {
  return (
    <main className="min-h-screen bg-[#faf9f6]">
      <div className="mx-auto max-w-6xl animate-pulse px-4 py-10">
        <div className="h-5 w-28 rounded bg-gray-200" />

        <div className="mt-6 rounded-3xl bg-gray-200 p-10">
          <div className="h-12 w-12 rounded-xl bg-gray-300" />
          <div className="mt-5 h-8 w-48 rounded bg-gray-300" />
          <div className="mt-3 h-4 w-64 max-w-full rounded bg-gray-300" />
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="rounded-2xl border border-gray-100 bg-white p-4"
            >
              <div className="h-24 rounded-xl bg-gray-200" />
              <div className="mt-4 h-5 w-3/4 rounded bg-gray-200" />
              <div className="mt-3 h-4 w-1/2 rounded bg-gray-200" />
              <div className="mt-5 h-6 w-2/3 rounded bg-gray-200" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
