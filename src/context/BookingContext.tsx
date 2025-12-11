import React, { createContext, useContext, useState, useEffect } from "react";

export interface BookingData {
  serviceType: "therapy" | "visit" | "part-time-pet" | "";
  selectedDate: Date | undefined;
  selectedTime: string;
  selectedAnimalId: string;
  specialRequirements: string;
  contactInfo: {
    name: string;
    email: string;
    phone: string;
  };
}

interface BookingContextType {
  bookingData: BookingData;
  updateBookingData: (data: Partial<BookingData>) => void;
  resetBooking: () => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  isBookingComplete: boolean;
  setIsBookingComplete: (complete: boolean) => void;
}

const initialBookingData: BookingData = {
  serviceType: "",
  selectedDate: undefined,
  selectedTime: "",
  selectedAnimalId: "",
  specialRequirements: "",
  contactInfo: {
    name: "",
    email: "",
    phone: "",
  },
};

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bookingData, setBookingData] = useState<BookingData>(() => {
    const saved = localStorage.getItem("bookingData");
    return saved ? JSON.parse(saved) : initialBookingData;
  });
  const [currentStep, setCurrentStep] = useState(() => {
    const saved = localStorage.getItem("bookingStep");
    return saved ? parseInt(saved) : 1;
  });
  const [isBookingComplete, setIsBookingComplete] = useState(false);

  useEffect(() => {
    localStorage.setItem("bookingData", JSON.stringify(bookingData));
  }, [bookingData]);

  useEffect(() => {
    localStorage.setItem("bookingStep", currentStep.toString());
  }, [currentStep]);

  const updateBookingData = (data: Partial<BookingData>) => {
    setBookingData((prev) => ({ ...prev, ...data }));
  };

  const resetBooking = () => {
    setBookingData(initialBookingData);
    setCurrentStep(1);
    setIsBookingComplete(false);
    localStorage.removeItem("bookingData");
    localStorage.removeItem("bookingStep");
  };

  return (
    <BookingContext.Provider
      value={{
        bookingData,
        updateBookingData,
        resetBooking,
        currentStep,
        setCurrentStep,
        isBookingComplete,
        setIsBookingComplete,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error("useBooking must be used within a BookingProvider");
  }
  return context;
};
