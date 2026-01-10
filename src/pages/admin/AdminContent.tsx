import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Plus, Pencil, Trash2, Eye, EyeOff, Save, FileText, Home, Info, Phone, LayoutTemplate, Heart, Image as ImageIcon } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { ImageUploader } from '@/components/admin/ImageUploader';
import { useCurrentImages } from '@/hooks/useImageUpload';

interface ContentBlock {
  id: string;
  page_slug: string;
  section_key: string;
  content: Record<string, any>;
  sort_order: number;
  is_visible: boolean;
  updated_at: string;
}

const PAGE_CONFIG = {
  home: { label: 'Home', icon: Home, color: 'text-blue-500' },
  about: { label: 'About', icon: Info, color: 'text-green-500' },
  contact: { label: 'Contact', icon: Phone, color: 'text-purple-500' },
  programs: { label: 'Programs', icon: LayoutTemplate, color: 'text-orange-500' },
  support: { label: 'Support', icon: Heart, color: 'text-pink-500' },
  footer: { label: 'Footer', icon: FileText, color: 'text-gray-500' },
};

type FieldType = 'text' | 'textarea' | 'array' | 'image';

interface FieldConfig {
  key: string;
  label: string;
  type: FieldType;
  aspectRatio?: string;
}

const SECTION_TEMPLATES: Record<string, Record<string, { label: string; fields: FieldConfig[] }>> = {
  home: {
    hero: {
      label: 'Hero Section',
      fields: [
        { key: 'badge', label: 'Badge Text', type: 'text' },
        { key: 'title', label: 'Title', type: 'text' },
        { key: 'titleHighlight', label: 'Title Highlight', type: 'text' },
        { key: 'description', label: 'Description', type: 'textarea' },
        { key: 'buttonPrimary', label: 'Primary Button Text', type: 'text' },
        { key: 'buttonSecondary', label: 'Secondary Button Text', type: 'text' },
        { key: 'heroImage', label: 'Hero Image', type: 'image', aspectRatio: '16/9' },
      ],
    },
    stats: {
      label: 'Statistics',
      fields: [{ key: 'items', label: 'Stats Items (JSON Array)', type: 'array' }],
    },
    programs_header: {
      label: 'Programs Header',
      fields: [
        { key: 'title', label: 'Section Title', type: 'text' },
        { key: 'description', label: 'Section Description', type: 'textarea' },
      ],
    },
    featured_story: {
      label: 'Featured Story',
      fields: [
        { key: 'badge', label: 'Badge', type: 'text' },
        { key: 'title', label: 'Story Title', type: 'text' },
        { key: 'content', label: 'Story Content', type: 'textarea' },
        { key: 'authorName', label: 'Author Name', type: 'text' },
        { key: 'authorRole', label: 'Author Role', type: 'text' },
        { key: 'sessions', label: 'Sessions Count', type: 'text' },
        { key: 'storyImage', label: 'Story Image', type: 'image', aspectRatio: '4/3' },
      ],
    },
    cta: {
      label: 'Call to Action',
      fields: [
        { key: 'title', label: 'CTA Title', type: 'text' },
        { key: 'description', label: 'CTA Description', type: 'textarea' },
        { key: 'buttonPrimary', label: 'Primary Button', type: 'text' },
        { key: 'buttonSecondary', label: 'Secondary Button', type: 'text' },
        { key: 'ctaImage', label: 'Background Image', type: 'image', aspectRatio: '21/9' },
      ],
    },
  },
  about: {
    hero: {
      label: 'Hero Section',
      fields: [
        { key: 'title', label: 'Page Title', type: 'text' },
        { key: 'description', label: 'Page Description', type: 'textarea' },
        { key: 'heroImage', label: 'Hero Image', type: 'image', aspectRatio: '16/9' },
      ],
    },
    founder: {
      label: 'Founder Story',
      fields: [
        { key: 'title', label: 'Section Title', type: 'text' },
        { key: 'content', label: 'Story Content', type: 'textarea' },
        { key: 'quote', label: 'Quote', type: 'textarea' },
        { key: 'founderImage', label: 'Founder Photo', type: 'image', aspectRatio: '1/1' },
      ],
    },
    mission: {
      label: 'Mission & Vision',
      fields: [
        { key: 'missionTitle', label: 'Mission Title', type: 'text' },
        { key: 'missionText', label: 'Mission Text', type: 'textarea' },
        { key: 'visionTitle', label: 'Vision Title', type: 'text' },
        { key: 'visionText', label: 'Vision Text', type: 'textarea' },
      ],
    },
    team: {
      label: 'Team Section',
      fields: [
        { key: 'title', label: 'Section Title', type: 'text' },
        { key: 'members', label: 'Team Members (JSON Array)', type: 'array' },
      ],
    },
  },
  contact: {
    hero: {
      label: 'Hero Section',
      fields: [
        { key: 'title', label: 'Page Title', type: 'text' },
        { key: 'description', label: 'Page Description', type: 'textarea' },
      ],
    },
    info: {
      label: 'Contact Information',
      fields: [
        { key: 'address', label: 'Address', type: 'text' },
        { key: 'phone', label: 'Phone Number', type: 'text' },
        { key: 'email', label: 'Email Address', type: 'text' },
      ],
    },
    hours: {
      label: 'Operating Hours',
      fields: [{ key: 'items', label: 'Hours (JSON Array)', type: 'array' }],
    },
  },
  footer: {
    brand: {
      label: 'Brand Section',
      fields: [
        { key: 'tagline', label: 'Tagline', type: 'textarea' },
        { key: 'logo', label: 'Footer Logo', type: 'image', aspectRatio: '1/1' },
      ],
    },
    contact: {
      label: 'Contact Info',
      fields: [
        { key: 'address', label: 'Address', type: 'text' },
        { key: 'phone', label: 'Phone', type: 'text' },
        { key: 'email', label: 'Email', type: 'text' },
      ],
    },
    copyright: {
      label: 'Copyright',
      fields: [{ key: 'text', label: 'Footer Text', type: 'text' }],
    },
  },
  programs: {
    hero: {
      label: 'Hero Section',
      fields: [
        { key: 'title', label: 'Page Title', type: 'text' },
        { key: 'description', label: 'Page Description', type: 'textarea' },
        { key: 'heroImage', label: 'Hero Image', type: 'image', aspectRatio: '16/9' },
      ],
    },
    rescue: {
      label: 'Rescue Program',
      fields: [
        { key: 'title', label: 'Title', type: 'text' },
        { key: 'description', label: 'Description', type: 'textarea' },
        { key: 'image', label: 'Program Image', type: 'image', aspectRatio: '16/9' },
      ],
    },
    therapy: {
      label: 'Therapy Program',
      fields: [
        { key: 'title', label: 'Title', type: 'text' },
        { key: 'description', label: 'Description', type: 'textarea' },
        { key: 'image', label: 'Program Image', type: 'image', aspectRatio: '16/9' },
      ],
    },
  },
  support: {
    hero: {
      label: 'Hero Section',
      fields: [
        { key: 'title', label: 'Page Title', type: 'text' },
        { key: 'description', label: 'Page Description', type: 'textarea' },
        { key: 'heroImage', label: 'Hero Image', type: 'image', aspectRatio: '16/9' },
      ],
    },
    donation: {
      label: 'Donation Section',
      fields: [
        { key: 'title', label: 'Section Title', type: 'text' },
        { key: 'description', label: 'Description', type: 'textarea' },
        { key: 'donationImage', label: 'Donation Image', type: 'image', aspectRatio: '4/3' },
      ],
    },
  },
};

