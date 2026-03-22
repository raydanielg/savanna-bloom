import { useState } from "react";
import axios from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, Users, Mail, Phone, User, CreditCard, CheckCircle } from "lucide-react";

interface Package {
  id: number;
  name: string;
  price: number;
  discount_price: number | null;
  duration_days: number;
  duration_nights: number;
  min_guests: number;
  max_guests: number;
}

interface BookingFormProps {
  isOpen: boolean;
  onClose: () => void;
  packageData: Package | null;
}

export default function BookingForm({ isOpen, onClose, packageData }: BookingFormProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    start_date: "",
    number_of_guests: 1,
    special_requests: "",
    payment_method: "full",
  });

  const effectivePrice = packageData?.discount_price || packageData?.price || 0;
  const totalPrice = effectivePrice * formData.number_of_guests;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!packageData) return;

    setLoading(true);
    try {
      await axios.post("/api/bookings", {
        bookable_type: "Package",
        bookable_id: packageData.id,
        ...formData,
        total_amount: totalPrice,
        total_guests: formData.number_of_guests,
        status: "pending",
        payment_status: "unpaid",
      });

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
        setFormData({
          customer_name: "",
          customer_email: "",
          customer_phone: "",
          start_date: "",
          number_of_guests: 1,
          special_requests: "",
          payment_method: "full",
        });
      }, 2000);
    } catch (error) {
      console.error("Booking failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGuestChange = (value: string) => {
    const guests = parseInt(value);
    if (packageData && guests >= packageData.min_guests && guests <= packageData.max_guests) {
      setFormData({ ...formData, number_of_guests: guests });
    }
  };

  if (!packageData) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Book {packageData.name}</DialogTitle>
          <DialogDescription>
            Complete the form below to book this safari package.
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="flex flex-col items-center justify-center py-8">
            <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
            <h3 className="text-xl font-semibold text-green-600">Booking Successful!</h3>
            <p className="text-gray-500 mt-2">We'll contact you shortly with confirmation details.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              {/* Package Summary */}
              <div className="bg-orange-50 rounded-lg p-4 mb-2">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600">Duration</p>
                    <p className="font-medium">{packageData.duration_days} Days, {packageData.duration_nights} Nights</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Price per person</p>
                    {packageData.discount_price ? (
                      <div>
                        <span className="font-bold text-green-600">${packageData.discount_price.toLocaleString()}</span>
                        <span className="text-sm text-gray-400 line-through ml-2">${packageData.price.toLocaleString()}</span>
                      </div>
                    ) : (
                      <p className="font-bold">${packageData.price.toLocaleString()}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Customer Details */}
              <div className="space-y-4">
                <h4 className="font-medium flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Customer Details
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="customer_name">Full Name *</Label>
                    <Input
                      id="customer_name"
                      value={formData.customer_name}
                      onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                      placeholder="John Smith"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customer_phone">Phone *</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="customer_phone"
                        value={formData.customer_phone}
                        onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
                        placeholder="+1 234 567 890"
                        className="pl-9"
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customer_email">Email *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="customer_email"
                      type="email"
                      value={formData.customer_email}
                      onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
                      placeholder="john@example.com"
                      className="pl-9"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Booking Details */}
              <div className="space-y-4">
                <h4 className="font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Booking Details
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start_date">Start Date *</Label>
                    <Input
                      id="start_date"
                      type="date"
                      value={formData.start_date}
                      onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="guests">Number of Guests *</Label>
                    <Select
                      value={formData.number_of_guests.toString()}
                      onValueChange={handleGuestChange}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from(
                          { length: packageData.max_guests - packageData.min_guests + 1 },
                          (_, i) => i + packageData.min_guests
                        ).map((n) => (
                          <SelectItem key={n} value={n.toString()}>
                            {n} {n === 1 ? 'Guest' : 'Guests'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Special Requests */}
              <div className="space-y-2">
                <Label htmlFor="special_requests">Special Requests</Label>
                <Textarea
                  id="special_requests"
                  value={formData.special_requests}
                  onChange={(e) => setFormData({ ...formData, special_requests: e.target.value })}
                  placeholder="Any dietary requirements, accessibility needs, or special occasions..."
                  rows={3}
                />
              </div>

              {/* Payment Method */}
              <div className="space-y-2">
                <Label>Payment Method</Label>
                <Select
                  value={formData.payment_method}
                  onValueChange={(value) => setFormData({ ...formData, payment_method: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full">Pay Full Amount Now</SelectItem>
                    <SelectItem value="deposit">Pay 30% Deposit</SelectItem>
                    <SelectItem value="later">Pay Later</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Total */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Amount</span>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-orange-600">${totalPrice.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">
                      {formData.number_of_guests} {formData.number_of_guests === 1 ? 'guest' : 'guests'} × ${effectivePrice.toLocaleString()}
                    </p>
                  </div>
                </div>
                {formData.payment_method === 'deposit' && (
                  <div className="mt-2 pt-2 border-t">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Deposit (30%)</span>
                      <span className="font-medium text-green-600">${(totalPrice * 0.3).toLocaleString()}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" className="bg-orange-600 hover:bg-orange-700" disabled={loading}>
                {loading ? "Processing..." : "Confirm Booking"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
