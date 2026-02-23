import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Trash2, GripVertical, ChevronDown, ChevronUp } from 'lucide-react';

interface ArrayItemEditorProps {
  value: any[];
  onChange: (value: any[]) => void;
  label: string;
}

// Try to infer field names from the first item, or use common defaults
function getFieldNames(items: any[]): string[] {
  if (items.length > 0 && typeof items[0] === 'object' && items[0] !== null) {
    return Object.keys(items[0]);
  }
  return ['value', 'label'];
}

function getFieldLabel(key: string): string {
  const labelMap: Record<string, string> = {
    value: 'Value',
    label: 'Label',
    title: 'Title',
    name: 'Name',
    description: 'Description',
    icon: 'Icon',
    color: 'Color',
    link: 'Link',
    url: 'URL',
    path: 'Path',
    text: 'Text',
    quote: 'Quote',
    author: 'Author',
    role: 'Role',
    day: 'Day',
    hours: 'Hours',
    phone: 'Phone',
    email: 'Email',
    address: 'Address',
    question: 'Question',
    answer: 'Answer',
    category: 'Category',
    image: 'Image URL',
    badge: 'Badge',
    year: 'Year',
    href: 'Link URL',
    platform: 'Platform',
    amount: 'Amount',
    impact: 'Impact',
    subtitle: 'Subtitle',
  };
  return labelMap[key] || key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');
}

export function ArrayItemEditor({ value, onChange, label }: ArrayItemEditorProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const items = Array.isArray(value) ? value : [];
  const fieldNames = getFieldNames(items);

  const handleAddItem = () => {
    const newItem: Record<string, string> = {};
    fieldNames.forEach(key => {
      newItem[key] = '';
    });
    const updated = [...items, newItem];
    onChange(updated);
    setExpandedIndex(updated.length - 1);
  };

  const handleRemoveItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
    if (expandedIndex === index) setExpandedIndex(null);
  };

  const handleFieldChange = (index: number, key: string, fieldValue: string) => {
    const updated = items.map((item, i) => {
      if (i !== index) return item;
      if (typeof item === 'object' && item !== null) {
        return { ...item, [key]: fieldValue };
      }
      return fieldValue;
    });
    onChange(updated);
  };

  const getItemTitle = (item: any, index: number): string => {
    if (typeof item === 'string') return item || `Item ${index + 1}`;
    if (typeof item === 'object' && item !== null) {
      return item.title || item.name || item.label || item.value || item.question || item.day || item.platform || `Item ${index + 1}`;
    }
    return `Item ${index + 1}`;
  };

  // Handle simple string arrays
  if (items.length > 0 && typeof items[0] === 'string') {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-base font-semibold">{label}</Label>
          <Button type="button" variant="outline" size="sm" onClick={() => {
            onChange([...items, '']);
          }} className="gap-1">
            <Plus className="h-3 w-3" />
            Add
          </Button>
        </div>
        <div className="space-y-2">
          {items.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground w-6 text-center">{index + 1}</span>
              <Input
                value={item}
                onChange={(e) => {
                  const updated = [...items];
                  updated[index] = e.target.value;
                  onChange(updated);
                }}
                placeholder={`Enter value...`}
                className="flex-1"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive hover:text-destructive"
                onClick={() => handleRemoveItem(index)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          ))}
        </div>
        {items.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            No items yet. Click "Add" to create one.
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-base font-semibold">{label}</Label>
        <Button type="button" variant="outline" size="sm" onClick={handleAddItem} className="gap-1">
          <Plus className="h-3 w-3" />
          Add Item
        </Button>
      </div>
      
      <div className="space-y-2">
        {items.map((item, index) => (
          <Card key={index} className="overflow-hidden">
            <div
              className="flex items-center gap-2 px-4 py-3 cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
            >
              <GripVertical className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span className="text-xs text-muted-foreground w-5">{index + 1}.</span>
              <span className="font-medium text-sm flex-1 truncate">
                {getItemTitle(item, index)}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-destructive hover:text-destructive flex-shrink-0"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveItem(index);
                }}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
              {expandedIndex === index ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              )}
            </div>
            
            {expandedIndex === index && typeof item === 'object' && item !== null && (
              <CardContent className="pt-0 pb-4 px-4 border-t bg-muted/20">
                <div className="grid gap-3 mt-3">
                  {Object.keys(item).map(key => (
                    <div key={key} className="space-y-1">
                      <Label className="text-xs text-muted-foreground">{getFieldLabel(key)}</Label>
                      {String(item[key] || '').length > 80 ? (
                        <textarea
                          className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          value={item[key] || ''}
                          onChange={(e) => handleFieldChange(index, key, e.target.value)}
                          placeholder={`Enter ${getFieldLabel(key).toLowerCase()}...`}
                          rows={3}
                        />
                      ) : (
                        <Input
                          value={item[key] || ''}
                          onChange={(e) => handleFieldChange(index, key, e.target.value)}
                          placeholder={`Enter ${getFieldLabel(key).toLowerCase()}...`}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {items.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-4">
          No items yet. Click "Add Item" to create one.
        </p>
      )}
    </div>
  );
}
