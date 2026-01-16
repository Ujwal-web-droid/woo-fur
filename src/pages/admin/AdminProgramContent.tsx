import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Plus, Trash2, Save, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'sonner';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface PageContent {
  id: string;
  page_slug: string;
  section_key: string;
  content: Record<string, any>;
  is_visible: boolean;
  sort_order: number;
}

const PROGRAM_TABS = [
  { id: 'rescue', label: 'Rescue Program', icon: '🆘' },
  { id: 'rehabilitation', label: 'Rehabilitation', icon: '💪' },
  { id: 'therapy', label: 'Therapy Sessions', icon: '🧘' },
  { id: 'part-time-pets', label: 'Part-time Pets', icon: '⏰' },
];

// Define section schemas for each program type
const PROGRAM_SECTIONS = {
  rescue: [
    { key: 'hero', label: 'Hero Section', fields: ['badge', 'title', 'titleHighlight', 'description'] },
    { key: 'stats', label: 'Statistics', fields: ['items'] },
    { key: 'steps', label: 'Process Steps', fields: ['items'] },
    { key: 'form', label: 'Application Form', fields: ['title', 'description'] },
  ],
  rehabilitation: [
    { key: 'hero', label: 'Hero Section', fields: ['badge', 'title', 'titleHighlight', 'description'] },
    { key: 'stats', label: 'Statistics', fields: ['items'] },
    { key: 'timeline', label: 'Recovery Timeline', fields: ['title', 'description', 'items'] },
    { key: 'funding', label: 'Funding Progress', fields: ['title', 'description', 'currentFunding', 'fundingGoal', 'donationLevels'] },
    { key: 'partners', label: 'Medical Partners', fields: ['title', 'description', 'items'] },
  ],
  therapy: [
    { key: 'hero', label: 'Hero Section', fields: ['badge', 'title', 'titleHighlight', 'description'] },
    { key: 'stats', label: 'Statistics', fields: ['items'] },
    { key: 'benefits', label: 'Benefits', fields: ['title', 'description', 'items'] },
    { key: 'session_types', label: 'Session Types', fields: ['title', 'description', 'items'] },
    { key: 'handlers', label: 'Therapy Handlers', fields: ['title', 'description', 'items'] },
    { key: 'cta', label: 'Call to Action', fields: ['title', 'description', 'buttonText'] },
  ],
  'part-time-pets': [
    { key: 'hero', label: 'Hero Section', fields: ['badge', 'title', 'titleHighlight', 'description'] },
    { key: 'stats', label: 'Statistics', fields: ['items'] },
    { key: 'how_it_works', label: 'How It Works', fields: ['title', 'description', 'steps'] },
    { key: 'pricing', label: 'Pricing Options', fields: ['title', 'description', 'options'] },
    { key: 'included', label: "What's Included", fields: ['title', 'items', 'noHiddenCostsTitle', 'noHiddenCostsDescription', 'deliveryNote'] },
    { key: 'care', label: 'Care Instructions', fields: ['title', 'description', 'items'] },
    { key: 'cta', label: 'Call to Action', fields: ['title', 'description', 'buttonText'] },
  ],
};

