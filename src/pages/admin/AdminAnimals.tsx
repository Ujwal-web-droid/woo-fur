import { useState } from 'react';
import { useAnimals } from '@/hooks/useAnimals';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Plus, Pencil, Trash2 } from 'lucide-react';

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
};

export function AdminAnimals() {
  const { data: animals, isLoading } = useAnimals();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<AnimalFormData>(defaultFormData);
  const [isSaving, setIsSaving] = useState(false);

  const handleEdit = (animal: any) => {
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
    });
    setIsDialogOpen(true);
  };

  const handleCreate = () => {
    setEditingId(null);
    setFormData(defaultFormData);
    setIsDialogOpen(true);
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
      queryClient.invalidateQueries({ queryKey: ['animals'] });
      toast({ title: 'Animal deleted' });
    } catch (error: any) {
      toast({ title: 'Error deleting animal', description: error.message, variant: 'destructive' });
    }
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
                  <TableCell className="font-medium">{animal.name}</TableCell>
                  <TableCell className="capitalize">{animal.species}</TableCell>
                  <TableCell>{animal.breed || '-'}</TableCell>
                  <TableCell>{animal.age || '-'}</TableCell>
                  <TableCell>
                    <Badge variant={animal.status?.includes('Available') ? 'default' : 'secondary'}>
                      {animal.status}
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
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
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
