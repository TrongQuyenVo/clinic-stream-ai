import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  Download, 
  Eye, 
  Trash2, 
  Search, 
  FileText, 
  Image,
  FileCheck,
  Calendar,
  User
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MedicalRecord {
  id: string;
  patientId: string;
  patientName: string;
  title: string;
  fileUrl: string;
  fileType: string;
  fileSize: string;
  uploadedAt: string;
}

const mockRecords: MedicalRecord[] = [
  {
    id: '1',
    patientId: '1',
    patientName: 'Nguyễn Văn An',
    title: 'Kết quả xét nghiệm máu',
    fileUrl: '/records/blood_test_an.pdf',
    fileType: 'pdf',
    fileSize: '2.5 MB',
    uploadedAt: '2024-01-15'
  },
  {
    id: '2',
    patientId: '1',
    patientName: 'Nguyễn Văn An',
    title: 'X-quang phổi',
    fileUrl: '/records/xray_lung_an.jpg',
    fileType: 'image',
    fileSize: '4.1 MB',
    uploadedAt: '2024-01-10'
  },
  {
    id: '3',
    patientId: '2',
    patientName: 'Lê Thị Bình',
    title: 'Siêu âm tim',
    fileUrl: '/records/heart_ultrasound_binh.pdf',
    fileType: 'pdf',
    fileSize: '3.8 MB',
    uploadedAt: '2024-01-12'
  }
];

const mockPatients = [
  { id: '1', name: 'Nguyễn Văn An' },
  { id: '2', name: 'Lê Thị Bình' },
  { id: '3', name: 'Hoàng Minh Châu' }
];

export default function Records() {
  const [records, setRecords] = useState<MedicalRecord[]>(mockRecords);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPatient, setFilterPatient] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    patientId: '',
    title: '',
    file: null as File | null
  });
  const { toast } = useToast();

  const filteredRecords = records.filter(record => {
    const matchesSearch = record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.patientName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPatient = filterPatient === 'all' || record.patientId === filterPatient;
    return matchesSearch && matchesPatient;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.patientId || !formData.title || !formData.file) {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ thông tin và chọn file.",
        variant: "destructive"
      });
      return;
    }

    const patient = mockPatients.find(p => p.id === formData.patientId);
    if (!patient) return;

    const newRecord: MedicalRecord = {
      id: Math.random().toString(36).substr(2, 9),
      patientId: formData.patientId,
      patientName: patient.name,
      title: formData.title,
      fileUrl: `/records/${formData.file.name}`,
      fileType: formData.file.type.includes('image') ? 'image' : 'pdf',
      fileSize: (formData.file.size / (1024 * 1024)).toFixed(1) + ' MB',
      uploadedAt: new Date().toISOString().split('T')[0]
    };
    
    setRecords([...records, newRecord]);
    toast({
      title: "Upload thành công",
      description: "Hồ sơ y tế đã được tải lên.",
    });
    
    setIsDialogOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      patientId: '',
      title: '',
      file: null
    });
  };

  const handleDelete = (id: string) => {
    setRecords(records.filter(r => r.id !== id));
    toast({
      title: "Xóa thành công",
      description: "Hồ sơ y tế đã được xóa.",
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "Lỗi",
          description: "File không được vượt quá 10MB.",
          variant: "destructive"
        });
        return;
      }
      
      // Check file type
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Lỗi",
          description: "Chỉ chấp nhận file PDF, JPG, PNG.",
          variant: "destructive"
        });
        return;
      }
      
      setFormData({ ...formData, file });
    }
  };

  const getFileIcon = (fileType: string) => {
    if (fileType === 'image') {
      return <Image className="w-5 h-5 text-blue-500" />;
    }
    return <FileText className="w-5 h-5 text-red-500" />;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Quản lý hồ sơ y tế</h1>
          <p className="text-muted-foreground">Quản lý các file hồ sơ y tế của bệnh nhân</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="default" onClick={resetForm}>
              <Upload className="w-4 h-4 mr-2" />
              Tải lên hồ sơ
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Tải lên hồ sơ y tế mới</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="patientId">Bệnh nhân *</Label>
                <Select value={formData.patientId} onValueChange={(value) => setFormData({...formData, patientId: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn bệnh nhân" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockPatients.map(patient => (
                      <SelectItem key={patient.id} value={patient.id}>
                        {patient.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Tiêu đề hồ sơ *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Ví dụ: Kết quả xét nghiệm máu"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="file">File hồ sơ *</Label>
                <Input
                  id="file"
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.jpg,.jpeg,.png"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Chấp nhận file PDF, JPG, PNG. Tối đa 10MB.
                </p>
                {formData.file && (
                  <div className="flex items-center gap-2 p-2 bg-muted rounded">
                    <FileCheck className="w-4 h-4 text-success" />
                    <span className="text-sm">{formData.file.name}</span>
                    <span className="text-xs text-muted-foreground">
                      ({(formData.file.size / (1024 * 1024)).toFixed(1)} MB)
                    </span>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Hủy
                </Button>
                <Button type="submit">
                  Tải lên
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card className="shadow-soft">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo tiêu đề hoặc tên bệnh nhân..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterPatient} onValueChange={setFilterPatient}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Lọc theo bệnh nhân" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả bệnh nhân</SelectItem>
                {mockPatients.map(patient => (
                  <SelectItem key={patient.id} value={patient.id}>
                    {patient.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Records Table */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>Danh sách hồ sơ y tế</CardTitle>
          <CardDescription>
            Tìm thấy {filteredRecords.length} hồ sơ
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>File</TableHead>
                <TableHead>Thông tin</TableHead>
                <TableHead>Bệnh nhân</TableHead>
                <TableHead>Ngày tải lên</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {getFileIcon(record.fileType)}
                      <div>
                        <div className="font-medium">{record.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {record.fileType.toUpperCase()} • {record.fileSize}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="text-sm font-medium">{record.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {record.fileUrl}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span>{record.patientName}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{formatDate(record.uploadedAt)}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center gap-2 justify-end">
                      <Button variant="ghost" size="icon">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDelete(record.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}