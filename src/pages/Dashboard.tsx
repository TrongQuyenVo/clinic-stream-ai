import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Calendar, 
  Stethoscope, 
  Activity,
  TrendingUp,
  Clock,
  UserPlus,
  CalendarDays
} from 'lucide-react';

// Mock data for dashboard
const stats = {
  totalPatients: 1247,
  totalDoctors: 23,
  totalAppointments: 189,
  todayAppointments: 12,
  totalVisits: 3456
};

const upcomingAppointments = [
  {
    id: 1,
    patientName: 'Nguyễn Văn An',
    doctorName: 'BS. Trần Thị Lan',
    time: '09:00',
    date: '2024-01-15',
    status: 'scheduled'
  },
  {
    id: 2,
    patientName: 'Lê Thị Bình',
    doctorName: 'BS. Phạm Văn Đức',
    time: '10:30',
    date: '2024-01-15',
    status: 'scheduled'
  },
  {
    id: 3,
    patientName: 'Hoàng Minh Châu',
    doctorName: 'BS. Nguyễn Thị Mai',
    time: '14:00',
    date: '2024-01-15',
    status: 'scheduled'
  }
];

const recentActivities = [
  {
    id: 1,
    action: 'Thêm bệnh nhân mới',
    user: 'BS. Trần Thị Lan',
    time: '5 phút trước',
    type: 'patient'
  },
  {
    id: 2,
    action: 'Hoàn thành khám bệnh',
    user: 'BS. Phạm Văn Đức',
    time: '15 phút trước',
    type: 'visit'
  },
  {
    id: 3,
    action: 'Tạo lịch hẹn mới',
    user: 'Nguyễn Văn An',
    time: '30 phút trước',
    type: 'appointment'
  }
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Tổng quan hệ thống quản lý phòng khám</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <UserPlus className="w-4 h-4 mr-2" />
            Thêm bệnh nhân
          </Button>
          <Button variant="default">
            <CalendarDays className="w-4 h-4 mr-2" />
            Tạo lịch hẹn
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card className="shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng bệnh nhân</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats.totalPatients.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-success">+12%</span> so với tháng trước
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bác sĩ</CardTitle>
            <Stethoscope className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary">{stats.totalDoctors}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-success">+2</span> bác sĩ mới
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cuộc hẹn</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{stats.totalAppointments}</div>
            <p className="text-xs text-muted-foreground">
              Tháng này
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hôm nay</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats.todayAppointments}</div>
            <p className="text-xs text-muted-foreground">
              Cuộc hẹn hôm nay
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lượt khám</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{stats.totalVisits.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-success">+8%</span> so với tháng trước
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Appointments */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Lịch hẹn sắp tới
            </CardTitle>
            <CardDescription>
              Các cuộc hẹn trong ngày hôm nay
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingAppointments.map((appointment) => (
              <div key={appointment.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="space-y-1">
                  <div className="font-medium">{appointment.patientName}</div>
                  <div className="text-sm text-muted-foreground">{appointment.doctorName}</div>
                </div>
                <div className="text-right space-y-1">
                  <div className="font-medium">{appointment.time}</div>
                  <Badge variant="secondary">Đã lên lịch</Badge>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full">
              Xem tất cả lịch hẹn
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Hoạt động gần đây
            </CardTitle>
            <CardDescription>
              Các hoạt động mới nhất trong hệ thống
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="space-y-1">
                  <div className="font-medium">{activity.action}</div>
                  <div className="text-sm text-muted-foreground">{activity.user}</div>
                </div>
                <div className="text-sm text-muted-foreground">
                  {activity.time}
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full">
              Xem nhật ký đầy đủ
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Thao tác nhanh
          </CardTitle>
          <CardDescription>
            Các chức năng thường dùng
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Users className="w-6 h-6" />
              Quản lý bệnh nhân
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Calendar className="w-6 h-6" />
              Lịch hẹn
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Stethoscope className="w-6 h-6" />
              Khám bệnh
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Activity className="w-6 h-6" />
              Báo cáo
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}