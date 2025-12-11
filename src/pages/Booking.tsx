import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { 
  CalendarIcon, Heart, Clock, Users, PawPrint, 
  ChevronRight, ChevronLeft, Check, Sparkles 
} from "lucide-react";
import { animals, timeSlots } from "@/data/mockData";
import { useBooking } from "@/context/BookingContext";
import { useToast } from "@/hooks/use-toast";

const serviceTypes = [
  {
    id: "therapy",
    title: "Therapy Session",
    description: "One-on-one or group sessions with certified therapy animals",
    icon: Heart,
    duration: "60 min",
    price: "$75"
  },
  {
    id: "visit",
    title: "Facility Visit",
    description: "Tour our facility and meet our resident animals",
    icon: Users,
    duration: "45 min",
    price: "Free"
  },
  {
    id: "part-time-pet",
    title: "Part-time Pet",
    description: "Take a companion animal home for a weekend",
    icon: PawPrint,
    duration: "Weekend",
    price: "$50"
  }
];

const steps = [
  { id: 1, title: "Service Type" },
  { id: 2, title: "Date & Time" },
  { id: 3, title: "Animal Selection" },
  { id: 4, title: "Your Details" },
  { id: 5, title: "Review" },
];

const Booking = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { bookingData, updateBookingData, currentStep, setCurrentStep, setIsBookingComplete } = useBooking();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const therapyAnimals = animals.filter(
    a => a.status === "Therapy Certified" || a.status === "Part-time Pet"
  );

  const handleServiceSelect = (serviceId: string) => {
    updateBookingData({ serviceType: serviceId as "therapy" | "visit" | "part-time-pet" });
  };

  const handleDateSelect = (date: Date | undefined) => {
    updateBookingData({ selectedDate: date });
  };

  const handleTimeSelect = (time: string) => {
    updateBookingData({ selectedTime: time });
  };

  const handleAnimalSelect = (animalId: string) => {
    updateBookingData({ selectedAnimalId: animalId });
  };

  const handleContactChange = (field: string, value: string) => {
    updateBookingData({
      contactInfo: { ...bookingData.contactInfo, [field]: value }
    });
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return !!bookingData.serviceType;
      case 2:
        return !!bookingData.selectedDate && !!bookingData.selectedTime;
      case 3:
        return bookingData.serviceType === "visit" || !!bookingData.selectedAnimalId;
      case 4:
        return (
          !!bookingData.contactInfo.name &&
          !!bookingData.contactInfo.email &&
          !!bookingData.contactInfo.phone
        );
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (canProceed() && currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsBookingComplete(true);
    toast({
      title: "Booking Confirmed!",
      description: "You'll receive a confirmation email shortly.",
    });
    
    navigate("/booking/confirmation");
    setIsSubmitting(false);
  };

  const selectedService = serviceTypes.find(s => s.id === bookingData.serviceType);
  const selectedAnimal = animals.find(a => a.id === bookingData.selectedAnimalId);

  return (
    <Layout>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-sand-light/50 via-background to-beige section-padding">
        <div className="container-app">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Sparkles className="h-4 w-4" />
              <span>Book Your Experience</span>
            </div>
            <h1 className="font-heading text-4xl md:text-5xl font-bold mb-6">
              Schedule Your <span className="text-gradient">Healing Session</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Choose a service, pick a date, and let us connect you with the perfect animal companion.
            </p>
          </div>
        </div>
      </section>

      {/* Progress Steps */}
      <section className="border-b bg-card">
        <div className="container-app py-6">
          <div className="flex items-center justify-between max-w-3xl mx-auto">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all",
                      currentStep > step.id
                        ? "bg-primary text-primary-foreground"
                        : currentStep === step.id
                        ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {currentStep > step.id ? <Check className="h-5 w-5" /> : step.id}
                  </div>
                  <span className="text-xs mt-2 hidden sm:block text-muted-foreground">
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      "w-12 sm:w-24 h-1 mx-2",
                      currentStep > step.id ? "bg-primary" : "bg-muted"
                    )}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form Content */}
      <section className="section-padding bg-background">
        <div className="container-app">
          <div className="max-w-4xl mx-auto">
            {/* Step 1: Service Type */}
            {currentStep === 1 && (
              <div className="animate-fade-in">
                <h2 className="font-heading text-2xl font-bold mb-6 text-center">
                  Choose Your Experience
                </h2>
                <div className="grid md:grid-cols-3 gap-6">
                  {serviceTypes.map((service) => {
                    const Icon = service.icon;
                    return (
                      <Card
                        key={service.id}
                        className={cn(
                          "cursor-pointer transition-all hover:shadow-elevated",
                          bookingData.serviceType === service.id
                            ? "ring-2 ring-primary bg-primary/5"
                            : "hover:bg-muted/50"
                        )}
                        onClick={() => handleServiceSelect(service.id)}
                      >
                        <CardContent className="p-6 text-center">
                          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                            <Icon className="h-8 w-8 text-primary" />
                          </div>
                          <h3 className="font-heading font-semibold text-lg mb-2">
                            {service.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            {service.description}
                          </p>
                          <div className="flex justify-center gap-4 text-sm">
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" /> {service.duration}
                            </span>
                            <span className="font-semibold text-primary">
                              {service.price}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 2: Date & Time */}
            {currentStep === 2 && (
              <div className="animate-fade-in">
                <h2 className="font-heading text-2xl font-bold mb-6 text-center">
                  Select Date & Time
                </h2>
                <div className="grid md:grid-cols-2 gap-8">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Pick a Date</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Calendar
                        mode="single"
                        selected={bookingData.selectedDate}
                        onSelect={handleDateSelect}
                        disabled={(date) => date < new Date() || date.getDay() === 0}
                        className="rounded-md border pointer-events-auto"
                      />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Available Times</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-3">
                        {timeSlots.map((slot) => (
                          <Button
                            key={slot.id}
                            variant={bookingData.selectedTime === slot.time ? "default" : "outline"}
                            disabled={!slot.available}
                            onClick={() => handleTimeSelect(slot.time)}
                            className="h-12"
                          >
                            {slot.time}
                          </Button>
                        ))}
                      </div>
                      {bookingData.selectedDate && bookingData.selectedTime && (
                        <p className="mt-4 text-sm text-muted-foreground text-center">
                          Selected: {format(bookingData.selectedDate, "MMMM d, yyyy")} at{" "}
                          {bookingData.selectedTime}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* Step 3: Animal Selection */}
            {currentStep === 3 && (
              <div className="animate-fade-in">
                <h2 className="font-heading text-2xl font-bold mb-6 text-center">
                  {bookingData.serviceType === "visit" 
                    ? "You'll Meet All Our Animals!" 
                    : "Choose Your Animal Companion"}
                </h2>
                
                {bookingData.serviceType === "visit" ? (
                  <Card className="max-w-md mx-auto">
                    <CardContent className="p-8 text-center">
                      <PawPrint className="h-16 w-16 text-primary mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        During your facility visit, you'll have the opportunity to meet 
                        all our wonderful resident animals!
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {therapyAnimals.map((animal) => (
                      <Card
                        key={animal.id}
                        className={cn(
                          "cursor-pointer transition-all overflow-hidden",
                          bookingData.selectedAnimalId === animal.id
                            ? "ring-2 ring-primary"
                            : "hover:shadow-elevated"
                        )}
                        onClick={() => handleAnimalSelect(animal.id)}
                      >
                        <div className="aspect-square overflow-hidden">
                          <img
                            src={animal.image}
                            alt={animal.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-heading font-semibold">{animal.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {animal.breed} • {animal.age}
                          </p>
                          <span className="inline-block mt-2 text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                            {animal.status}
                          </span>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Step 4: Contact Details */}
            {currentStep === 4 && (
              <div className="animate-fade-in max-w-xl mx-auto">
                <h2 className="font-heading text-2xl font-bold mb-6 text-center">
                  Your Contact Information
                </h2>
                <Card>
                  <CardContent className="p-6 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={bookingData.contactInfo.name}
                        onChange={(e) => handleContactChange("name", e.target.value)}
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={bookingData.contactInfo.email}
                        onChange={(e) => handleContactChange("email", e.target.value)}
                        placeholder="your@email.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={bookingData.contactInfo.phone}
                        onChange={(e) => handleContactChange("phone", e.target.value)}
                        placeholder="(555) 123-4567"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="requirements">
                        Special Requirements 
                        <span className="text-muted-foreground ml-1">
                          ({bookingData.specialRequirements.length}/500)
                        </span>
                      </Label>
                      <Textarea
                        id="requirements"
                        value={bookingData.specialRequirements}
                        onChange={(e) => 
                          updateBookingData({ specialRequirements: e.target.value.slice(0, 500) })
                        }
                        placeholder="Any allergies, accessibility needs, or preferences..."
                        rows={4}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Step 5: Review */}
            {currentStep === 5 && (
              <div className="animate-fade-in max-w-xl mx-auto">
                <h2 className="font-heading text-2xl font-bold mb-6 text-center">
                  Review Your Booking
                </h2>
                <Card>
                  <CardContent className="p-6 space-y-6">
                    <div className="flex justify-between items-center py-3 border-b">
                      <span className="text-muted-foreground">Service</span>
                      <span className="font-semibold">{selectedService?.title}</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b">
                      <span className="text-muted-foreground">Date</span>
                      <span className="font-semibold">
                        {bookingData.selectedDate
                          ? format(bookingData.selectedDate, "MMMM d, yyyy")
                          : "Not selected"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b">
                      <span className="text-muted-foreground">Time</span>
                      <span className="font-semibold">{bookingData.selectedTime}</span>
                    </div>
                    {selectedAnimal && (
                      <div className="flex justify-between items-center py-3 border-b">
                        <span className="text-muted-foreground">Animal</span>
                        <div className="flex items-center gap-2">
                          <img
                            src={selectedAnimal.image}
                            alt={selectedAnimal.name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <span className="font-semibold">{selectedAnimal.name}</span>
                        </div>
                      </div>
                    )}
                    <div className="flex justify-between items-center py-3 border-b">
                      <span className="text-muted-foreground">Contact</span>
                      <div className="text-right">
                        <p className="font-semibold">{bookingData.contactInfo.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {bookingData.contactInfo.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center py-3">
                      <span className="text-muted-foreground">Total</span>
                      <span className="text-2xl font-bold text-primary">
                        {selectedService?.price}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 1}
                className="gap-2"
              >
                <ChevronLeft className="h-4 w-4" /> Back
              </Button>
              
              {currentStep < 5 ? (
                <Button
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className="gap-2"
                >
                  Next <ChevronRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="gap-2"
                >
                  {isSubmitting ? "Confirming..." : "Confirm Booking"}
                  <Check className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Booking;
