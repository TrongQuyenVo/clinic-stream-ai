import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  Plus, 
  Edit, 
  Eye, 
  Calendar, 
  User, 
  Stethoscope,
  FileText,
  Pill,
  Search,
  Trash2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Prescription {
  medicine: string;
  dose: string;
  duration: string;
}

interface Visit {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  appointmentId?: string;
  date: string;
  symptoms: string;
  diagnosis: string;
  prescriptions: Prescription[];
  notes: string;
}

const mockVisits: Visit[] = [
  {
    id: '1',
    patientId: '1',
    patientName: 'Nguyễn Văn An',
    doctorId: 'doc1',
    doctorName: 'BS. Trần Thị Lan',
    appointmentId: '1',
    date: '2024-01-15',
    symptoms: 'Đau đầu, sốt nhẹ',
    diagnosis: 'Cảm cúm thông thường',
    prescriptions: [
      { medicine: 'Paracetamol', dose: '500mg', duration: '3 ngày' },
      { medicine: 'Vitamin C', dose: '1000mg', duration: '5 ngày' }
    ],
    notes: 'Bệnh nhân cần nghỉ ngơi và uống nhiều nước'
  }
];

const mockDoctors = [
  { id: 'doc1', name: 'BS. Trần Thị Lan' },
  { id: 'doc2', name: 'BS. Phạm Văn Đức' },
  { id: 'doc3', name: 'BS. Nguyễn Thị Mai' }
];

const mockPatients = [
  { id: '1', name: 'Nguyễn Văn An' },
  { id: '2', name: 'Lê Thị Bình' },
  { id: '3', name: 'Hoàng Minh Châu' }
];

