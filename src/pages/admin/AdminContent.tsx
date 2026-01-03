import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Plus, Pencil, Trash2, Eye, EyeOff, GripVertical } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ContentBlock {
  id: string;
  page_slug: string;
  section_key: string;
  content: any;
  sort_order: number;
  is_visible: boolean;
  updated_at: string;
}

export function AdminContent() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingContent, setEditingContent] = useState<ContentBlock | null>(null);
  const [selectedPage, setSelectedPage] = useState('home');

  const [formData, setFormData] = useState({
    page_slug: 'home',
    section_key: '',
    content: '{}',
    sort_order: 0,
    is_visible: true,
  });

  const { data: content, isLoading } = useQuery({
    queryKey: ['admin-page-content'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('page_content')
        .select('*')
        .order('page_slug')
        .order('sort_order');
      if (error) throw error;
      return data as ContentBlock[];
    },
  });

  const pages = [...new Set(content?.map(c => c.page_slug) || ['home', 'about', 'contact'])];
  const pageContent = content?.filter(c => c.page_slug === selectedPage) || [];

  const saveContent = useMutation({
    mutationFn: async (data: typeof formData & { id?: string }) => {
      let parsedContent;
      try {
        parsedContent = JSON.parse(data.content);
      } catch {
        throw new Error('Invalid JSON in content field');
      }

      if (data.id) {
        const { error } = await supabase
          .from('page_content')
          .update({ ...data, content: parsedContent })
          .eq('id', data.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('page_content')
          .insert({ ...data, content: parsedContent });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-page-content'] });
      toast({ title: 'Content saved successfully' });
      setIsDialogOpen(false);
    },
    onError: (error: any) => {
      toast({ title: 'Failed to save content', description: error.message, variant: 'destructive' });
    },
  });

  const deleteContent = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('page_content').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-page-content'] });
      toast({ title: 'Content deleted' });
    },
    onError: (error: any) => {
      toast({ title: 'Failed to delete content', description: error.message, variant: 'destructive' });
    },
  });

  const toggleVisibility = useMutation({
    mutationFn: async ({ id, is_visible }: { id: string; is_visible: boolean }) => {
      const { error } = await supabase
        .from('page_content')
        .update({ is_visible })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-page-content'] });
    },
  });

  const handleEdit = (block: ContentBlock) => {
    setEditingContent(block);
    setFormData({
      page_slug: block.page_slug,
      section_key: block.section_key,
      content: JSON.stringify(block.content, null, 2),
      sort_order: block.sort_order,
      is_visible: block.is_visible,
    });
    setIsDialogOpen(true);
  };

  const handleCreate = () => {
    setEditingContent(null);
    setFormData({
      page_slug: selectedPage,
      section_key: '',
      content: '{\n  "title": "",\n  "text": ""\n}',
      sort_order: pageContent.length,
      is_visible: true,
    });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.section_key) {
      toast({ title: 'Section key is required', variant: 'destructive' });
      return;
    }
    saveContent.mutate({
      ...formData,
      id: editingContent?.id,
    });
  };

  if (isLoading) {
    return <div className="flex justify-center py-8"><LoadingSpinner size="lg" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Page Content</h2>
          <p className="text-muted-foreground">Manage dynamic content blocks across pages</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleCreate}>
              <Plus className="h-4 w-4 mr-2" />
              Add Content Block
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingContent ? 'Edit Content Block' : 'Add Content Block'}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Page</Label>
                  <Select
                    value={formData.page_slug}
                    onValueChange={(value) => setFormData({ ...formData, page_slug: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="home">Home</SelectItem>
                      <SelectItem value="about">About</SelectItem>
                      <SelectItem value="contact">Contact</SelectItem>
                      <SelectItem value="programs">Programs</SelectItem>
                      <SelectItem value="support">Support</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Section Key *</Label>
                  <Input
                    value={formData.section_key}
                    onChange={(e) => setFormData({ ...formData, section_key: e.target.value })}
                    placeholder="hero, features, cta..."
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Content (JSON)</Label>
                <Textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={10}
                  className="font-mono text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Sort Order</Label>
                  <Input
                    type="number"
                    value={formData.sort_order}
                    onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <Switch
                    checked={formData.is_visible}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_visible: checked })}
                  />
                  <Label>Visible</Label>
                </div>
              </div>
              <Button onClick={handleSave} disabled={saveContent.isPending}>
                {saveContent.isPending && <LoadingSpinner size="sm" className="mr-2" />}
                {editingContent ? 'Update Content' : 'Create Content'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={selectedPage} onValueChange={setSelectedPage}>
        <TabsList>
          {['home', 'about', 'contact', 'programs', 'support'].map(page => (
            <TabsTrigger key={page} value={page} className="capitalize">
              {page}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={selectedPage} className="mt-4">
          <div className="space-y-4">
            {pageContent.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  No content blocks for this page. Click "Add Content Block" to create one.
                </CardContent>
              </Card>
            ) : (
              pageContent.map((block) => (
                <Card key={block.id} className={!block.is_visible ? 'opacity-50' : ''}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <GripVertical className="h-4 w-4 text-muted-foreground" />
                        <CardTitle className="text-base font-mono">{block.section_key}</CardTitle>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleVisibility.mutate({ id: block.id, is_visible: !block.is_visible })}
                        >
                          {block.is_visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(block)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            if (confirm('Delete this content block?')) {
                              deleteContent.mutate(block.id);
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
                      {JSON.stringify(block.content, null, 2)}
                    </pre>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
