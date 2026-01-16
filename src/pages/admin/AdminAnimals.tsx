import { useState, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Plus, Pencil, Trash2, Upload, X } from 'lucide-react';

interface AnimalFormData {
  name: string;
  species: string;
  breed: string;
  age: number | null;
  gender: string;
  size: string;
  biography: string;
  availability_status: string;
  adoption_status: string;
  photos: string[];
}

interface DbAnimal {
  id: string;
  name: string;
  species: string;
  breed: string | null;
  age: number | null;
  gender: string | null;
  size: string | null;
  biography: string | null;
  availability_status: string | null;
  adoption_status: string | null;
  photos: string[] | null;
  created_at: string;
  updated_at: string;
}

const defaultFormData: AnimalFormData = {
  name: '',
  species: '',
  breed: '',
  age: null,
  gender: '',
  size: '',
  biography: '',
  availability_status: 'available',
  adoption_status: 'not_available',
  photos: [],
};

export function AdminAnimals() {
  // Use raw database query for admin
  const { data: animals, isLoading } = useQuery({
    queryKey: ['admin-animals'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('animals')
        .select('*')
        .order('name');
      if (error) throw error;
      return data as DbAnimal[];
    },
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<AnimalFormData>(defaultFormData);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleEdit = (animal: DbAnimal) => {
    setEditingId(animal.id);
    setFormData({
      name: animal.name || '',
      species: animal.species || '',
      breed: animal.breed || '',
      age: animal.age,
      gender: animal.gender || '',
      size: animal.size || '',
      biography: animal.biography || '',
      availability_status: animal.availability_status || 'available',
      adoption_status: animal.adoption_status || 'not_available',
      photos: animal.photos || [],
    });
    setIsDialogOpen(true);
  };

  const handleCreate = () => {
    setEditingId(null);
    setFormData(defaultFormData);
    setIsDialogOpen(true);
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `animal-${Date.now()}.${fileExt}`;
      const filePath = `animals/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('website-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from('website-images')
        .getPublicUrl(filePath);

      const newPhotos = [...formData.photos, publicUrlData.publicUrl];
      setFormData({ ...formData, photos: newPhotos });
      toast({ title: 'Photo uploaded successfully' });
    } catch (error: any) {
      toast({ title: 'Error uploading photo', description: error.message, variant: 'destructive' });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemovePhoto = (index: number) => {
    const newPhotos = formData.photos.filter((_, i) => i !== index);
    setFormData({ ...formData, photos: newPhotos });
  };

  const handleSave = async () => {
    if (!formData.name || !formData.species) {
      toast({ title: 'Name and species are required', variant: 'destructive' });
      return;
    }

    setIsSaving(true);
    try {
      if (editingId) {
        const { error } = await supabase
          .from('animals')
          .update(formData)
          .eq('id', editingId);
        if (error) throw error;
        toast({ title: 'Animal updated successfully' });
      } else {
        const { error } = await supabase
          .from('animals')
          .insert(formData);
        if (error) throw error;
        toast({ title: 'Animal created successfully' });
      }
      // Invalidate both admin and public animal queries
      queryClient.invalidateQueries({ queryKey: ['admin-animals'] });
      queryClient.invalidateQueries({ queryKey: ['animals'] });
      setIsDialogOpen(false);
    } catch (error: any) {
      toast({ title: 'Error saving animal', description: error.message, variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this animal?')) return;
    
    try {
      const { error } = await supabase.from('animals').delete().eq('id', id);
      if (error) throw error;
      // Invalidate both admin and public animal queries
      queryClient.invalidateQueries({ queryKey: ['admin-animals'] });
      queryClient.invalidateQueries({ queryKey: ['animals'] });
      toast({ title: 'Animal deleted' });
    } catch (error: any) {
      toast({ title: 'Error deleting animal', description: error.message, variant: 'destructive' });
    }
  };

  const getStatusLabel = (animal: DbAnimal) => {
    if (animal.availability_status === 'available') return 'Available';
    if (animal.availability_status === 'busy') return 'Busy';
    return 'Unavailable';
  };

  if (isLoading) {
    return <div className="flex justify-center py-8"><LoadingSpinner size="lg" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Manage Animals</h2>
          <p className="text-muted-foreground">Add, edit, and remove animal profiles</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleCreate}>
              <Plus className="h-4 w-4 mr-2" />
              Add Animal
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId ? 'Edit Animal' : 'Add New Animal'}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Name *</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Species *</Label>
                  <Select
                    value={formData.species}
                    onValueChange={(value) => setFormData({ ...formData, species: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select species" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dog">Dog</SelectItem>
                      <SelectItem value="cat">Cat</SelectItem>
                      <SelectItem value="rabbit">Rabbit</SelectItem>
                      <SelectItem value="bird">Bird</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Breed</Label>
                  <Input
                    value={formData.breed}
                    onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Age (years)</Label>
                  <Input
                    type="number"
                    value={formData.age || ''}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value ? parseInt(e.target.value) : null })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Gender</Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value) => setFormData({ ...formData, gender: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Size</Label>
                  <Select
                    value={formData.size}
                    onValueChange={(value) => setFormData({ ...formData, size: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="large">Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Availability</Label>
                  <Select
                    value={formData.availability_status}
                    onValueChange={(value) => setFormData({ ...formData, availability_status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="busy">Busy</SelectItem>
                      <SelectItem value="unavailable">Unavailable</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Biography</Label>
                <Textarea
                  value={formData.biography}
                  onChange={(e) => setFormData({ ...formData, biography: e.target.value })}
                  rows={4}
                />
              </div>

              {/* Photo Management */}
              <div className="space-y-3">
                <Label>Photos</Label>
                <div className="grid grid-cols-3 gap-3">
                  {formData.photos.map((photo, index) => (
                    <div key={index} className="relative group aspect-square rounded-lg overflow-hidden border">
                      <img src={photo} alt={`Photo ${index + 1}`} className="w-full h-full object-cover" />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleRemovePhoto(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                  <label className="aspect-square rounded-lg border-2 border-dashed flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                    {isUploading ? (
                      <LoadingSpinner size="sm" />
                    ) : (
                      <>
                        <Upload className="h-6 w-6 text-muted-foreground mb-1" />
                        <span className="text-xs text-muted-foreground">Add Photo</span>
                      </>
                    )}
                  </label>
                </div>
              </div>

              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? <LoadingSpinner size="sm" className="mr-2" /> : null}
                {editingId ? 'Update Animal' : 'Create Animal'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Photo</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Species</TableHead>
                <TableHead>Breed</TableHead>
                <TableHead>Age</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {animals?.map((animal) => (
                <TableRow key={animal.id}>
                  <TableCell>
                    <div className="w-10 h-10 rounded-md overflow-hidden bg-muted">
                      {animal.photos?.[0] ? (
                        <img src={animal.photos[0]} alt={animal.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">N/A</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{animal.name}</TableCell>
                  <TableCell className="capitalize">{animal.species}</TableCell>
                  <TableCell>{animal.breed || '-'}</TableCell>
                  <TableCell>{animal.age ? `${animal.age} yr` : '-'}</TableCell>
                  <TableCell>
                    <Badge variant={animal.availability_status === 'available' ? 'default' : 'secondary'}>
                      {getStatusLabel(animal)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(animal)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(animal.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {!animals?.length && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No animals found. Add your first animal above.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}