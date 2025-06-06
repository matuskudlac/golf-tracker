export default function TestEnv() {
  const hasDbUrl = !!process.env.DATABASE_URL;
  const dbUrlPreview = process.env.DATABASE_URL
    ? `${process.env.DATABASE_URL.substring(0, 20)}...`
    : "Not found";

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Environment Variable Test</h1>
      <div className="space-y-4">
        <div>
          <strong>DATABASE_URL exists:</strong> {hasDbUrl ? "✅ Yes" : "❌ No"}
        </div>
        <div>
          <strong>DATABASE_URL preview:</strong> {dbUrlPreview}
        </div>
        {!hasDbUrl && (
          <div className="p-4 bg-red-50 border border-red-200 rounded">
            <p className="text-red-700">
              <strong>Fix needed:</strong> Create a .env.local file in your
              project root with your DATABASE_URL
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