export function AdminProgramContent() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('rescue');
  const [editedContent, setEditedContent] = useState<Record<string, Record<string, any>>>({});
  const [isSaving, setIsSaving] = useState(false);

  // Fetch all program content
  const { data: allContent, isLoading } = useQuery({
    queryKey: ['admin-program-content'],
    queryFn: async () => {
      const slugs = PROGRAM_TABS.map(t => t.id);
      const { data, error } = await supabase
        .from('page_content')
        .select('*')
        .in('page_slug', slugs)
        .order('sort_order');
      if (error) throw error;
      return data as PageContent[];
    },
  });

  // Group content by program
  const contentByProgram = allContent?.reduce((acc, item) => {
    if (!acc[item.page_slug]) {
      acc[item.page_slug] = {};
    }
    acc[item.page_slug][item.section_key] = item;
    return acc;
  }, {} as Record<string, Record<string, PageContent>>) || {};

  // Initialize edited content when data loads
  useEffect(() => {
    if (allContent && Object.keys(editedContent).length === 0) {
      const initial: Record<string, Record<string, any>> = {};
      allContent.forEach(item => {
        if (!initial[item.page_slug]) {
          initial[item.page_slug] = {};
        }
        initial[item.page_slug][item.section_key] = item.content;
      });
      setEditedContent(initial);
    }
  }, [allContent]);

  const handleContentChange = (program: string, section: string, content: any) => {
    setEditedContent(prev => ({
      ...prev,
      [program]: {
        ...prev[program],
        [section]: content,
      },
    }));
  };

  const handleSaveSection = async (program: string, section: string) => {
    setIsSaving(true);
    try {
      const content = editedContent[program]?.[section];
      const existingItem = contentByProgram[program]?.[section];

      if (existingItem) {
        const { error } = await supabase
          .from('page_content')
          .update({ content, updated_at: new Date().toISOString() })
          .eq('id', existingItem.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('page_content')
          .insert({
            page_slug: program,
            section_key: section,
            content,
            is_visible: true,
          });
        if (error) throw error;
      }

      queryClient.invalidateQueries({ queryKey: ['admin-program-content'] });
      queryClient.invalidateQueries({ queryKey: ['page-content', program] });
      toast.success(`${section} section saved!`);
    } catch (error: any) {
      toast.error('Failed to save: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveAllSections = async (program: string) => {
    setIsSaving(true);
    try {
      const sections = PROGRAM_SECTIONS[program as keyof typeof PROGRAM_SECTIONS] || [];
      
      for (const section of sections) {
        const content = editedContent[program]?.[section.key];
        if (!content) continue;

        const existingItem = contentByProgram[program]?.[section.key];

        if (existingItem) {
          const { error } = await supabase
            .from('page_content')
            .update({ content, updated_at: new Date().toISOString() })
            .eq('id', existingItem.id);
          if (error) throw error;
        } else {
          const { error } = await supabase
            .from('page_content')
            .insert({
              page_slug: program,
              section_key: section.key,
              content,
              is_visible: true,
            });
          if (error) throw error;
        }
      }

      queryClient.invalidateQueries({ queryKey: ['admin-program-content'] });
      queryClient.invalidateQueries({ queryKey: ['page-content', program] });
      toast.success('All sections saved!');
    } catch (error: any) {
      toast.error('Failed to save: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Program Page Content</h1>
          <p className="text-muted-foreground">
            Manage content for each program page with all their unique sections
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 w-full">
          {PROGRAM_TABS.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id} className="gap-2">
              <span>{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {PROGRAM_TABS.map((program) => (
          <TabsContent key={program.id} value={program.id} className="space-y-4 mt-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">{program.label} Content</h2>
              <Button onClick={() => handleSaveAllSections(program.id)} disabled={isSaving}>
                {isSaving ? <LoadingSpinner size="sm" className="mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                Save All Sections
              </Button>
            </div>

            <Accordion type="multiple" className="space-y-4" defaultValue={['hero']}>
              {PROGRAM_SECTIONS[program.id as keyof typeof PROGRAM_SECTIONS]?.map((section) => (
                <AccordionItem key={section.key} value={section.key} className="border rounded-lg">
                  <AccordionTrigger className="px-4 hover:no-underline">
                    <div className="flex items-center gap-3">
                      <span className="font-medium">{section.label}</span>
                      {contentByProgram[program.id]?.[section.key] && (
                        <span className="text-xs px-2 py-0.5 rounded bg-green-100 text-green-700">Active</span>
                      )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <SectionEditor
                      program={program.id}
                      section={section}
                      content={editedContent[program.id]?.[section.key] || contentByProgram[program.id]?.[section.key]?.content || {}}
                      onChange={(content) => handleContentChange(program.id, section.key, content)}
                      onSave={() => handleSaveSection(program.id, section.key)}
                      isSaving={isSaving}
                    />
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

// Section Editor Component
interface SectionEditorProps {
  program: string;
  section: { key: string; label: string; fields: string[] };
  content: Record<string, any>;
  onChange: (content: Record<string, any>) => void;
  onSave: () => void;
  isSaving: boolean;
}

function SectionEditor({ program, section, content, onChange, onSave, isSaving }: SectionEditorProps) {
  const updateField = (field: string, value: any) => {
    onChange({ ...content, [field]: value });
  };

  const renderFieldEditor = (field: string) => {
    const value = content[field];

    // Handle array fields (items, steps, options, etc.)
    if (field === 'items' || field === 'steps' || field === 'options' || field === 'donationLevels') {
      return (
        <ArrayFieldEditor
          key={field}
          label={field}
          items={value || []}
          program={program}
          section={section.key}
          onChange={(items) => updateField(field, items)}
        />
      );
    }

    // Handle number fields
    if (field === 'currentFunding' || field === 'fundingGoal') {
      return (
        <div key={field} className="space-y-2">
          <Label className="capitalize">{field.replace(/([A-Z])/g, ' $1')}</Label>
          <Input
            type="number"
            value={value || 0}
            onChange={(e) => updateField(field, parseInt(e.target.value) || 0)}
          />
        </div>
      );
    }

    // Handle text fields
    return (
      <div key={field} className="space-y-2">
        <Label className="capitalize">{field.replace(/([A-Z])/g, ' $1')}</Label>
        {field === 'description' || field.includes('Description') || field.includes('Note') ? (
          <Textarea
            value={value || ''}
            onChange={(e) => updateField(field, e.target.value)}
            rows={3}
          />
        ) : (
          <Input
            value={value || ''}
            onChange={(e) => updateField(field, e.target.value)}
          />
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {section.fields.map(renderFieldEditor)}
      <Button onClick={onSave} disabled={isSaving} className="mt-4">
        {isSaving ? <LoadingSpinner size="sm" className="mr-2" /> : <Save className="h-4 w-4 mr-2" />}
        Save {section.label}
      </Button>
    </div>
  );
}

// Array Field Editor Component
interface ArrayFieldEditorProps {
  label: string;
  items: any[];
  program: string;
  section: string;
  onChange: (items: any[]) => void;
}

function ArrayFieldEditor({ label, items, program, section, onChange }: ArrayFieldEditorProps) {
  const getItemTemplate = () => {
    // Different templates based on program and section
    if (label === 'items' && section === 'stats') {
      return { value: '', label: '' };
    }
    if (label === 'items' && section === 'steps') {
      return { icon: 'Heart', title: '', description: '' };
    }
    if (label === 'items' && section === 'timeline') {
      return { phase: '', description: '', duration: '' };
    }
    if (label === 'items' && section === 'benefits') {
      return { icon: 'Heart', title: '', description: '' };
    }
    if (label === 'items' && section === 'session_types') {
      return { title: '', description: '', duration: '', price: '' };
    }
    if (label === 'items' && section === 'handlers') {
      return { name: '', role: '', years: 0, certifications: [] };
    }
    if (label === 'items' && section === 'partners') {
      return { name: '', specialty: '', years: 0 };
    }
    if (label === 'items' && section === 'care') {
      return { title: '', content: '' };
    }
    if (label === 'steps' && section === 'how_it_works') {
      return { icon: 'Heart', title: '', description: '' };
    }
    if (label === 'options' && section === 'pricing') {
      return { duration: '', days: '', price: '', description: '', popular: false };
    }
    if (label === 'donationLevels') {
      return { amount: '', description: '' };
    }
    // Default to stats-like item
    return { value: '', label: '' };
  };

  const addItem = () => {
    onChange([...items, getItemTemplate()]);
  };

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: string, value: any) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const renderItemFields = (item: any, index: number) => {
    const fields = Object.keys(item);
    return (
      <div className="flex gap-2 items-start flex-wrap">
        {fields.map((field) => {
          if (field === 'popular') {
            return (
              <div key={field} className="flex items-center gap-2">
                <Switch
                  checked={item[field]}
                  onCheckedChange={(checked) => updateItem(index, field, checked)}
                />
                <Label className="text-xs">Popular</Label>
              </div>
            );
          }
          if (field === 'certifications') {
            return (
              <div key={field} className="flex-1 min-w-[150px]">
                <Input
                  placeholder="Certifications (comma-separated)"
                  value={Array.isArray(item[field]) ? item[field].join(', ') : ''}
                  onChange={(e) => updateItem(index, field, e.target.value.split(',').map(s => s.trim()))}
                />
              </div>
            );
          }
          if (typeof item[field] === 'number' && field !== 'years') {
            return (
              <Input
                key={field}
                type="number"
                placeholder={field}
                value={item[field]}
                onChange={(e) => updateItem(index, field, parseInt(e.target.value) || 0)}
                className="flex-1 min-w-[80px] max-w-[100px]"
              />
            );
          }
          if (field === 'years') {
            return (
              <Input
                key={field}
                type="number"
                placeholder="Years"
                value={item[field]}
                onChange={(e) => updateItem(index, field, parseInt(e.target.value) || 0)}
                className="w-20"
              />
            );
          }
          if (field === 'content' || field === 'description') {
            return (
              <Textarea
                key={field}
                placeholder={field}
                value={item[field] || ''}
                onChange={(e) => updateItem(index, field, e.target.value)}
                className="flex-1 min-w-[200px]"
                rows={2}
              />
            );
          }
          return (
            <Input
              key={field}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              value={item[field] || ''}
              onChange={(e) => updateItem(index, field, e.target.value)}
              className="flex-1 min-w-[100px]"
            />
          );
        })}
        <Button variant="ghost" size="icon" onClick={() => removeItem(index)}>
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </div>
    );
  };

  return (
    <div className="space-y-3">
      <Label className="capitalize">{label}</Label>
      <div className="space-y-2">
        {items.map((item, index) => (
          <Card key={index} className="p-3">
            {renderItemFields(item, index)}
          </Card>
        ))}
      </div>
      <Button variant="outline" size="sm" onClick={addItem}>
        <Plus className="h-4 w-4 mr-2" />
        Add {label === 'items' ? 'Item' : label.slice(0, -1)}
      </Button>
    </div>
  );
}