export default function Visits() {
  const [visits, setVisits] = useState<Visit[]>(mockVisits);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingVisit, setEditingVisit] = useState<Visit | null>(null);
  const [formData, setFormData] = useState({
    patientId: '',
    doctorId: '',
    date: '',
    symptoms: '',
    diagnosis: '',
    notes: ''
  });
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([
    { medicine: '', dose: '', duration: '' }
  ]);
  const { toast } = useToast();

  const filteredVisits = visits.filter(visit =>
    visit.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    visit.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    visit.diagnosis.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const patient = mockPatients.find(p => p.id === formData.patientId);
    const doctor = mockDoctors.find(d => d.id === formData.doctorId);
    
    if (!patient || !doctor) return;

    const validPrescriptions = prescriptions.filter(p => p.medicine && p.dose && p.duration);

    if (editingVisit) {
      setVisits(visits.map(v => 
        v.id === editingVisit.id 
          ? { 
              ...v, 
              ...formData,
              patientName: patient.name,
              doctorName: doctor.name,
              prescriptions: validPrescriptions
            }
          : v
      ));
      toast({
        title: "Cập nhật thành công",
        description: "Thông tin lượt khám đã được cập nhật.",
      });
    } else {
      const newVisit: Visit = {
        id: Math.random().toString(36).substr(2, 9),
        ...formData,
        patientName: patient.name,
        doctorName: doctor.name,
        prescriptions: validPrescriptions
      };
      
      setVisits([...visits, newVisit]);
      toast({
        title: "Thêm thành công",
        description: "Lượt khám mới đã được thêm.",
      });
    }
    
    setIsDialogOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      patientId: '',
      doctorId: '',
      date: '',
      symptoms: '',
      diagnosis: '',
      notes: ''
    });
    setPrescriptions([{ medicine: '', dose: '', duration: '' }]);
    setEditingVisit(null);
  };

  const handleEdit = (visit: Visit) => {
    setEditingVisit(visit);
    setFormData({
      patientId: visit.patientId,
      doctorId: visit.doctorId,
      date: visit.date,
      symptoms: visit.symptoms,
      diagnosis: visit.diagnosis,
      notes: visit.notes
    });
    setPrescriptions(visit.prescriptions.length > 0 ? visit.prescriptions : [{ medicine: '', dose: '', duration: '' }]);
    setIsDialogOpen(true);
  };

  const addPrescription = () => {
    setPrescriptions([...prescriptions, { medicine: '', dose: '', duration: '' }]);
  };

  const removePrescription = (index: number) => {
    if (prescriptions.length > 1) {
      setPrescriptions(prescriptions.filter((_, i) => i !== index));
    }
  };

  const updatePrescription = (index: number, field: keyof Prescription, value: string) => {
    const updated = prescriptions.map((p, i) => 
      i === index ? { ...p, [field]: value } : p
    );
    setPrescriptions(updated);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Quản lý lượt khám</h1>
          <p className="text-muted-foreground">Quản lý thông tin khám bệnh và điều trị</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="default" onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Thêm lượt khám
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingVisit ? 'Cập nhật lượt khám' : 'Thêm lượt khám mới'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
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
                  <Label htmlFor="doctorId">Bác sĩ khám *</Label>
                  <Select value={formData.doctorId} onValueChange={(value) => setFormData({...formData, doctorId: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn bác sĩ" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockDoctors.map(doctor => (
                        <SelectItem key={doctor.id} value={doctor.id}>
                          {doctor.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="date">Ngày khám *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="symptoms">Triệu chứng *</Label>
                <Textarea
                  id="symptoms"
                  value={formData.symptoms}
                  onChange={(e) => setFormData({...formData, symptoms: e.target.value})}
                  placeholder="Mô tả triệu chứng của bệnh nhân..."
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="diagnosis">Chẩn đoán *</Label>
                <Textarea
                  id="diagnosis"
                  value={formData.diagnosis}
                  onChange={(e) => setFormData({...formData, diagnosis: e.target.value})}
                  placeholder="Chẩn đoán bệnh..."
                  required
                />
              </div>

              {/* Prescriptions Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-medium">Đơn thuốc</Label>
                  <Button type="button" variant="outline" onClick={addPrescription}>
                    <Plus className="w-4 h-4 mr-2" />
                    Thêm thuốc
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {prescriptions.map((prescription, index) => (
                    <div key={index} className="grid grid-cols-4 gap-3 p-3 border rounded-lg">
                      <div className="space-y-2">
                        <Label>Tên thuốc</Label>
                        <Input
                          value={prescription.medicine}
                          onChange={(e) => updatePrescription(index, 'medicine', e.target.value)}
                          placeholder="Tên thuốc"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Liều dùng</Label>
                        <Input
                          value={prescription.dose}
                          onChange={(e) => updatePrescription(index, 'dose', e.target.value)}
                          placeholder="500mg"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Thời gian</Label>
                        <Input
                          value={prescription.duration}
                          onChange={(e) => updatePrescription(index, 'duration', e.target.value)}
                          placeholder="3 ngày"
                        />
                      </div>
                      <div className="flex items-end">
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="icon"
                          onClick={() => removePrescription(index)}
                          disabled={prescriptions.length === 1}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Ghi chú</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  placeholder="Ghi chú thêm về lượt khám..."
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Hủy
                </Button>
                <Button type="submit">
                  {editingVisit ? 'Cập nhật' : 'Thêm lượt khám'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <Card className="shadow-soft">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm theo tên bệnh nhân, bác sĩ hoặc chẩn đoán..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Visits Table */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>Danh sách lượt khám</CardTitle>
          <CardDescription>
            Tìm thấy {filteredVisits.length} lượt khám
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Thông tin khám</TableHead>
                <TableHead>Triệu chứng & Chẩn đoán</TableHead>
                <TableHead>Đơn thuốc</TableHead>
                <TableHead>Ghi chú</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVisits.map((visit) => (
                <TableRow key={visit.id}>
                  <TableCell>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">{formatDate(visit.date)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{visit.patientName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Stethoscope className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{visit.doctorName}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <div className="space-y-2">
                      <div>
                        <span className="text-xs font-medium text-muted-foreground">Triệu chứng:</span>
                        <p className="text-sm line-clamp-2">{visit.symptoms}</p>
                      </div>
                      <div>
                        <span className="text-xs font-medium text-muted-foreground">Chẩn đoán:</span>
                        <p className="text-sm font-medium line-clamp-2">{visit.diagnosis}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <div className="space-y-1">
                      {visit.prescriptions.length > 0 ? (
                        visit.prescriptions.map((prescription, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <Pill className="w-3 h-3 text-muted-foreground" />
                            <span>{prescription.medicine} - {prescription.dose}</span>
                          </div>
                        ))
                      ) : (
                        <span className="text-muted-foreground text-sm">Không có</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <span className="text-sm text-muted-foreground line-clamp-2">
                      {visit.notes || '-'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center gap-2 justify-end">
                      <Button variant="ghost" size="icon">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(visit)}>
                        <Edit className="w-4 h-4" />
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