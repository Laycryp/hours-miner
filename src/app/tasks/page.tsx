"use client";

export default function TasksPage() {
  return (
    <div className="space-y-4 pb-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-extrabold">Booster Tasks</h2>
      </div>

      <div className="card">
        <div className="text-lg font-semibold mb-1">Coming soon</div>
        <p className="text-sm text-muted">
          We’re preparing booster tasks to increase your mining speed (e.g., +0.1x, +0.2x, +0.8x…).
          This section will unlock in a future update.
        </p>
      </div>
    </div>
  );
}
