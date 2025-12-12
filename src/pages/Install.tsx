import React from "react";
import { Download, Smartphone, Check, ArrowRight, Wifi, Bell, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { usePWA } from "@/hooks/usePWA";
import { useNotifications } from "@/hooks/useNotifications";
import { Layout } from "@/components/layout/Layout";

const Install: React.FC = () => {
  const { isInstallable, isInstalled, promptInstall } = usePWA();
  const { permission, requestPermission, isSupported: notificationsSupported } = useNotifications();

  const features = [
    {
      icon: Clock,
      title: "Quick Access",
      description: "Launch Woo-Fur instantly from your home screen",
    },
    {
      icon: Wifi,
      title: "Offline Access",
      description: "Browse animals and view bookings even without internet",
    },
    {
      icon: Bell,
      title: "Notifications",
      description: "Get reminders for appointments and updates on your favorite animals",
    },
  ];

  const installSteps = [
    { step: 1, text: "Tap the share button in your browser" },
    { step: 2, text: 'Select "Add to Home Screen"' },
    { step: 3, text: 'Tap "Add" to install' },
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-4">
              <Smartphone className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Install Woo-Fur</h1>
            <p className="text-muted-foreground">
              Get the full app experience on your device
            </p>
          </div>

          {/* Status Card */}
          {isInstalled ? (
            <Card className="mb-8 border-green-500/20 bg-green-50 dark:bg-green-950/20">
              <CardContent className="p-6 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-green-500/10 rounded-full mb-3">
                  <Check className="h-6 w-6 text-green-600" />
                </div>
                <h2 className="text-lg font-semibold text-green-700 dark:text-green-400">
                  App Installed!
                </h2>
                <p className="text-sm text-green-600/80 dark:text-green-400/80 mt-1">
                  Woo-Fur is installed on your device. You can find it on your home screen.
                </p>
              </CardContent>
            </Card>
          ) : isInstallable ? (
            <Card className="mb-8">
              <CardContent className="p-6 text-center">
                <Button size="lg" className="gap-2" onClick={promptInstall}>
                  <Download className="h-5 w-5" />
                  Install Now
                </Button>
                <p className="text-xs text-muted-foreground mt-3">
                  Free • No app store required
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card className="mb-8">
              <CardContent className="p-6">
                <h2 className="font-semibold text-foreground mb-4 text-center">
                  Manual Installation
                </h2>
                <div className="space-y-3">
                  {installSteps.map((item) => (
                    <div key={item.step} className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                        {item.step}
                      </div>
                      <p className="text-sm text-muted-foreground">{item.text}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Features */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-foreground mb-4 text-center">
              App Features
            </h2>
            <div className="grid gap-4">
              {features.map((feature) => (
                <Card key={feature.title}>
                  <CardContent className="p-4 flex items-start gap-4">
                    <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                      <feature.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        {feature.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Notifications Setup */}
          {notificationsSupported && permission !== "granted" && (
            <Card className="mb-8">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-accent/10 rounded-lg shrink-0">
                    <Bell className="h-5 w-5 text-accent" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground">Enable Notifications</h3>
                    <p className="text-sm text-muted-foreground mt-1 mb-3">
                      Stay updated with booking reminders and animal updates
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1"
                      onClick={requestPermission}
                    >
                      Enable
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {permission === "granted" && (
            <Card className="mb-8 border-green-500/20">
              <CardContent className="p-4 flex items-center gap-3">
                <Check className="h-5 w-5 text-green-600" />
                <span className="text-sm text-green-700 dark:text-green-400">
                  Notifications enabled
                </span>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Install;
