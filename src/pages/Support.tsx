import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { 
  Heart, Gift, Calculator, Building2, Users, 
  DollarSign, Check, Star, TrendingUp, PawPrint,
  CreditCard, Lock, Loader2
} from "lucide-react";
import { animals, programStats, donationImpacts } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useCreateDonation, useDonationImpact } from "@/hooks/useDonations";
import { usePayment } from "@/hooks/usePayment";
import { useAuth } from "@/context/AuthContext";

const donationAmounts = [25, 50, 100, 250, 500, 1000];

const Support = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { mutateAsync: createDonation, isPending: isCreatingDonation } = useCreateDonation();
  const { data: donationImpactData } = useDonationImpact();
  const { initiatePayment, isProcessing } = usePayment();
  
  const [selectedAmount, setSelectedAmount] = useState<number | null>(100);
  const [customAmount, setCustomAmount] = useState("");
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringFrequency, setRecurringFrequency] = useState<"monthly" | "quarterly" | "yearly">("monthly");
  const [allocation, setAllocation] = useState("general");
  const [selectedAnimalId, setSelectedAnimalId] = useState("");
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");

  const actualAmount = selectedAmount || (customAmount ? parseInt(customAmount) : 0);
  
  const getImpact = (amount: number) => {
    const sortedImpacts = [...donationImpacts].sort((a, b) => b.amount - a.amount);
    return sortedImpacts.find(i => amount >= i.amount)?.impact || "Every dollar helps our animals";
  };

  const handleDonate = async () => {
    if (actualAmount < 5) {
      toast({
        title: "Minimum Donation",
        description: "Minimum donation amount is $5",
        variant: "destructive"
      });
      return;
    }

    // Validate email for guest donations
    if (!user && !donorEmail) {
      toast({
        title: "Email Required",
        description: "Please enter your email address to receive your donation receipt",
        variant: "destructive"
      });
      return;
    }

    try {
      // Create donation record first
      const donationRecord = await createDonation({
        amount: actualAmount,
        allocation: { 
          type: allocation, 
          id: allocation === "animal" ? selectedAnimalId : undefined 
        },
        recurring: isRecurring,
        recurringFrequency: isRecurring ? recurringFrequency : undefined,
        donorEmail: user?.email || donorEmail,
        donorName: donorName || undefined,
      });

      // Initiate PhonePe payment
      const result = await initiatePayment({
        amount: actualAmount,
        paymentType: "donation",
        metadata: {
          donationId: donationRecord.id,
          allocation: { type: allocation, id: selectedAnimalId || undefined },
          recurring: isRecurring,
          recurringFrequency: isRecurring ? recurringFrequency : undefined,
        },
      });

      if (!result.success) {
        throw new Error(result.error || "Payment initiation failed");
      }
    } catch (error: any) {
      console.error("Donation error:", error);
      toast({
        title: "Donation Error",
        description: error.message || "Unable to process donation. Please try again.",
        variant: "destructive"
      });
    }
  };

  const rehabilitationProgress = (programStats.rehabilitation.currentFunding / programStats.rehabilitation.fundingGoal) * 100;
  const isLoading = isCreatingDonation || isProcessing;

  // Use real donation impact data if available
  const totalRaised = donationImpactData?.total_raised || 0;
  const donorCount = donationImpactData?.donor_count || 0;

  return (
    <Layout>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-sand-light/30 section-padding">
        <div className="container-app">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Heart className="h-4 w-4" />
              <span>Support Our Mission</span>
            </div>
            <h1 className="font-heading text-4xl md:text-5xl font-bold mb-6">
              Help Us <span className="text-gradient">Heal More Lives</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Your generosity enables us to rescue, rehabilitate, and provide therapy services 
              to those who need it most. Every donation makes a difference.
            </p>
            {totalRaised > 0 && (
              <div className="mt-6 inline-flex items-center gap-4 px-6 py-3 bg-card rounded-full shadow-sm">
                <span className="text-2xl font-bold text-primary">${totalRaised.toLocaleString()}</span>
                <span className="text-muted-foreground">raised from {donorCount} donors</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main Donation Section */}
      <section className="section-padding bg-background">
        <div className="container-app">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Donation Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Gift className="h-5 w-5 text-primary" />
                    Make a Donation
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-8">
                  {/* Amount Selection */}
                  <div className="space-y-4">
                    <Label className="text-base font-semibold">Select Amount</Label>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                      {donationAmounts.map((amount) => (
                        <Button
                          key={amount}
                          variant={selectedAmount === amount ? "default" : "outline"}
                          onClick={() => {
                            setSelectedAmount(amount);
                            setCustomAmount("");
                          }}
                          className="h-14"
                        >
                          ${amount}
                        </Button>
                      ))}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="custom">Custom Amount</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="custom"
                          type="number"
                          value={customAmount}
                          onChange={(e) => {
                            setCustomAmount(e.target.value);
                            setSelectedAmount(null);
                          }}
                          placeholder="Enter amount"
                          className="pl-10"
                          min="5"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Impact Calculator */}
                  {actualAmount > 0 && (
                    <Card className="bg-primary/5 border-primary/20">
                      <CardContent className="p-4 flex items-center gap-4">
                        <Calculator className="h-8 w-8 text-primary flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-primary">Your Impact</p>
                          <p className="text-sm text-muted-foreground">
                            ${actualAmount} {getImpact(actualAmount)}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Guest Donor Info */}
                  {!user && (
                    <div className="space-y-4">
                      <Label className="text-base font-semibold">Your Information</Label>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="donorName">Name (optional)</Label>
                          <Input
                            id="donorName"
                            value={donorName}
                            onChange={(e) => setDonorName(e.target.value)}
                            placeholder="Your name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="donorEmail">Email *</Label>
                          <Input
                            id="donorEmail"
                            type="email"
                            value={donorEmail}
                            onChange={(e) => setDonorEmail(e.target.value)}
                            placeholder="your@email.com"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Recurring Donation */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base font-semibold">Make it Monthly</Label>
                        <p className="text-sm text-muted-foreground">
                          Recurring donations provide stable support
                        </p>
                      </div>
                      <Switch
                        checked={isRecurring}
                        onCheckedChange={setIsRecurring}
                      />
                    </div>
                    
                    {isRecurring && (
                      <Select value={recurringFrequency} onValueChange={(v) => setRecurringFrequency(v as any)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="quarterly">Quarterly</SelectItem>
                          <SelectItem value="yearly">Yearly</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </div>

                  {/* Allocation */}
                  <div className="space-y-4">
                    <Label className="text-base font-semibold">Donation Allocation</Label>
                    <Select value={allocation} onValueChange={setAllocation}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General Fund (Where needed most)</SelectItem>
                        <SelectItem value="rescue">Rescue Operations</SelectItem>
                        <SelectItem value="rehabilitation">Rehabilitation Program</SelectItem>
                        <SelectItem value="therapy">Therapy Services</SelectItem>
                        <SelectItem value="animal">Sponsor an Animal</SelectItem>
                      </SelectContent>
                    </Select>

                    {allocation === "animal" && (
                      <Select value={selectedAnimalId} onValueChange={setSelectedAnimalId}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an animal to sponsor" />
                        </SelectTrigger>
                        <SelectContent>
                          {animals.map((animal) => (
                            <SelectItem key={animal.id} value={animal.id}>
                              {animal.name} - {animal.breed}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>

                  {/* Submit Button */}
                  <Button 
                    onClick={handleDonate} 
                    size="lg" 
                    className="w-full gap-2"
                    disabled={actualAmount < 5 || isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard className="h-5 w-5" />
                        Donate ${actualAmount || 0} {isRecurring && `/ ${recurringFrequency.replace("ly", "")}`}
                      </>
                    )}
                  </Button>
                  
                  <p className="text-center text-xs text-muted-foreground flex items-center justify-center gap-1">
                    <Lock className="h-3 w-3" />
                    Secure payment processed by PhonePe
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Funding Goal */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-heading font-semibold">Rehabilitation Fund</h3>
                    <TrendingUp className="h-5 w-5 text-primary" />
                  </div>
                  <Progress value={rehabilitationProgress} className="h-3 mb-3" />
                  <div className="flex justify-between text-sm">
                    <span className="font-semibold text-primary">
                      ${programStats.rehabilitation.currentFunding.toLocaleString()}
                    </span>
                    <span className="text-muted-foreground">
                      of ${programStats.rehabilitation.fundingGoal.toLocaleString()} goal
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Why Donate */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-heading font-semibold mb-4">Your Support Funds</h3>
                  <ul className="space-y-3">
                    {[
                      "Medical care & surgeries",
                      "Food & supplies for 50+ animals",
                      "Therapy program operations",
                      "Facility maintenance",
                      "Staff & volunteer training"
                    ].map((item, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-primary flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Testimonial */}
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="h-4 w-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-sm italic mb-3">
                    "Knowing my monthly donation helps animals like Coco recover is 
                    incredibly rewarding. I feel connected to the mission."
                  </p>
                  <p className="text-sm font-semibold">— Lisa T., Monthly Donor</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Corporate Partnerships */}
      <section className="section-padding bg-card border-t">
        <div className="container-app">
          <div className="text-center mb-12">
            <Building2 className="h-12 w-12 text-primary mx-auto mb-4" />
            <h2 className="font-heading text-3xl font-bold mb-4">
              Corporate Partnerships
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Partner with Woo-Fur to make a lasting impact. We offer sponsorship 
              opportunities, employee engagement programs, and cause marketing partnerships.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              {
                icon: Gift,
                title: "Sponsorship",
                description: "Sponsor a program, event, or animal rehabilitation"
              },
              {
                icon: Users,
                title: "Employee Engagement",
                description: "Volunteer days and team-building activities"
              },
              {
                icon: PawPrint,
                title: "Cause Marketing",
                description: "Co-branded campaigns and product partnerships"
              }
            ].map((item, index) => (
              <Card key={index} className="text-center card-hover">
                <CardContent className="p-6">
                  <item.icon className="h-10 w-10 text-primary mx-auto mb-4" />
                  <h3 className="font-heading font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Button variant="outline" size="lg">
              Contact Us About Partnerships
            </Button>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="section-padding bg-background">
        <div className="container-app">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl font-bold mb-4">
              Your Donations at Work
            </h2>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { value: programStats.rescue.animalsRescued, label: "Animals Rescued", suffix: "+" },
              { value: programStats.therapy.sessionsCompleted, label: "Therapy Sessions", suffix: "+" },
              { value: programStats.rescue.successRate, label: "Adoption Success Rate", suffix: "%" },
              { value: programStats.rehabilitation.animalsHealed, label: "Animals Rehabilitated", suffix: "+" }
            ].map((stat, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <p className="font-heading text-4xl font-bold text-primary mb-2">
                    {stat.value}{stat.suffix}
                  </p>
                  <p className="text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Support;
