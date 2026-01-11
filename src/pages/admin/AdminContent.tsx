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
import { Plus, Pencil, Trash2, Eye, EyeOff, Save, FileText, Home, Info, Phone, LayoutTemplate, Heart, Image as ImageIcon, Users, HelpCircle, Calendar, Menu } from 'lucide-react';
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
  volunteer: { label: 'Volunteer', icon: Users, color: 'text-teal-500' },
  booking: { label: 'Booking', icon: Calendar, color: 'text-indigo-500' },
  faq: { label: 'FAQ', icon: HelpCircle, color: 'text-yellow-500' },
  header: { label: 'Header', icon: Menu, color: 'text-red-500' },
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
      ],
    },
  },
  about: {
    hero: {
      label: 'Hero Section',
      fields: [
        { key: 'title', label: 'Page Title', type: 'text' },
        { key: 'description', label: 'Page Description', type: 'textarea' },
      ],
    },
    founder: {
      label: 'Founder Story',
      fields: [
        { key: 'title', label: 'Section Title', type: 'text' },
        { key: 'content', label: 'Story Content', type: 'textarea' },
        { key: 'quote', label: 'Quote', type: 'textarea' },
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
        { key: 'description', label: 'Description', type: 'textarea' },
        { key: 'members', label: 'Team Members (JSON Array)', type: 'array' },
      ],
    },
    milestones: {
      label: 'Timeline/Milestones',
      fields: [
        { key: 'title', label: 'Section Title', type: 'text' },
        { key: 'description', label: 'Description', type: 'textarea' },
        { key: 'items', label: 'Milestones (JSON Array)', type: 'array' },
      ],
    },
    values: {
      label: 'Core Values',
      fields: [
        { key: 'title', label: 'Section Title', type: 'text' },
        { key: 'description', label: 'Description', type: 'textarea' },
        { key: 'items', label: 'Values (JSON Array)', type: 'array' },
      ],
    },
    awards: {
      label: 'Awards',
      fields: [{ key: 'items', label: 'Awards (JSON Array)', type: 'array' }],
    },
  },
  contact: {
    hero: {
      label: 'Hero Section',
      fields: [
        { key: 'badge', label: 'Badge Text', type: 'text' },
        { key: 'title', label: 'Page Title', type: 'text' },
        { key: 'titleHighlight', label: 'Title Highlight', type: 'text' },
        { key: 'description', label: 'Page Description', type: 'textarea' },
      ],
    },
    info: {
      label: 'Contact Information',
      fields: [
        { key: 'address', label: 'Address', type: 'text' },
        { key: 'phone', label: 'Phone Number', type: 'text' },
        { key: 'emergencyPhone', label: 'Emergency Phone', type: 'text' },
        { key: 'email', label: 'Email Address', type: 'text' },
        { key: 'responseTime', label: 'Response Time Text', type: 'text' },
      ],
    },
    hours: {
      label: 'Operating Hours',
      fields: [
        { key: 'title', label: 'Section Title', type: 'text' },
        { key: 'note', label: 'Note Text', type: 'textarea' },
        { key: 'items', label: 'Hours (JSON Array)', type: 'array' },
      ],
    },
    social: {
      label: 'Social Media',
      fields: [
        { key: 'title', label: 'Section Title', type: 'text' },
        { key: 'description', label: 'Description', type: 'textarea' },
        { key: 'items', label: 'Social Links (JSON Array)', type: 'array' },
      ],
    },
    reasons: {
      label: 'Contact Reasons',
      fields: [{ key: 'items', label: 'Reasons (JSON Array)', type: 'array' }],
    },
  },
  programs: {
    hero: {
      label: 'Hero Section',
      fields: [
        { key: 'badge', label: 'Badge Text', type: 'text' },
        { key: 'title', label: 'Title', type: 'text' },
        { key: 'titleHighlight', label: 'Title Highlight', type: 'text' },
        { key: 'description', label: 'Description', type: 'textarea' },
      ],
    },
    programs_list: {
      label: 'Programs List',
      fields: [{ key: 'items', label: 'Programs (JSON Array)', type: 'array' }],
    },
    process: {
      label: 'How It Works',
      fields: [
        { key: 'badge', label: 'Badge Text', type: 'text' },
        { key: 'title', label: 'Section Title', type: 'text' },
        { key: 'steps', label: 'Process Steps (JSON Array)', type: 'array' },
      ],
    },
    cta: {
      label: 'Call to Action',
      fields: [
        { key: 'title', label: 'CTA Title', type: 'text' },
        { key: 'description', label: 'CTA Description', type: 'textarea' },
        { key: 'buttonPrimary', label: 'Primary Button', type: 'text' },
        { key: 'buttonSecondary', label: 'Secondary Button', type: 'text' },
      ],
    },
  },
  support: {
    hero: {
      label: 'Hero Section',
      fields: [
        { key: 'badge', label: 'Badge Text', type: 'text' },
        { key: 'title', label: 'Title', type: 'text' },
        { key: 'titleHighlight', label: 'Title Highlight', type: 'text' },
        { key: 'description', label: 'Description', type: 'textarea' },
      ],
    },
    donation: {
      label: 'Donation Section',
      fields: [
        { key: 'title', label: 'Section Title', type: 'text' },
        { key: 'amounts', label: 'Donation Amounts (JSON Array)', type: 'array' },
        { key: 'minimumAmount', label: 'Minimum Amount', type: 'text' },
      ],
    },
    impact: {
      label: 'Impact Section',
      fields: [
        { key: 'title', label: 'Section Title', type: 'text' },
        { key: 'items', label: 'Impact Items (JSON Array)', type: 'array' },
      ],
    },
    testimonial: {
      label: 'Donor Testimonial',
      fields: [
        { key: 'quote', label: 'Quote', type: 'textarea' },
        { key: 'author', label: 'Author Name', type: 'text' },
        { key: 'role', label: 'Author Role', type: 'text' },
      ],
    },
    corporate: {
      label: 'Corporate Partnerships',
      fields: [
        { key: 'title', label: 'Section Title', type: 'text' },
        { key: 'description', label: 'Description', type: 'textarea' },
        { key: 'items', label: 'Partnership Types (JSON Array)', type: 'array' },
      ],
    },
  },
  volunteer: {
    hero: {
      label: 'Hero Section',
      fields: [
        { key: 'badge', label: 'Badge Text', type: 'text' },
        { key: 'title', label: 'Title', type: 'text' },
        { key: 'titleHighlight', label: 'Title Highlight', type: 'text' },
        { key: 'description', label: 'Description', type: 'textarea' },
        { key: 'buttonText', label: 'Button Text', type: 'text' },
      ],
    },
    stats: {
      label: 'Statistics',
      fields: [{ key: 'items', label: 'Stats Items (JSON Array)', type: 'array' }],
    },
    skills: {
      label: 'Skills Options',
      fields: [{ key: 'items', label: 'Skills (JSON Array)', type: 'array' }],
    },
    availability: {
      label: 'Availability Options',
      fields: [{ key: 'items', label: 'Availability Options (JSON Array)', type: 'array' }],
    },
    benefits: {
      label: 'Benefits Section',
      fields: [
        { key: 'title', label: 'Section Title', type: 'text' },
        { key: 'items', label: 'Benefits (JSON Array)', type: 'array' },
      ],
    },
  },
  booking: {
    hero: {
      label: 'Hero Section',
      fields: [
        { key: 'badge', label: 'Badge Text', type: 'text' },
        { key: 'title', label: 'Title', type: 'text' },
        { key: 'titleHighlight', label: 'Title Highlight', type: 'text' },
        { key: 'description', label: 'Description', type: 'textarea' },
      ],
    },
    services: {
      label: 'Service Types',
      fields: [{ key: 'items', label: 'Services (JSON Array)', type: 'array' }],
    },
    steps: {
      label: 'Booking Steps',
      fields: [{ key: 'items', label: 'Steps (JSON Array)', type: 'array' }],
    },
  },
  faq: {
    hero: {
      label: 'Hero Section',
      fields: [
        { key: 'badge', label: 'Badge Text', type: 'text' },
        { key: 'title', label: 'Title', type: 'text' },
        { key: 'titleHighlight', label: 'Title Highlight', type: 'text' },
        { key: 'description', label: 'Description', type: 'textarea' },
      ],
    },
    categories: {
      label: 'FAQ Categories',
      fields: [{ key: 'items', label: 'Categories (JSON Array)', type: 'array' }],
    },
    popular_topics: {
      label: 'Popular Topics',
      fields: [
        { key: 'title', label: 'Section Title', type: 'text' },
        { key: 'items', label: 'Topics (JSON Array)', type: 'array' },
      ],
    },
  },
  header: {
    navigation: {
      label: 'Navigation Links',
      fields: [{ key: 'items', label: 'Nav Links (JSON Array)', type: 'array' }],
    },
    cta: {
      label: 'Header CTA Buttons',
      fields: [
        { key: 'donateText', label: 'Donate Button Text', type: 'text' },
        { key: 'bookText', label: 'Book Button Text', type: 'text' },
        { key: 'donatePath', label: 'Donate Link Path', type: 'text' },
        { key: 'bookPath', label: 'Book Link Path', type: 'text' },
      ],
    },
    brand: {
      label: 'Brand Settings',
      fields: [
        { key: 'name', label: 'Site Name', type: 'text' },
        { key: 'logoAlt', label: 'Logo Alt Text', type: 'text' },
      ],
    },
  },
  footer: {
    brand: {
      label: 'Brand Section',
      fields: [
        { key: 'tagline', label: 'Tagline', type: 'textarea' },
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
  { key: 'volunteer-hero', label: 'Volunteer Page Hero', page: 'volunteer', aspectRatio: '16/9' },
  { key: 'booking-hero', label: 'Booking Page Hero', page: 'booking', aspectRatio: '16/9' },
  { key: 'faq-hero', label: 'FAQ Page Hero', page: 'faq', aspectRatio: '16/9' },
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
          // For array fields, check if the content itself is an array or if it has an items key
          const arrayContent = block.content[field.key] || block.content.items || block.content;
          fields[field.key] = JSON.stringify(Array.isArray(arrayContent) ? arrayContent : block.content, null, 2);
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
      const hasArrayField = template.fields.some(f => f.type === 'array');
      if (hasArrayField) {
        // For array-only sections, parse the array field
        const arrayField = template.fields.find(f => f.type === 'array');
        if (arrayField) {
          try {
            const parsedArray = JSON.parse(formFields[arrayField.key] || formFields['items'] || '[]');
            // Include other non-array fields
            template.fields.forEach(field => {
              if (field.type !== 'array') {
                contentObj[field.key] = formFields[field.key] || '';
              }
            });
            contentObj[arrayField.key] = parsedArray;
          } catch {
            toast({ title: 'Invalid JSON format', variant: 'destructive' });
            return;
          }
        }
      } else {
        template.fields.forEach(field => {
          contentObj[field.key] = formFields[field.key] || '';
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
                value={formFields[field.key] || '[]'}
                onChange={(e) => setFormFields({ ...formFields, [field.key]: e.target.value })}
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
      <div className="space-y-6">
        <div className="text-sm text-muted-foreground mb-4">
          Upload and manage images for this page. Changes are applied instantly.
        </div>
        
        {pageImages.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No image slots defined for this page.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {pageImages.map(slot => (
              <Card key={slot.key}>
                <CardContent className="p-4">
                  <ImageUploader
                    imageKey={slot.key}
                    currentUrl={currentImages[slot.key]}
                    pageSlug={slot.page}
                    sectionKey={slot.key}
                    label={slot.label}
                    aspectRatio={slot.aspectRatio}
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Content Management</h1>
          <p className="text-muted-foreground">Edit all website content from a single place</p>
        </div>
      </div>

      {/* Page Selector */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(PAGE_CONFIG).map(([key, config]) => {
          const Icon = config.icon;
          const pageContentCount = content?.filter(c => c.page_slug === key).length || 0;
          return (
            <Button
              key={key}
              variant={selectedPage === key ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedPage(key)}
              className="gap-2"
            >
              <Icon className={`h-4 w-4 ${selectedPage === key ? '' : config.color}`} />
              {config.label}
              {pageContentCount > 0 && (
                <span className="ml-1 text-xs bg-muted px-1.5 py-0.5 rounded-full">
                  {pageContentCount}
                </span>
              )}
            </Button>
          );
        })}
      </div>

      {/* Tabs for Content vs Images */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'content' | 'images')}>
        <TabsList>
          <TabsTrigger value="content" className="gap-2">
            <FileText className="h-4 w-4" />
            Content Sections
          </TabsTrigger>
          <TabsTrigger value="images" className="gap-2">
            <ImageIcon className="h-4 w-4" />
            Images
          </TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              {PAGE_CONFIG[selectedPage as keyof typeof PAGE_CONFIG]?.label} Page Content
            </h2>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={handleCreate} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Section
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingContent ? 'Edit Content Section' : 'Add New Content Section'}
                  </DialogTitle>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Section Type</Label>
                    <Select value={selectedSection} onValueChange={setSelectedSection}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a section..." />
                      </SelectTrigger>
                      <SelectContent>
                        {getAvailableSections().map(key => (
                          <SelectItem key={key} value={key}>
                            {SECTION_TEMPLATES[selectedPage]?.[key]?.label || key}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedSection && (
                    <>
                      <Separator />
                      {renderFormFields()}
                      
                      <div className="flex items-center gap-2">
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
                  <Button onClick={handleSave} disabled={!selectedSection} className="gap-2">
                    <Save className="h-4 w-4" />
                    Save
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {pageContent.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                No content sections found for this page. Click "Add Section" to get started.
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {pageContent.map((block) => {
                const template = SECTION_TEMPLATES[block.page_slug]?.[block.section_key];
                return (
                  <Card key={block.id} className={!block.is_visible ? 'opacity-60' : ''}>
                    <CardHeader className="py-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg flex items-center gap-2">
                            {template?.label || block.section_key}
                            {!block.is_visible && (
                              <span className="text-xs bg-muted px-2 py-1 rounded">Hidden</span>
                            )}
                          </CardTitle>
                          <CardDescription>
                            Section: {block.section_key} • Updated: {new Date(block.updated_at).toLocaleDateString()}
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => toggleVisibility.mutate({ id: block.id, is_visible: !block.is_visible })}
                          >
                            {block.is_visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(block)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              if (confirm('Delete this section?')) {
                                deleteContent.mutate(block.id);
                              }
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <pre className="text-xs bg-muted p-3 rounded-md overflow-x-auto max-h-32">
                        {JSON.stringify(block.content, null, 2)}
                      </pre>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="images" className="mt-6">
          {renderImageGallery()}
        </TabsContent>
      </Tabs>
    </div>
  );
}