// Image slots for dedicated image management
const IMAGE_SLOTS = [
  { key: 'home-hero', label: 'Home Hero Banner', page: 'home', aspectRatio: '16/9' },
  { key: 'home-featured-story', label: 'Featured Story Image', page: 'home', aspectRatio: '4/3' },
  { key: 'about-hero', label: 'About Page Hero', page: 'about', aspectRatio: '16/9' },
  { key: 'about-founder', label: 'Founder Photo', page: 'about', aspectRatio: '1/1' },
  { key: 'programs-hero', label: 'Programs Page Hero', page: 'programs', aspectRatio: '16/9' },
  { key: 'support-hero', label: 'Support Page Hero', page: 'support', aspectRatio: '16/9' },
  { key: 'contact-hero', label: 'Contact Page Hero', page: 'contact', aspectRatio: '16/9' },
  { key: 'rescue-program', label: 'Rescue Program Image', page: 'programs', aspectRatio: '16/9' },
  { key: 'therapy-program', label: 'Therapy Program Image', page: 'programs', aspectRatio: '16/9' },
  { key: 'rehabilitation-program', label: 'Rehabilitation Program Image', page: 'programs', aspectRatio: '16/9' },
  { key: 'part-time-pets', label: 'Part-time Pets Image', page: 'programs', aspectRatio: '16/9' },
];

