import { useState } from 'react';
import { useSiteConfig, useFeatureFlags } from '@/hooks/useAdmin';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Settings, ToggleLeft, Save } from 'lucide-react';

export function AdminSettings() {
  const { configs, isLoading: configLoading, updateConfig } = useSiteConfig();
  const { flags, isLoading: flagsLoading, toggleFlag } = useFeatureFlags();
  const [editedConfigs, setEditedConfigs] = useState<Record<string, any>>({});

  const handleConfigChange = (key: string, value: any) => {
    setEditedConfigs(prev => ({ ...prev, [key]: value }));
  };

  const saveConfig = (key: string) => {
    if (editedConfigs[key] !== undefined) {
      updateConfig.mutate({ key, value: editedConfigs[key] });
      setEditedConfigs(prev => {
        const newState = { ...prev };
        delete newState[key];
        return newState;
      });
    }
  };

  const getConfigValue = (config: any) => {
    if (editedConfigs[config.key] !== undefined) {
      return editedConfigs[config.key];
    }
    try {
      return typeof config.value === 'string' ? JSON.parse(config.value) : config.value;
    } catch {
      return config.value;
    }
  };

  const groupedConfigs = configs?.reduce((acc, config) => {
    if (!acc[config.category]) acc[config.category] = [];
    acc[config.category].push(config);
    return acc;
  }, {} as Record<string, typeof configs>) || {};

  if (configLoading || flagsLoading) {
    return <div className="flex justify-center py-8"><LoadingSpinner size="lg" /></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Settings</h2>
        <p className="text-muted-foreground">Configure site settings and feature flags</p>
      </div>

      <Tabs defaultValue="config">
        <TabsList>
          <TabsTrigger value="config" className="gap-2">
            <Settings className="h-4 w-4" />
            Site Configuration
          </TabsTrigger>
          <TabsTrigger value="features" className="gap-2">
            <ToggleLeft className="h-4 w-4" />
            Feature Flags
          </TabsTrigger>
        </TabsList>

        <TabsContent value="config" className="space-y-4 mt-4">
          {Object.entries(groupedConfigs).map(([category, categoryConfigs]) => (
            <Card key={category}>
              <CardHeader>
                <CardTitle className="capitalize">{category} Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {categoryConfigs?.map((config) => {
                  const value = getConfigValue(config);
                  const hasChanges = editedConfigs[config.key] !== undefined;
                  const isBooleanValue = typeof value === 'boolean';

                  return (
                    <div key={config.key} className="flex items-center justify-between gap-4 py-2 border-b last:border-0">
                      <div className="flex-1">
                        <Label className="font-medium">{config.key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</Label>
                        {config.description && (
                          <p className="text-sm text-muted-foreground">{config.description}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {isBooleanValue ? (
                          <Switch
                            checked={value}
                            onCheckedChange={(checked) => handleConfigChange(config.key, checked)}
                          />
                        ) : (
                          <Input
                            value={String(value)}
                            onChange={(e) => handleConfigChange(config.key, e.target.value)}
                            className="w-48"
                          />
                        )}
                        {hasChanges && (
                          <Button size="sm" onClick={() => saveConfig(config.key)}>
                            <Save className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="features" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Feature Flags</CardTitle>
              <CardDescription>
                Enable or disable features across the website instantly
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {flags?.map((flag) => (
                <div key={flag.key} className="flex items-center justify-between py-3 border-b last:border-0">
                  <div>
                    <Label className="font-medium">
                      {flag.key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </Label>
                    {flag.description && (
                      <p className="text-sm text-muted-foreground">{flag.description}</p>
                    )}
                  </div>
                  <Switch
                    checked={flag.enabled}
                    onCheckedChange={(enabled) => toggleFlag.mutate({ key: flag.key, enabled })}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
