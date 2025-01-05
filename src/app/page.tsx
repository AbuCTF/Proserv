// src/app/page.tsx
import EnhancedPressureMonitor from '@/components/EnhancedPressureMonitor';

export default function Home() {
  return (
    <main className="min-h-screen p-4 bg-gray-50">
      <EnhancedPressureMonitor />
    </main>
  );
}
