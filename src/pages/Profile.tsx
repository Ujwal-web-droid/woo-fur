import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { AvatarUpload } from '@/components/profile/AvatarUpload';
import { useAuth } from '@/context/AuthContext';
import { useFavorites } from '@/hooks/useFavorites';
import { useAnimals } from '@/hooks/useAnimals';
import { 
  User, Mail, Phone, Bell, Heart, 
  Calendar, LogOut, Trash2, Settings
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const profileSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters').optional().nullable(),
  phone: z.string().optional().nullable(),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional().nullable(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function Profile() {
  const navigate = useNavigate();
  const { user, profile, roles, signOut, updateProfile, isLoading: authLoading } = useAuth();
  const { favorites, toggleFavorite } = useFavorites();
  const [isUpdating, setIsUpdating] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: profile?.full_name || '',
      phone: profile?.phone || '',
      bio: profile?.bio || '',
    },
  });

  const handleUpdateProfile = async (data: ProfileFormData) => {
    setIsUpdating(true);
    await updateProfile(data);
    setIsUpdating(false);
  };

  const handleNotificationChange = async (key: string, value: boolean) => {
    if (!profile) return;
    
    const currentPrefs = profile.notification_preferences || {
      email: true,
      push: true,
      booking_reminders: true,
      animal_updates: true,
      program_announcements: true,
    };
    
    await updateProfile({
      notification_preferences: {
        ...currentPrefs,
        [key]: value,
      },
    });
  };

  const handleAccessibilityChange = async (key: string, value: boolean) => {
    if (!profile) return;
    
    const currentPrefs = profile.accessibility_preferences || {
      reduced_motion: false,
      high_contrast: false,
    };
    
    await updateProfile({
      accessibility_preferences: {
        ...currentPrefs,
        [key]: value,
      },
    });
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const { data: animals = [] } = useAnimals();
  const favoriteAnimals = animals.filter(animal => favorites.includes(animal.id));

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-destructive text-destructive-foreground';
      case 'therapy_client': return 'bg-primary text-primary-foreground';
      case 'volunteer': return 'bg-secondary text-secondary-foreground';
      case 'adopter': return 'bg-accent text-accent-foreground';
      case 'donor': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  if (authLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container-app py-8">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                <AvatarUpload />
                
                <div className="flex-1 space-y-2">
                  <h1 className="text-2xl font-bold text-foreground">
                    {profile?.full_name || 'Welcome!'}
                  </h1>
                  <p className="text-muted-foreground">{user?.email}</p>
                  <div className="flex flex-wrap gap-2">
                    {roles.map((role) => (
                      <Badge key={role} className={getRoleBadgeColor(role)}>
                        {role.replace('_', ' ')}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button variant="outline" onClick={handleSignOut}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Profile Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 mb-6">
              <TabsTrigger value="personal" className="gap-2">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Personal</span>
              </TabsTrigger>
              <TabsTrigger value="favorites" className="gap-2">
                <Heart className="h-4 w-4" />
                <span className="hidden sm:inline">Favorites</span>
              </TabsTrigger>
              <TabsTrigger value="bookings" className="gap-2">
                <Calendar className="h-4 w-4" />
                <span className="hidden sm:inline">Bookings</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="gap-2">
                <Bell className="h-4 w-4" />
                <span className="hidden sm:inline">Notifications</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="gap-2">
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Settings</span>
              </TabsTrigger>
            </TabsList>

            {/* Personal Information */}
            <TabsContent value="personal">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Update your personal details and profile information.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={form.handleSubmit(handleUpdateProfile)} className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="full_name">Full Name</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="full_name"
                            placeholder="John Doe"
                            className="pl-10"
                            {...form.register('full_name')}
                          />
                        </div>
                        {form.formState.errors.full_name && (
                          <p className="text-sm text-destructive">{form.formState.errors.full_name.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="email"
                            type="email"
                            value={user?.email || ''}
                            disabled
                            className="pl-10 bg-muted"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="phone"
                            placeholder="+1 (555) 123-4567"
                            className="pl-10"
                            {...form.register('phone')}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        placeholder="Tell us a little about yourself..."
                        className="min-h-[100px]"
                        {...form.register('bio')}
                      />
                      {form.formState.errors.bio && (
                        <p className="text-sm text-destructive">{form.formState.errors.bio.message}</p>
                      )}
                    </div>

                    <Button type="submit" disabled={isUpdating}>
                      {isUpdating ? <LoadingSpinner size="sm" /> : 'Save Changes'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Favorites */}
            <TabsContent value="favorites">
              <Card>
                <CardHeader>
                  <CardTitle>Favorite Animals</CardTitle>
                  <CardDescription>Your saved favorite animals for quick access.</CardDescription>
                </CardHeader>
                <CardContent>
                  {favoriteAnimals.length === 0 ? (
                    <div className="text-center py-12">
                      <Heart className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                      <p className="text-muted-foreground">No favorite animals yet.</p>
                      <Button 
                        variant="link" 
                        className="mt-2"
                        onClick={() => navigate('/animals')}
                      >
                        Browse Animals
                      </Button>
                    </div>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                      {favoriteAnimals.map((animal) => (
                        <div 
                          key={animal.id} 
                          className="flex items-center gap-4 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors cursor-pointer"
                          onClick={() => navigate(`/animals/${animal.id}`)}
                        >
                          <img 
                            src={animal.image} 
                            alt={animal.name}
                            className="h-16 w-16 rounded-lg object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-foreground truncate">{animal.name}</h3>
                            <p className="text-sm text-muted-foreground">{animal.breed}</p>
                            <Badge variant="secondary" className="mt-1 text-xs">
                              {animal.status}
                            </Badge>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(animal.id);
                            }}
                          >
                            <Heart className="h-5 w-5 fill-destructive text-destructive" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Bookings */}
            <TabsContent value="bookings">
              <Card>
                <CardHeader>
                  <CardTitle>Booking History</CardTitle>
                  <CardDescription>View and manage your upcoming and past bookings.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Calendar className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                    <p className="text-muted-foreground">No bookings yet.</p>
                    <Button 
                      variant="link" 
                      className="mt-2"
                      onClick={() => navigate('/booking')}
                    >
                      Book a Session
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notifications */}
            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>Manage how you receive updates and notifications.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-foreground">Communication Channels</h3>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive updates via email</p>
                      </div>
                      <Switch
                        checked={profile?.notification_preferences?.email ?? true}
                        onCheckedChange={(checked) => handleNotificationChange('email', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Push Notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive push notifications on this device</p>
                      </div>
                      <Switch
                        checked={profile?.notification_preferences?.push ?? true}
                        onCheckedChange={(checked) => handleNotificationChange('push', checked)}
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-foreground">Notification Types</h3>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Booking Reminders</Label>
                        <p className="text-sm text-muted-foreground">Get reminded before your sessions</p>
                      </div>
                      <Switch
                        checked={profile?.notification_preferences?.booking_reminders ?? true}
                        onCheckedChange={(checked) => handleNotificationChange('booking_reminders', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Animal Updates</Label>
                        <p className="text-sm text-muted-foreground">Updates about your favorite animals</p>
                      </div>
                      <Switch
                        checked={profile?.notification_preferences?.animal_updates ?? true}
                        onCheckedChange={(checked) => handleNotificationChange('animal_updates', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Program Announcements</Label>
                        <p className="text-sm text-muted-foreground">News about programs and events</p>
                      </div>
                      <Switch
                        checked={profile?.notification_preferences?.program_announcements ?? true}
                        onCheckedChange={(checked) => handleNotificationChange('program_announcements', checked)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings */}
            <TabsContent value="settings">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Accessibility</CardTitle>
                    <CardDescription>Customize your experience for better accessibility.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Reduced Motion</Label>
                        <p className="text-sm text-muted-foreground">Minimize animations</p>
                      </div>
                      <Switch
                        checked={profile?.accessibility_preferences?.reduced_motion ?? false}
                        onCheckedChange={(checked) => handleAccessibilityChange('reduced_motion', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>High Contrast</Label>
                        <p className="text-sm text-muted-foreground">Increase color contrast</p>
                      </div>
                      <Switch
                        checked={profile?.accessibility_preferences?.high_contrast ?? false}
                        onCheckedChange={(checked) => handleAccessibilityChange('high_contrast', checked)}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-destructive/50">
                  <CardHeader>
                    <CardTitle className="text-destructive">Danger Zone</CardTitle>
                    <CardDescription>Irreversible actions for your account.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Account
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your account
                            and remove all your data from our servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Delete Account
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
}
