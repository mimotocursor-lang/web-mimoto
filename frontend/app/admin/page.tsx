import { KpiGrid } from '@components/dashboard/KpiGrid';

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <KpiGrid />
    </div>
  );
}

import { KpiGrid } from '../../components/dashboard/KpiGrid';

export default function AdminDashboardPage() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <KpiGrid />
    </section>
  );
}


