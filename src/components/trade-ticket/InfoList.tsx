import type { InfoItem } from "./types";

interface InfoListProps {
  items: InfoItem[];
}

function InfoValue({ value }: { value: InfoItem["value"] }) {
  if (value == null || value === "") {
    return <span className="text-base-500">-</span>;
  }

  if (typeof value === "string" || typeof value === "number") {
    return <span className="font-semibold text-base-700">{value}</span>;
  }

  return <div className="flex items-center justify-end gap-1">{value}</div>;
}

export function InfoList({ items }: InfoListProps) {
  return (
    <dl className="space-y-3">
      {items
        .filter((item) => !item.hidden)
        .map((item) => (
          <div
            key={item.id ?? String(item.label)}
            className="flex items-start justify-between gap-4"
          >
            <dt className="text-base font-medium text-base-500">
              {item.label}
              {item.helper ? (
                <span className="ml-1 text-sm text-base-500/70">({item.helper})</span>
              ) : null}
            </dt>
            <dd className="text-right text-base">
              <InfoValue value={item.value} />
            </dd>
          </div>
        ))}
    </dl>
  );
}
