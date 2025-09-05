import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Send, 
  Bot, 
  User, 
  MessageCircle,
  RotateCcw,
  Stethoscope
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface Message {
  id: string;
  role: 'user' | 'bot';
  text: string;
  time: string;
}

const initialMessages: Message[] = [
  {
    id: '1',
    role: 'bot',
    text: 'Xin chào! Tôi là trợ lý ảo của phòng khám. Tôi có thể giúp bạn:\n\n• Tư vấn sức khỏe cơ bản\n• Hướng dẫn đặt lịch hẹn\n• Thông tin về các dịch vụ y tế\n• Giải đáp thắc mắc về thuốc\n\nBạn cần hỗ trợ gì hôm nay?',
    time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
  }
];

const botResponses = [
  'Cảm ơn bạn đã liên hệ. Tôi sẽ ghi nhận thông tin và bác sĩ sẽ tư vấn cho bạn sớm nhất.',
  'Đối với triệu chứng này, tôi khuyên bạn nên đến khám trực tiếp để được chẩn đoán chính xác.',
  'Bạn có thể đặt lịch hẹn qua hệ thống hoặc gọi hotline: 1900-xxx-xxx',
  'Vui lòng uống thuốc đúng liều lượng và thời gian theo chỉ định của bác sĩ.',
  'Tôi khuyên bạn nên theo dõi triệu chứng và đến khám nếu tình trạng không cải thiện.',
  'Đây là thông tin chỉ mang tính tham khảo. Vui lòng tham khảo ý kiến bác sĩ chuyên khoa.',
];

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Math.random().toString(36).substr(2, 9),
      role: 'user',
      text: inputValue.trim(),
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
      const botMessage: Message = {
        id: Math.random().toString(36).substr(2, 9),
        role: 'bot',
        text: randomResponse,
        time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleNewSession = () => {
    setMessages(initialMessages);
    toast({
      title: "Phiên chat mới",
      description: "Đã tạo phiên chat mới.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Chatbot tư vấn y tế</h1>
          <p className="text-muted-foreground">Trợ lý ảo hỗ trợ tư vấn sức khỏe 24/7</p>
        </div>
        <Button variant="outline" onClick={handleNewSession}>
          <RotateCcw className="w-4 h-4 mr-2" />
          Phiên chat mới
        </Button>
      </div>

      {/* Chat Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Chat Messages */}
        <div className="lg:col-span-3">
          <Card className="shadow-soft h-[600px] flex flex-col">
            <CardHeader className="bg-gradient-primary text-white rounded-t-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle className="text-white">Trợ lý y tế ClinicCare</CardTitle>
                  <CardDescription className="text-white/80">
                    Đang hoạt động • Phản hồi trung bình: 1-2 giây
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="flex-1 p-0">
              <ScrollArea className="h-full p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${
                        message.role === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      {message.role === 'bot' && (
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            <Bot className="w-4 h-4" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                      
                      <div
                        className={`max-w-[80%] rounded-lg px-4 py-2 ${
                          message.role === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        <div className="text-sm whitespace-pre-wrap">{message.text}</div>
                        <div className={`text-xs mt-1 ${
                          message.role === 'user' 
                            ? 'text-primary-foreground/70' 
                            : 'text-muted-foreground'
                        }`}>
                          {message.time}
                        </div>
                      </div>
                      
                      {message.role === 'user' && (
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-secondary text-secondary-foreground">
                            <User className="w-4 h-4" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="flex gap-3 justify-start">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          <Bot className="w-4 h-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="bg-muted rounded-lg px-4 py-2">
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div ref={messagesEndRef} />
              </ScrollArea>
            </CardContent>

            {/* Input Area */}
            <div className="border-t p-4">
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Nhập câu hỏi của bạn..."
                  className="flex-1"
                  disabled={isTyping}
                />
                <Button 
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isTyping}
                  size="icon"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-4">
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-primary" />
                Thông tin phiên chat
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm">
                <span className="font-medium">Người dùng:</span>
                <div className="text-muted-foreground">{user?.fullName}</div>
              </div>
              <div className="text-sm">
                <span className="font-medium">Vai trò:</span>
                <div className="text-muted-foreground">{user?.role}</div>
              </div>
              <div className="text-sm">
                <span className="font-medium">Số tin nhắn:</span>
                <div className="text-muted-foreground">{messages.length}</div>
              </div>
              <div className="text-sm">
                <span className="font-medium">Thời gian bắt đầu:</span>
                <div className="text-muted-foreground">
                  {new Date().toLocaleTimeString('vi-VN')}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="text-base">Gợi ý câu hỏi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                'Làm thế nào để đặt lịch hẹn?',
                'Triệu chứng đau đầu có nguy hiểm không?',
                'Thuốc paracetamol uống như thế nào?',
                'Khi nào cần đi khám gấp?',
                'Phòng khám có những chuyên khoa nào?'
              ].map((suggestion, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className="w-full text-left justify-start h-auto p-2 text-sm"
                  onClick={() => setInputValue(suggestion)}
                >
                  {suggestion}
                </Button>
              ))}
            </CardContent>
          </Card>

          <Card className="shadow-soft bg-warning/10 border-warning/20">
            <CardContent className="pt-6">
              <div className="text-sm space-y-2">
                <p className="font-medium text-warning-foreground">⚠️ Lưu ý quan trọng</p>
                <p className="text-warning-foreground/80">
                  Thông tin từ chatbot chỉ mang tính tham khảo. 
                  Vui lòng tham khảo ý kiến bác sĩ chuyên khoa để được chẩn đoán và điều trị chính xác.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}