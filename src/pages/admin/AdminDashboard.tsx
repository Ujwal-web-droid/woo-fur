import { useAdminStats } from '@/hooks/useAdmin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, PawPrint, Calendar, DollarSign, BookOpen, Heart } from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export function AdminDashboard() {
  const { stats, isLoading } = useAdminStats();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const statCards = [
    { title: 'Total Animals', value: stats?.totalAnimals || 0, icon: PawPrint, color: 'text-primary' },
    { title: 'Registered Users', value: stats?.totalUsers || 0, icon: Users, color: 'text-blue-500' },
    { title: 'Total Bookings', value: stats?.totalBookings || 0, icon: Calendar, color: 'text-green-500' },
    { title: 'Total Donations', value: `$${(stats?.totalDonations || 0).toLocaleString()}`, icon: DollarSign, color: 'text-amber-500' },
    { title: 'Stories Shared', value: stats?.totalStories || 0, icon: BookOpen, color: 'text-purple-500' },
    { title: 'Volunteers', value: stats?.totalVolunteers || 0, icon: Heart, color: 'text-rose-500' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Dashboard Overview</h2>
        <p className="text-muted-foreground">Welcome to the Woo-Fur admin panel</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Use the sidebar to navigate between different admin sections:
            </p>
            <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
              <li><strong>Animals</strong> - Manage animal profiles</li>
              <li><strong>Programs</strong> - Configure therapy programs</li>
              <li><strong>Bookings</strong> - View and manage bookings</li>
              <li><strong>Users</strong> - Manage user accounts and roles</li>
              <li><strong>Content</strong> - Edit page content dynamically</li>
              <li><strong>Settings</strong> - Site configuration and feature flags</li>
              <li><strong>Audit Log</strong> - View all system changes</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Database</span>
              <span className="flex items-center gap-2 text-sm text-green-600">
                <span className="h-2 w-2 rounded-full bg-green-500"></span>
                Connected
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Payment Gateway</span>
              <span className="flex items-center gap-2 text-sm text-green-600">
                <span className="h-2 w-2 rounded-full bg-green-500"></span>
                Active
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Email Service</span>
              <span className="flex items-center gap-2 text-sm text-green-600">
                <span className="h-2 w-2 rounded-full bg-green-500"></span>
                Configured
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Maps Integration</span>
              <span className="flex items-center gap-2 text-sm text-green-600">
                <span className="h-2 w-2 rounded-full bg-green-500"></span>
                Active
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
