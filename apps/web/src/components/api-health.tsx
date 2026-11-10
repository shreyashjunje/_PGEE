'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

/** Proves the web → @pg/api-client → API → database path end to end. */
export function ApiHealth() {
  const health = useQuery({ queryKey: ['health'], queryFn: api.health });

  if (health.isPending) return <p role="status">Checking API…</p>;
  if (health.isError) {
    return (
      <p role="alert" className="text-destructive">
        API unreachable: {health.error.message}
      </p>
    );
  }
  return <p role="status">API is up, database is {health.data.database}.</p>;
}
