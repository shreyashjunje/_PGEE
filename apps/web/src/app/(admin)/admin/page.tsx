import { ApiHealth } from '@/components/api-health';

// Placeholder for the super admin area.
export default function AdminPage() {
  return (
    <main className="flex flex-col gap-4 p-6">
      <h1 className="text-2xl font-semibold">Super admin</h1>
      <p className="text-muted-foreground">Placeholder. Features arrive in later phases.</p>
      <ApiHealth />
    </main>
  );
}
