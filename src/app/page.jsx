import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-6">
      <h1 className="text-4xl font-bold">
        Provider Lead Management System
      </h1>

      <p className="text-gray-600 text-center max-w-xl">
        Full-stack lead allocation platform with
        realtime dashboard, round-robin
        distribution, quota management, and
        concurrency-safe transactions.
      </p>

      <div className="flex flex-col gap-4 w-full max-w-sm">
        <Link
          href="/request-service"
          className="bg-black text-white text-center py-3 rounded"
        >
          Request Service
        </Link>

        <Link
          href="/dashboard"
          className="bg-blue-600 text-white text-center py-3 rounded"
        >
          Dashboard
        </Link>

        <Link
          href="/test-tools"
          className="bg-green-600 text-white text-center py-3 rounded"
        >
          Test Tools
        </Link>
      </div>
    </div>
  );
}