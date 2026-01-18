/* eslint-disable @typescript-eslint/no-explicit-any */
// app/properties/PropertyCard.tsx
import Link from "next/link";

export default function PropertyCard({ property }: any) {
  return (
    <Link href={`/properties/${property.slug}`}>
      <div className="border p-4 rounded hover:shadow">
        <h2 className="font-semibold">
          {property.title}
        </h2>

        <p className="text-sm text-gray-600">
          {property.zone?.name}
        </p>

        <p className="mt-2 font-bold">
          {property.price.currency} {property.price.amount}
        </p>

        {property.flags?.featured && (
          <span className="text-xs text-green-600">
            Destacada
          </span>
        )}
      </div>
    </Link>
  );
}
