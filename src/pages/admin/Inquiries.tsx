import { useState, useEffect } from "react";
import axios from "@/lib/axios";
import { useNavigate } from "react-router-dom";
import AdminLayout from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  MessageSquare, 
  Search, 
  MoreHorizontal,
  Eye,
  Mail,
  CheckCircle,
  Trash2,
  Filter,
  Clock,
  AlertCircle,
  Phone,
  Send,
  User,
  Calendar,
  X,
  Reply
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Inquiry {
  id: number;
  name: string;
  email: string;
  phone: string;
  subject: string;
  inquiry_type: string;
  message: string;
  status: string;
  created_at: string;
}

export default function Inquiries() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  
  // Dialogs
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isReplyDialogOpen, setIsReplyDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [viewingInquiry, setViewingInquiry] = useState<Inquiry | null>(null);
  const [replyingInquiry, setReplyingInquiry] = useState<Inquiry | null>(null);
  const [deletingInquiry, setDeletingInquiry] = useState<Inquiry | null>(null);
  
  // Reply form
  const [replyMessage, setReplyMessage] = useState("");
  const [replyMethod, setReplyMethod] = useState<"email" | "sms">("email");
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await axios.get("/api/user");
        setUser(userResponse.data);

        const inquiriesResponse = await axios.get("/api/admin/inquiries");
        setInquiries(inquiriesResponse.data?.data || inquiriesResponse.data || []);
      } catch (error) {
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  const handleMarkAsRead = async (id: number) => {
    try {
      await axios.post(`/api/admin/inquiries/${id}/read`);
      setInquiries(inquiries.map(i => i.id === id ? { ...i, status: 'read' } : i));
    } catch (error) {
      console.error("Failed to mark inquiry as read:", error);
    }
  };

  const handleView = (inquiry: Inquiry) => {
    setViewingInquiry(inquiry);
    setIsViewDialogOpen(true);
    // Auto mark as read when viewing
    if (inquiry.status === 'new') {
      handleMarkAsRead(inquiry.id);
    }
  };

  const handleReply = (inquiry: Inquiry) => {
    setReplyingInquiry(inquiry);
    setReplyMessage("");
    setReplyMethod("email");
    setIsReplyDialogOpen(true);
  };

  const handleSendReply = async () => {
    if (!replyingInquiry || !replyMessage.trim()) return;
    
    setSending(true);
    try {
      await axios.post(`/api/admin/inquiries/${replyingInquiry.id}/reply`, {
        message: replyMessage,
        method: replyMethod
      });
      
      // Update status to replied
      setInquiries(inquiries.map(i => 
        i.id === replyingInquiry.id ? { ...i, status: 'replied' } : i
      ));
      
      setIsReplyDialogOpen(false);
      setReplyingInquiry(null);
      setReplyMessage("");
    } catch (error) {
      console.error("Failed to send reply:", error);
    } finally {
      setSending(false);
    }
  };

  const handleDeleteClick = (inquiry: Inquiry) => {
    setDeletingInquiry(inquiry);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingInquiry) return;
    try {
      await axios.delete(`/api/admin/inquiries/${deletingInquiry.id}`);
      setInquiries(inquiries.filter(i => i.id !== deletingInquiry.id));
      setIsDeleteDialogOpen(false);
      setDeletingInquiry(null);
    } catch (error) {
      console.error("Failed to delete inquiry:", error);
    }
  };

  const filteredInquiries = inquiries.filter(inquiry => {
    const matchesSearch = inquiry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inquiry.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inquiry.subject?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || inquiry.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const newInquiries = inquiries.filter(i => i.status === "new").length;
  const readInquiries = inquiries.filter(i => i.status === "read").length;
  const repliedInquiries = inquiries.filter(i => i.status === "replied").length;

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      new: "bg-red-100 text-red-700",
      read: "bg-yellow-100 text-yellow-700",
      replied: "bg-green-100 text-green-700",
    };
    return styles[status] || "bg-gray-100 text-gray-600";
  };

  const getInquiryTypeBadge = (type: string) => {
    const styles: Record<string, string> = {
      "Safari Booking": "bg-green-100 text-green-700",
      "Kilimanjaro": "bg-purple-100 text-purple-700",
      "Day Trip": "bg-blue-100 text-blue-700",
      "General Inquiry": "bg-gray-100 text-gray-700",
      "Custom Safari": "bg-orange-100 text-orange-700",
    };
    return styles[type] || "bg-gray-100 text-gray-600";
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex h-[60vh] items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-orange-200 border-t-orange-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout user={user}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inquiries</h1>
          <p className="text-gray-500">Manage customer inquiries and messages</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <MessageSquare className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{inquiries.length}</p>
                <p className="text-xs text-gray-500">Total Inquiries</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm cursor-pointer hover:shadow-md transition-shadow" onClick={() => setStatusFilter("new")}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-50 rounded-lg">
                <AlertCircle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{newInquiries}</p>
                <p className="text-xs text-gray-500">New</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm cursor-pointer hover:shadow-md transition-shadow" onClick={() => setStatusFilter("read")}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-50 rounded-lg">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{readInquiries}</p>
                <p className="text-xs text-gray-500">Pending Reply</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm cursor-pointer hover:shadow-md transition-shadow" onClick={() => setStatusFilter("replied")}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{repliedInquiries}</p>
                <p className="text-xs text-gray-500">Replied</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search inquiries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Filter status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="read">Pending</SelectItem>
                  <SelectItem value="replied">Replied</SelectItem>
                </SelectContent>
              </Select>
              {statusFilter !== "all" && (
                <Button variant="ghost" size="sm" onClick={() => setStatusFilter("all")}>
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Received</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInquiries.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    No inquiries found
                  </TableCell>
                </TableRow>
              ) : (
                filteredInquiries.map((inquiry) => (
                  <TableRow key={inquiry.id} className={`hover:bg-gray-50 ${inquiry.status === 'new' ? 'bg-red-50/50' : ''}`}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                          <User className="h-5 w-5 text-orange-600" />
                        </div>
                        <div>
                          <p className="font-medium">{inquiry.name}</p>
                          <p className="text-xs text-gray-500">{inquiry.email}</p>
                          <p className="text-xs text-gray-400">{inquiry.phone}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getInquiryTypeBadge(inquiry.inquiry_type || 'General Inquiry')}>
                        {inquiry.inquiry_type || 'General'}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <p className="text-sm text-gray-500 truncate">{inquiry.message}</p>
                      {inquiry.subject && (
                        <p className="text-xs text-gray-400 mt-1">{inquiry.subject}</p>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusBadge(inquiry.status)}>
                        {inquiry.status === 'new' ? 'New' : inquiry.status === 'read' ? 'Pending' : 'Replied'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-500 text-sm">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {getTimeAgo(inquiry.created_at)}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button size="sm" variant="ghost" onClick={() => handleView(inquiry)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleReply(inquiry)}>
                          <Reply className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleView(inquiry)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleReply(inquiry)}>
                              <Mail className="h-4 w-4 mr-2" />
                              Reply via Email/SMS
                            </DropdownMenuItem>
                            {inquiry.status !== 'read' && inquiry.status !== 'replied' && (
                              <DropdownMenuItem onClick={() => handleMarkAsRead(inquiry.id)}>
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Mark as Read
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteClick(inquiry)}>
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-orange-600" />
              Inquiry Details
            </DialogTitle>
          </DialogHeader>
          
          {viewingInquiry && (
            <div className="space-y-4">
              {/* Customer Info */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-full bg-orange-100 flex items-center justify-center">
                    <User className="h-7 w-7 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-lg font-semibold">{viewingInquiry.name}</p>
                    <div className="flex flex-wrap gap-3 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Mail className="h-3 w-3" /> {viewingInquiry.email}
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3" /> {viewingInquiry.phone}
                      </span>
                    </div>
                  </div>
                  <Badge className={getStatusBadge(viewingInquiry.status)}>
                    {viewingInquiry.status}
                  </Badge>
                </div>
              </div>

              {/* Inquiry Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-gray-500">Inquiry Type</Label>
                  <Badge className={getInquiryTypeBadge(viewingInquiry.inquiry_type || 'General')}>
                    {viewingInquiry.inquiry_type || 'General Inquiry'}
                  </Badge>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Received</Label>
                  <p className="text-sm">{new Date(viewingInquiry.created_at).toLocaleString()}</p>
                </div>
              </div>

              {/* Subject */}
              {viewingInquiry.subject && (
                <div>
                  <Label className="text-xs text-gray-500">Subject</Label>
                  <p className="font-medium">{viewingInquiry.subject}</p>
                </div>
              )}

              {/* Message */}
              <div>
                <Label className="text-xs text-gray-500">Message</Label>
                <div className="bg-orange-50 p-4 rounded-lg mt-1">
                  <p className="text-gray-700 whitespace-pre-wrap">{viewingInquiry.message}</p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Close
            </Button>
            <Button variant="outline" onClick={() => {
              setIsViewDialogOpen(false);
              handleReply(viewingInquiry!);
            }}>
              <Reply className="h-4 w-4 mr-2" />
              Reply
            </Button>
            <Button className="bg-orange-600 hover:bg-orange-700" onClick={() => {
              setIsViewDialogOpen(false);
              handleReply(viewingInquiry!);
            }}>
              <Send className="h-4 w-4 mr-2" />
              Send SMS/Email
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reply Dialog */}
      <Dialog open={isReplyDialogOpen} onOpenChange={setIsReplyDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Reply to Inquiry</DialogTitle>
            <DialogDescription>
              Send a response to {replyingInquiry?.name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Customer Info */}
            <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
              <User className="h-5 w-5 text-gray-400" />
              <div className="flex-1">
                <p className="font-medium">{replyingInquiry?.name}</p>
                <p className="text-xs text-gray-500">{replyingInquiry?.email}</p>
                <p className="text-xs text-gray-500">{replyingInquiry?.phone}</p>
              </div>
            </div>

            {/* Method Selection */}
            <div className="space-y-2">
              <Label>Send Method</Label>
              <div className="flex gap-2">
                <Button
                  variant={replyMethod === 'email' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setReplyMethod('email')}
                  className={replyMethod === 'email' ? 'bg-orange-600 hover:bg-orange-700' : ''}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Email
                </Button>
                <Button
                  variant={replyMethod === 'sms' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setReplyMethod('sms')}
                  className={replyMethod === 'sms' ? 'bg-orange-600 hover:bg-orange-700' : ''}
                >
                  <Phone className="h-4 w-4 mr-2" />
                  SMS
                </Button>
              </div>
            </div>

            {/* Message */}
            <div className="space-y-2">
              <Label>Message</Label>
              <Textarea
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                placeholder={replyMethod === 'sms' 
                  ? "Type your SMS message (max 160 characters)..." 
                  : "Type your email response..."
                }
                rows={5}
                maxLength={replyMethod === 'sms' ? 160 : undefined}
              />
              {replyMethod === 'sms' && (
                <p className="text-xs text-gray-400 text-right">
                  {replyMessage.length}/160
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReplyDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              className="bg-orange-600 hover:bg-orange-700" 
              onClick={handleSendReply}
              disabled={!replyMessage.trim() || sending}
            >
              <Send className="h-4 w-4 mr-2" />
              {sending ? 'Sending...' : `Send ${replyMethod.toUpperCase()}`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Inquiry</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the inquiry from "{deletingInquiry?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={handleConfirmDelete}>
              Delete Inquiry
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