export function AdminContent() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingContent, setEditingContent] = useState<ContentBlock | null>(null);
  const [selectedPage, setSelectedPage] = useState('home');
  const [formFields, setFormFields] = useState<Record<string, string>>({});
  const [selectedSection, setSelectedSection] = useState('');
  const [isVisible, setIsVisible] = useState(true);
  const [activeTab, setActiveTab] = useState<'content' | 'images'>('content');

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

  const currentImagesQuery = useCurrentImages();
  const { data: currentImages = {} } = useQuery(currentImagesQuery);

  const pageContent = content?.filter(c => c.page_slug === selectedPage) || [];

  const saveContent = useMutation({
    mutationFn: async (data: { id?: string; page_slug: string; section_key: string; content: Record<string, any>; is_visible: boolean; sort_order: number }) => {
      if (data.id) {
        const { error } = await supabase
          .from('page_content')
          .update({ content: data.content, is_visible: data.is_visible })
          .eq('id', data.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('page_content')
          .insert(data);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-page-content'] });
      queryClient.invalidateQueries({ queryKey: ['page-content'] });
      toast({ title: 'Content saved successfully!' });
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
      queryClient.invalidateQueries({ queryKey: ['page-content'] });
      toast({ title: 'Content deleted' });
    },
    onError: (error: any) => {
      toast({ title: 'Failed to delete', description: error.message, variant: 'destructive' });
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
      queryClient.invalidateQueries({ queryKey: ['page-content'] });
    },
  });

  const handleEdit = (block: ContentBlock) => {
    setEditingContent(block);
    setSelectedSection(block.section_key);
    setIsVisible(block.is_visible);
    
    const fields: Record<string, string> = {};
    const template = SECTION_TEMPLATES[block.page_slug]?.[block.section_key];
    
    if (template) {
      template.fields.forEach(field => {
        if (field.type === 'array') {
          fields[field.key] = JSON.stringify(block.content, null, 2);
        } else if (field.type === 'image') {
          fields[field.key] = block.content[field.key] || '';
        } else {
          fields[field.key] = block.content[field.key] || '';
        }
      });
    } else {
      fields['rawJson'] = JSON.stringify(block.content, null, 2);
    }
    
    setFormFields(fields);
    setIsDialogOpen(true);
  };

  const handleCreate = () => {
    setEditingContent(null);
    setSelectedSection('');
    setIsVisible(true);
    setFormFields({});
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!selectedSection) {
      toast({ title: 'Please select a section', variant: 'destructive' });
      return;
    }

    const template = SECTION_TEMPLATES[selectedPage]?.[selectedSection];
    let contentObj: Record<string, any> = {};

    if (template) {
      if (template.fields.some(f => f.type === 'array')) {
        try {
          contentObj = JSON.parse(formFields['items'] || formFields['rawJson'] || '[]');
        } catch {
          toast({ title: 'Invalid JSON format', variant: 'destructive' });
          return;
        }
      } else {
        template.fields.forEach(field => {
          if (field.type !== 'array') {
            contentObj[field.key] = formFields[field.key] || '';
          }
        });
      }
    } else if (formFields['rawJson']) {
      try {
        contentObj = JSON.parse(formFields['rawJson']);
      } catch {
        toast({ title: 'Invalid JSON format', variant: 'destructive' });
        return;
      }
    }

    saveContent.mutate({
      id: editingContent?.id,
      page_slug: selectedPage,
      section_key: selectedSection,
      content: contentObj,
      is_visible: isVisible,
      sort_order: editingContent?.sort_order ?? pageContent.length,
    });
  };

  const getAvailableSections = () => {
    const templates = SECTION_TEMPLATES[selectedPage] || {};
    const existingSections = pageContent.map(c => c.section_key);
    
    if (editingContent) {
      return Object.keys(templates);
    }
    
    return Object.keys(templates).filter(key => !existingSections.includes(key));
  };

  const handleImageFieldChange = (fieldKey: string, url: string) => {
    setFormFields(prev => ({ ...prev, [fieldKey]: url }));
  };

  const renderFormFields = () => {
    const template = SECTION_TEMPLATES[selectedPage]?.[selectedSection];
    
    if (!template) {
      return (
        <div className="space-y-2">
          <Label>Content (JSON)</Label>
          <Textarea
            value={formFields['rawJson'] || '{}'}
            onChange={(e) => setFormFields({ ...formFields, rawJson: e.target.value })}
            rows={10}
            className="font-mono text-sm"
            placeholder="Enter JSON content..."
          />
        </div>
      );
    }

    return template.fields.map(field => (
      <div key={field.key} className="space-y-2">
        {field.type === 'image' ? (
          <ImageUploader
            imageKey={`${selectedPage}-${selectedSection}-${field.key}`}
            currentUrl={formFields[field.key]}
            pageSlug={selectedPage}
            sectionKey={selectedSection}
            label={field.label}
            aspectRatio={field.aspectRatio || '16/9'}
            onImageChange={(url) => handleImageFieldChange(field.key, url)}
          />
        ) : (
          <>
            <Label htmlFor={field.key}>{field.label}</Label>
            {field.type === 'textarea' ? (
              <Textarea
                id={field.key}
                value={formFields[field.key] || ''}
                onChange={(e) => setFormFields({ ...formFields, [field.key]: e.target.value })}
                rows={4}
                placeholder={`Enter ${field.label.toLowerCase()}...`}
              />
            ) : field.type === 'array' ? (
              <Textarea
                id={field.key}
                value={formFields[field.key] || formFields['items'] || '[]'}
                onChange={(e) => setFormFields({ ...formFields, [field.key]: e.target.value, items: e.target.value })}
                rows={8}
                className="font-mono text-sm"
                placeholder='[{"key": "value"}]'
              />
            ) : (
              <Input
                id={field.key}
                value={formFields[field.key] || ''}
                onChange={(e) => setFormFields({ ...formFields, [field.key]: e.target.value })}
                placeholder={`Enter ${field.label.toLowerCase()}...`}
              />
            )}
          </>
        )}
      </div>
    ));
  };

  const renderImageGallery = () => {
    const pageImages = IMAGE_SLOTS.filter(slot => slot.page === selectedPage);
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pageImages.map(slot => (
          <Card key={slot.key}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">{slot.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <ImageUploader
                imageKey={slot.key}
                currentUrl={currentImages[slot.key]}
                pageSlug={slot.page}
                aspectRatio={slot.aspectRatio}
              />
            </CardContent>
          </Card>
        ))}
        {pageImages.length === 0 && (
          <Card className="col-span-full">
            <CardContent className="py-12 text-center">
              <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No dedicated image slots for this page</p>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  if (isLoading) {
    return <div className="flex justify-center py-8"><LoadingSpinner size="lg" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Website Content</h2>
          <p className="text-muted-foreground">Edit text, images, and content across all pages</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'content' | 'images')}>
            <TabsList>
              <TabsTrigger value="content" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Content
              </TabsTrigger>
              <TabsTrigger value="images" className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4" />
                Images
              </TabsTrigger>
            </TabsList>
          </Tabs>
          
          {activeTab === 'content' && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={handleCreate}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Section
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingContent ? 'Edit Content Section' : 'Add Content Section'}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Page</Label>
                      <Select
                        value={selectedPage}
                        onValueChange={(value) => {
                          setSelectedPage(value);
                          setSelectedSection('');
                          setFormFields({});
                        }}
                        disabled={!!editingContent}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(PAGE_CONFIG).map(([key, config]) => (
                            <SelectItem key={key} value={key}>
                              <span className="flex items-center gap-2">
                                <config.icon className={`h-4 w-4 ${config.color}`} />
                                {config.label}
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Section</Label>
                      <Select
                        value={selectedSection}
                        onValueChange={(value) => {
                          setSelectedSection(value);
                          setFormFields({});
                        }}
                        disabled={!!editingContent}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select section..." />
                        </SelectTrigger>
                        <SelectContent>
                          {getAvailableSections().map(key => {
                            const template = SECTION_TEMPLATES[selectedPage]?.[key];
                            return (
                              <SelectItem key={key} value={key}>
                                {template?.label || key}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Separator />

                  {selectedSection && (
                    <>
                      {renderFormFields()}
                      
                      <div className="flex items-center gap-2 pt-2">
                        <Switch
                          checked={isVisible}
                          onCheckedChange={setIsVisible}
                        />
                        <Label>Visible on website</Label>
                      </div>
                    </>
                  )}
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave} disabled={saveContent.isPending || !selectedSection}>
                    {saveContent.isPending && <LoadingSpinner size="sm" className="mr-2" />}
                    <Save className="h-4 w-4 mr-2" />
                    {editingContent ? 'Update' : 'Create'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      <Tabs value={selectedPage} onValueChange={setSelectedPage}>
        <TabsList className="grid w-full grid-cols-6">
          {Object.entries(PAGE_CONFIG).map(([key, config]) => (
            <TabsTrigger key={key} value={key} className="flex items-center gap-2">
              <config.icon className={`h-4 w-4 ${config.color}`} />
              <span className="hidden sm:inline">{config.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={selectedPage} className="mt-6">
          {activeTab === 'images' ? (
            renderImageGallery()
          ) : (
            <div className="grid gap-4">
              {pageContent.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No content sections</h3>
                    <p className="text-muted-foreground mb-4">
                      Add content sections to customize this page
                    </p>
                    <Button onClick={handleCreate}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add First Section
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                pageContent.map((block) => {
                  const template = SECTION_TEMPLATES[block.page_slug]?.[block.section_key];
                  return (
                    <Card key={block.id} className={!block.is_visible ? 'opacity-60 border-dashed' : ''}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-lg flex items-center gap-2">
                              {template?.label || block.section_key}
                              {!block.is_visible && (
                                <span className="text-xs bg-muted px-2 py-1 rounded">Hidden</span>
                              )}
                            </CardTitle>
                            <CardDescription className="font-mono text-xs">
                              {block.section_key}
                            </CardDescription>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => toggleVisibility.mutate({ id: block.id, is_visible: !block.is_visible })}
                              title={block.is_visible ? 'Hide section' : 'Show section'}
                            >
                              {block.is_visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleEdit(block)} title="Edit">
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                if (confirm('Delete this section? This cannot be undone.')) {
                                  deleteContent.mutate(block.id);
                                }
                              }}
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="bg-muted/50 rounded-lg p-4">
                          {template ? (
                            <div className="grid gap-2 text-sm">
                              {template.fields.map(field => {
                                const value = field.type === 'array' 
                                  ? JSON.stringify(block.content, null, 2)
                                  : block.content[field.key];
                                
                                if (!value) return null;
                                
                                if (field.type === 'image' && value) {
                                  return (
                                    <div key={field.key} className="flex gap-2 items-start">
                                      <span className="font-medium text-muted-foreground min-w-[120px]">
                                        {field.label}:
                                      </span>
                                      <img 
                                        src={value} 
                                        alt={field.label}
                                        className="h-16 w-auto object-cover rounded"
                                      />
                                    </div>
                                  );
                                }
                                
                                return (
                                  <div key={field.key} className="flex gap-2">
                                    <span className="font-medium text-muted-foreground min-w-[120px]">
                                      {field.label}:
                                    </span>
                                    <span className={field.type === 'array' ? 'font-mono text-xs whitespace-pre' : 'text-foreground'}>
                                      {typeof value === 'string' 
                                        ? value.length > 100 ? `${value.substring(0, 100)}...` : value
                                        : JSON.stringify(value)}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <pre className="text-xs font-mono overflow-x-auto">
                              {JSON.stringify(block.content, null, 2)}
                            </pre>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
