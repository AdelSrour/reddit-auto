import { Header } from '@/components/layout';
import { DashboardContent } from '@/components/dashboard';

export default function HomePage(): React.ReactNode {
  return (
    <div>
      <Header
        title="Dashboard"
        description="Overview of your Reddit automation activity"
      />

      <DashboardContent />
    </div>
  );
}
