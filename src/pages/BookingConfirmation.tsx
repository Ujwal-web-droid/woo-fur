import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle, Calendar, Clock, MapPin, Phone, Mail, 
  Share2, Facebook, Twitter, CalendarPlus, Home, PawPrint 
} from "lucide-react";
import { format } from "date-fns";
import { useBooking } from "@/context/BookingContext";
import { useAnimals } from "@/hooks/useAnimals";
import { useToast } from "@/hooks/use-toast";

const serviceInfo = {
  therapy: { title: "Therapy Session", duration: "60 minutes" },
  visit: { title: "Facility Visit", duration: "45 minutes" },
  "part-time-pet": { title: "Part-time Pet", duration: "Weekend" },
};

const preparationChecklist = [
  "Wear comfortable, casual clothing",
  "Avoid strong perfumes or scents",
  "Arrive 10 minutes early for check-in",
  "Bring a valid photo ID",
  "Turn off or silence your phone",
  "Inform staff of any allergies",
];

const BookingConfirmation = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { bookingData, isBookingComplete, resetBooking } = useBooking();
  const { data: animals = [] } = useAnimals();

  const selectedAnimal = animals.find(a => a.id === bookingData.selectedAnimalId);
  const service = bookingData.serviceType ? serviceInfo[bookingData.serviceType] : null;

  useEffect(() => {
    if (!isBookingComplete) {
      navigate("/booking");
    }
  }, [isBookingComplete, navigate]);

  const handleAddToCalendar = () => {
    if (!bookingData.selectedDate) return;
    
    const startDate = new Date(bookingData.selectedDate);
    const [time, period] = bookingData.selectedTime.split(" ");
    const [hours, minutes] = time.split(":");
    let hour = parseInt(hours);
    if (period === "PM" && hour !== 12) hour += 12;
    if (period === "AM" && hour === 12) hour = 0;
    startDate.setHours(hour, parseInt(minutes));

    const endDate = new Date(startDate);
    endDate.setHours(endDate.getHours() + 1);

    const event = {
      title: `Woo-Fur ${service?.title}${selectedAnimal ? ` with ${selectedAnimal.name}` : ""}`,
      start: startDate.toISOString().replace(/-|:|\.\d+/g, ""),
      end: endDate.toISOString().replace(/-|:|\.\d+/g, ""),
      location: "123 Healing Paws Lane, Sanctuary Valley, CA 94123",
      description: "Your booking at Woo-Fur Animal Therapy Center",
    };

    const googleCalendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${event.start}/${event.end}&location=${encodeURIComponent(event.location)}&details=${encodeURIComponent(event.description)}`;
    
    window.open(googleCalendarUrl, "_blank");
    toast({
      title: "Calendar Event",
      description: "Opening Google Calendar...",
    });
  };

  const handleShare = (platform: string) => {
    const shareText = `I just booked a ${service?.title} at Woo-Fur! 🐾`;
    const shareUrl = window.location.origin;
    
    let url = "";
    switch (platform) {
      case "facebook":
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`;
        break;
      case "twitter":
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
        break;
      default:
        if (navigator.share) {
          navigator.share({ title: "Woo-Fur Booking", text: shareText, url: shareUrl });
          return;
        }
    }
    if (url) window.open(url, "_blank", "width=600,height=400");
  };

  const handleNewBooking = () => {
    resetBooking();
    navigate("/booking");
  };

  if (!isBookingComplete) {
    return null;
  }

  return (
    <Layout>
      <section className="section-padding bg-gradient-to-b from-sand-light/30 to-background">
        <div className="container-app">
          <div className="max-w-3xl mx-auto">
            {/* Success Header */}
            <div className="text-center mb-8 animate-fade-in">
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
              <h1 className="font-heading text-3xl md:text-4xl font-bold mb-4">
                Booking Confirmed!
              </h1>
              <p className="text-lg text-muted-foreground">
                We're excited to see you! A confirmation email has been sent to{" "}
                <span className="font-semibold text-foreground">
                  {bookingData.contactInfo.email}
                </span>
              </p>
            </div>

            {/* Booking Details */}
            <Card className="mb-8 animate-fade-in animation-delay-100">
              <CardContent className="p-6">
                <h2 className="font-heading text-xl font-semibold mb-6">
                  Booking Details
                </h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <PawPrint className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Service</p>
                        <p className="font-semibold">{service?.title}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Calendar className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Date</p>
                        <p className="font-semibold">
                          {bookingData.selectedDate
                            ? format(new Date(bookingData.selectedDate), "EEEE, MMMM d, yyyy")
                            : "N/A"}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Time</p>
                        <p className="font-semibold">
                          {bookingData.selectedTime} ({service?.duration})
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Location</p>
                        <p className="font-semibold">Woo-Fur Animal Therapy Center</p>
                        <p className="text-sm text-muted-foreground">
                          123 Healing Paws Lane, Sanctuary Valley, CA
                        </p>
                      </div>
                    </div>
                    
                    {selectedAnimal && (
                      <div className="flex items-start gap-3">
                        <img
                          src={selectedAnimal.image}
                          alt={selectedAnimal.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                          <p className="text-sm text-muted-foreground">Your Animal Companion</p>
                          <p className="font-semibold">{selectedAnimal.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {selectedAnimal.breed}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t">
                  <Button variant="outline" onClick={handleAddToCalendar} className="gap-2">
                    <CalendarPlus className="h-4 w-4" />
                    Add to Calendar
                  </Button>
                  <Button variant="outline" onClick={() => handleShare("default")} className="gap-2">
                    <Share2 className="h-4 w-4" />
                    Share
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleShare("facebook")}>
                    <Facebook className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleShare("twitter")}>
                    <Twitter className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Preparation Checklist */}
            <Card className="mb-8 animate-fade-in animation-delay-200">
              <CardContent className="p-6">
                <h2 className="font-heading text-xl font-semibold mb-4">
                  Preparation Checklist
                </h2>
                <ul className="space-y-3">
                  {preparationChecklist.map((item, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 text-primary" />
                      </div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Contact & Modification */}
            <Card className="mb-8 animate-fade-in animation-delay-300">
              <CardContent className="p-6">
                <h2 className="font-heading text-xl font-semibold mb-4">
                  Need to Make Changes?
                </h2>
                <p className="text-muted-foreground mb-4">
                  Contact us at least 24 hours before your appointment to modify or cancel.
                </p>
                <div className="flex flex-wrap gap-4">
                  <a
                    href="tel:+15551234567"
                    className="flex items-center gap-2 text-primary hover:underline"
                  >
                    <Phone className="h-4 w-4" />
                    (555) 123-4567
                  </a>
                  <a
                    href="mailto:bookings@woofur.org"
                    className="flex items-center gap-2 text-primary hover:underline"
                  >
                    <Mail className="h-4 w-4" />
                    bookings@woofur.org
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in animation-delay-400">
              <Button onClick={handleNewBooking} variant="outline" className="gap-2">
                <Calendar className="h-4 w-4" />
                Book Another Session
              </Button>
              <Button asChild>
                <Link to="/" className="gap-2">
                  <Home className="h-4 w-4" />
                  Return Home
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default BookingConfirmation;
