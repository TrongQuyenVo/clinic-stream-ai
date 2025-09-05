import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bell, 
  Mail, 
  Phone, 
  Check, 
  Trash2, 
  AlertCircle,
  Info,
  CheckCircle,
  Calendar,
  User
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Notification {
  id: string;
  type: 'in-app' | 'email' | 'sms';
  title: string;
  message: string;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'in-app',
    title: 'Lịch hẹn sắp tới',
    message: 'Bạn có lịch hẹn với BS. Trần Thị Lan vào lúc 09:00 ngày mai',
    isRead: false,
    priority: 'high',
    createdAt: '2024-01-15T08:30:00'
  },
  {
    id: '2',
    type: 'email',
    title: 'Kết quả xét nghiệm',
    message: 'Kết quả xét nghiệm của bạn đã có. Vui lòng đến phòng khám để nhận.',
    isRead: false,
    priority: 'medium',
    createdAt: '2024-01-14T15:20:00'
  },
  {
    id: '3',
    type: 'sms',
    title: 'Nhắc nhở uống thuốc',
    message: 'Đã đến giờ uống thuốc Paracetamol 500mg',
    isRead: true,
    priority: 'low',
    createdAt: '2024-01-14T12:00:00'
  },
  {
    id: '4',
    type: 'in-app',
    title: 'Cập nhật hồ sơ',
    message: 'Vui lòng cập nhật thông tin liên hệ trong hồ sơ cá nhân',
    isRead: true,
    priority: 'low',
    createdAt: '2024-01-13T10:15:00'
  }
];

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [activeTab, setActiveTab] = useState('all');
  const { toast } = useToast();

  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === 'all') return true;
    if (activeTab === 'unread') return !notification.isRead;
    return notification.type === activeTab;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, isRead: true } : n
    ));
    toast({
      title: "Đánh dấu đã đọc",
      description: "Thông báo đã được đánh dấu là đã đọc.",
    });
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    toast({
      title: "Đã đọc tất cả",
      description: "Tất cả thông báo đã được đánh dấu là đã đọc.",
    });
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
    toast({
      title: "Xóa thành công",
      description: "Thông báo đã được xóa.",
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email':
        return <Mail className="w-4 h-4" />;
      case 'sms':
        return <Phone className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive" className="text-xs">Cao</Badge>;
      case 'medium':
        return <Badge variant="default" className="text-xs">Trung bình</Badge>;
      default:
        return <Badge variant="secondary" className="text-xs">Thấp</Badge>;
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <AlertCircle className="w-4 h-4 text-destructive" />;
      case 'medium':
        return <Info className="w-4 h-4 text-primary" />;
      default:
        return <CheckCircle className="w-4 h-4 text-success" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return 'Vừa xong';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} giờ trước`;
    } else {
      return date.toLocaleDateString('vi-VN');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Thông báo</h1>
          <p className="text-muted-foreground">
            Quản lý các thông báo và tin nhắn từ hệ thống
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant="secondary" className="px-3 py-1">
            {unreadCount} chưa đọc
          </Badge>
          <Button variant="outline" onClick={markAllAsRead} disabled={unreadCount === 0}>
            <Check className="w-4 h-4 mr-2" />
            Đánh dấu tất cả đã đọc
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">
            Tất cả ({notifications.length})
          </TabsTrigger>
          <TabsTrigger value="unread">
            Chưa đọc ({unreadCount})
          </TabsTrigger>
          <TabsTrigger value="in-app">
            Ứng dụng
          </TabsTrigger>
          <TabsTrigger value="email">
            Email
          </TabsTrigger>
          <TabsTrigger value="sms">
            SMS
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <Card className="shadow-soft">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Bell className="w-16 h-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Không có thông báo</h3>
                <p className="text-muted-foreground text-center">
                  Bạn không có thông báo nào trong danh mục này.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredNotifications.map((notification) => (
                <Card 
                  key={notification.id} 
                  className={`shadow-soft transition-all hover:shadow-medium ${
                    !notification.isRead ? 'border-primary/20 bg-primary/5' : ''
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className={`p-2 rounded-full ${
                        !notification.isRead ? 'bg-primary/10' : 'bg-muted'
                      }`}>
                        {getTypeIcon(notification.type)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h4 className={`font-medium ${
                                !notification.isRead ? 'text-foreground' : 'text-muted-foreground'
                              }`}>
                                {notification.title}
                              </h4>
                              {!notification.isRead && (
                                <div className="w-2 h-2 bg-primary rounded-full"></div>
                              )}
                            </div>
                            <p className={`text-sm ${
                              !notification.isRead ? 'text-foreground' : 'text-muted-foreground'
                            }`}>
                              {notification.message}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            {getPriorityBadge(notification.priority)}
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              {getPriorityIcon(notification.priority)}
                              <span>Ưu tiên {notification.priority === 'high' ? 'cao' : notification.priority === 'medium' ? 'trung bình' : 'thấp'}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              <span>{formatDate(notification.createdAt)}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {!notification.isRead && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => markAsRead(notification.id)}
                              >
                                <Check className="w-4 h-4 mr-1" />
                                Đánh dấu đã đọc
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => deleteNotification(notification.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-soft">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Bell className="w-4 h-4 text-primary" />
              Tổng thông báo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{notifications.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Tất cả thông báo</p>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-warning" />
              Chưa đọc
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{unreadCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Cần xem</p>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-success" />
              Đã đọc
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {notifications.length - unreadCount}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Đã xem</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}