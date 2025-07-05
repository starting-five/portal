export default function ListingCard({
  listing,
}: {
  listing: Record<string, unknown>;
}) {
  return (
    <div className="border rounded shadow p-4 bg-white">
      <table className="w-full text-sm">
        <tbody>
          {Object.entries(listing).map(([key, value]) => (
            <tr key={key}>
              <td className="font-semibold pr-2 align-top">{key}</td>
              <td className="text-gray-700 break-all">
                {typeof value === "object" && value !== null ? (
                  <pre className="whitespace-pre-wrap">
                    {JSON.stringify(value, null, 2)}
                  </pre>
                ) : (
                  String(value)
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
