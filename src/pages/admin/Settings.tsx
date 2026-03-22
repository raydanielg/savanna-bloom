import { useState, useEffect } from "react";
import axios from "@/lib/axios";
import { useNavigate } from "react-router-dom";
import AdminLayout from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Settings,
  Globe,
  Palette,
  Wrench,
  Mail,
  FileText,
  Save,
  Eye,
  Edit,
  Trash2,
  Plus,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw
} from "lucide-react";

interface Setting {
  id: number;
  key: string;
  value: string;
  type: string;
  group: string;
  label: string;
  description: string;
}

interface EmailTemplate {
  id: number;
  name: string;
  slug: string;
  subject: string;
  body: string;
  variables: string[];
  active: boolean;
}

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<Record<string, Setting[]>>({});
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [activeTab, setActiveTab] = useState("general");
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [templateDialog, setTemplateDialog] = useState(false);
  const [previewDialog, setPreviewDialog] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);
  const [previewContent, setPreviewContent] = useState({ subject: "", body: "" });
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [templateForm, setTemplateForm] = useState({
    name: "",
    slug: "",
    subject: "",
    body: "",
    active: true,
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    try {
      const userResponse = await axios.get("/api/user");
      setUser(userResponse.data);

      const settingsResponse = await axios.get("/api/admin/settings");
      const grouped = settingsResponse.data.settings || {};
      setSettings(grouped);
      setTemplates(settingsResponse.data.templates || []);

      // Flatten settings for form
      const flat: Record<string, string> = {};
      Object.values(grouped).flat().forEach((s: any) => {
        flat[s.key] = s.value || "";
      });
      setFormData(flat);

      setMaintenanceMode(flat['maintenance_mode'] === 'true');
    } catch (error) {
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (group: string) => {
    setSaving(true);
    try {
      const groupSettings = settings[group] || [];
      const updateData: Record<string, string> = {};
      
      groupSettings.forEach((s) => {
        if (formData[s.key] !== undefined) {
          updateData[s.key] = formData[s.key];
        }
      });

      await axios.post("/api/admin/settings", updateData);
      
      if (group === 'maintenance') {
        setMaintenanceMode(formData['maintenance_mode'] === 'true');
      }
      
      alert("Settings saved successfully!");
    } catch (error) {
      console.error("Failed to save settings:", error);
      alert("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleMaintenance = async () => {
    try {
      const response = await axios.post("/api/admin/settings/toggle-maintenance");
      setMaintenanceMode(response.data.maintenance_mode === 'true');
      setFormData({ ...formData, maintenance_mode: response.data.maintenance_mode });
      alert(response.data.message);
    } catch (error) {
      console.error("Failed to toggle maintenance mode:", error);
    }
  };

  const handleOpenTemplate = (template?: EmailTemplate) => {
    if (template) {
      setEditingTemplate(template);
      setTemplateForm({
        name: template.name,
        slug: template.slug,
        subject: template.subject,
        body: template.body,
        active: template.active,
      });
    } else {
      setEditingTemplate(null);
      setTemplateForm({
        name: "",
        slug: "",
        subject: "",
        body: "",
        active: true,
      });
    }
    setTemplateDialog(true);
  };

  const handleSaveTemplate = async () => {
    try {
      if (editingTemplate) {
        const response = await axios.put(`/api/admin/email-templates/${editingTemplate.id}`, templateForm);
        setTemplates(templates.map(t => t.id === editingTemplate.id ? response.data : t));
      } else {
        const response = await axios.post("/api/admin/email-templates", templateForm);
        setTemplates([...templates, response.data]);
      }
      setTemplateDialog(false);
    } catch (error) {
      console.error("Failed to save template:", error);
    }
  };

  const handleDeleteTemplate = async (id: number) => {
    if (!confirm("Are you sure you want to delete this template?")) return;
    try {
      await axios.delete(`/api/admin/email-templates/${id}`);
      setTemplates(templates.filter(t => t.id !== id));
    } catch (error) {
      console.error("Failed to delete template:", error);
    }
  };

  const handlePreviewTemplate = async (id: number) => {
    try {
      const response = await axios.get(`/api/admin/email-templates/${id}/preview`);
      setPreviewContent(response.data);
      setPreviewDialog(true);
    } catch (error) {
      console.error("Failed to preview template:", error);
    }
  };

  const renderSettingInput = (setting: Setting) => {
    switch (setting.type) {
      case 'boolean':
        return (
          <div className="flex items-center gap-2">
            <Switch
              id={setting.key}
              checked={formData[setting.key] === 'true'}
              onCheckedChange={(checked) => setFormData({ ...formData, [setting.key]: checked ? 'true' : 'false' })}
            />
            <Label htmlFor={setting.key} className="font-normal">
              {formData[setting.key] === 'true' ? 'Enabled' : 'Disabled'}
            </Label>
          </div>
        );
      case 'textarea':
        return (
          <Textarea
            id={setting.key}
            value={formData[setting.key] || ''}
            onChange={(e) => setFormData({ ...formData, [setting.key]: e.target.value })}
            placeholder={setting.label}
            rows={3}
          />
        );
      case 'image':
        return (
          <div className="space-y-2">
            <Input
              id={setting.key}
              value={formData[setting.key] || ''}
              onChange={(e) => setFormData({ ...formData, [setting.key]: e.target.value })}
              placeholder="Image URL"
            />
            {formData[setting.key] && (
              <img src={formData[setting.key]} alt={setting.label} className="h-16 rounded border" />
            )}
          </div>
        );
      default:
        return (
          <Input
            id={setting.key}
            value={formData[setting.key] || ''}
            onChange={(e) => setFormData({ ...formData, [setting.key]: e.target.value })}
            placeholder={setting.label}
          />
        );
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex h-[60vh] items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-orange-200 border-t-orange-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout user={user}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-500">Manage your website settings and configuration</p>
        </div>
        {maintenanceMode && (
          <Badge className="bg-yellow-100 text-yellow-700 border-yellow-300 px-4 py-2">
            <AlertTriangle className="h-4 w-4 mr-2" />
            Maintenance Mode Active
          </Badge>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-5 w-full max-w-2xl">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Appearance
          </TabsTrigger>
          <TabsTrigger value="maintenance" className="flex items-center gap-2">
            <Wrench className="h-4 w-4" />
            Maintenance
          </TabsTrigger>
          <TabsTrigger value="smtp" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            SMTP
          </TabsTrigger>
          <TabsTrigger value="emails" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Emails
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-orange-600" />
                General Settings
              </CardTitle>
              <CardDescription>Basic site information and contact details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(settings.general || []).map((setting) => (
                  <div key={setting.key} className="space-y-2">
                    <Label htmlFor={setting.key}>{setting.label}</Label>
                    {renderSettingInput(setting)}
                    {setting.description && (
                      <p className="text-xs text-gray-500">{setting.description}</p>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-end">
                <Button className="bg-orange-600 hover:bg-orange-700" onClick={() => handleSave('general')} disabled={saving}>
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Settings */}
        <TabsContent value="appearance">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-orange-600" />
                Appearance Settings
              </CardTitle>
              <CardDescription>Customize your site's look and feel</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(settings.appearance || []).map((setting) => (
                  <div key={setting.key} className="space-y-2">
                    <Label htmlFor={setting.key}>{setting.label}</Label>
                    {renderSettingInput(setting)}
                    {setting.description && (
                      <p className="text-xs text-gray-500">{setting.description}</p>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-end">
                <Button className="bg-orange-600 hover:bg-orange-700" onClick={() => handleSave('appearance')} disabled={saving}>
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Maintenance Settings */}
        <TabsContent value="maintenance">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="h-5 w-5 text-orange-600" />
                Maintenance Mode
              </CardTitle>
              <CardDescription>Control site availability for maintenance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-800">Maintenance Mode</h4>
                    <p className="text-sm text-yellow-700 mt-1">
                      When enabled, visitors will see a maintenance page. Only administrators can access the site.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">Maintenance Mode Status</p>
                  <p className="text-sm text-gray-500">
                    {maintenanceMode ? 'Site is currently under maintenance' : 'Site is live and accessible'}
                  </p>
                </div>
                <Button
                  variant={maintenanceMode ? "destructive" : "default"}
                  onClick={handleToggleMaintenance}
                  className={maintenanceMode ? "" : "bg-green-600 hover:bg-green-700"}
                >
                  {maintenanceMode ? (
                    <>
                      <XCircle className="h-4 w-4 mr-2" />
                      Disable Maintenance
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Enable Maintenance
                    </>
                  )}
                </Button>
              </div>

              <div className="space-y-4">
                {(settings.maintenance || []).filter(s => s.key !== 'maintenance_mode').map((setting) => (
                  <div key={setting.key} className="space-y-2">
                    <Label htmlFor={setting.key}>{setting.label}</Label>
                    {renderSettingInput(setting)}
                    {setting.description && (
                      <p className="text-xs text-gray-500">{setting.description}</p>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex justify-end">
                <Button className="bg-orange-600 hover:bg-orange-700" onClick={() => handleSave('maintenance')} disabled={saving}>
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SMTP Settings */}
        <TabsContent value="smtp">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-orange-600" />
                SMTP Configuration
              </CardTitle>
              <CardDescription>Email server settings for sending emails</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-800">Email Configuration</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      Configure your SMTP server to send emails for bookings, inquiries, and notifications.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(settings.smtp || []).map((setting) => (
                  <div key={setting.key} className="space-y-2">
                    <Label htmlFor={setting.key}>{setting.label}</Label>
                    <Input
                      id={setting.key}
                      type={setting.key.includes('password') ? 'password' : 'text'}
                      value={formData[setting.key] || ''}
                      onChange={(e) => setFormData({ ...formData, [setting.key]: e.target.value })}
                      placeholder={setting.label}
                    />
                    {setting.description && (
                      <p className="text-xs text-gray-500">{setting.description}</p>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="outline">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Test Connection
                </Button>
                <Button className="bg-orange-600 hover:bg-orange-700" onClick={() => handleSave('smtp')} disabled={saving}>
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email Templates */}
        <TabsContent value="emails">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-orange-600" />
                    Email Templates
                  </CardTitle>
                  <CardDescription>Customize email templates for notifications</CardDescription>
                </div>
                <Button className="bg-orange-600 hover:bg-orange-700" onClick={() => handleOpenTemplate()}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Template
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {templates.map((template) => (
                  <div key={template.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <Mail className="h-5 w-5 text-orange-600" />
                      </div>
                      <div>
                        <p className="font-medium">{template.name}</p>
                        <p className="text-sm text-gray-500">{template.subject}</p>
                        <div className="flex gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">{template.slug}</Badge>
                          {template.active ? (
                            <Badge className="bg-green-100 text-green-700 text-xs">Active</Badge>
                          ) : (
                            <Badge className="bg-gray-100 text-gray-600 text-xs">Inactive</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => handlePreviewTemplate(template.id)}>
                        <Eye className="h-4 w-4 mr-1" />
                        Preview
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleOpenTemplate(template)}>
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteTemplate(template.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}

                {templates.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No email templates found. Click "Add Template" to create one.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Template Dialog */}
      <Dialog open={templateDialog} onOpenChange={setTemplateDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingTemplate ? 'Edit Email Template' : 'Add Email Template'}</DialogTitle>
            <DialogDescription>
              Create or update email template with variables like {'{{customer_name}}'}, {'{{site_name}}'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Template Name</Label>
                <Input
                  value={templateForm.name}
                  onChange={(e) => setTemplateForm({ ...templateForm, name: e.target.value })}
                  placeholder="e.g., Booking Confirmation"
                />
              </div>
              <div className="space-y-2">
                <Label>Slug</Label>
                <Input
                  value={templateForm.slug}
                  onChange={(e) => setTemplateForm({ ...templateForm, slug: e.target.value })}
                  placeholder="e.g., booking-confirmation"
                  disabled={!!editingTemplate}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Subject</Label>
              <Input
                value={templateForm.subject}
                onChange={(e) => setTemplateForm({ ...templateForm, subject: e.target.value })}
                placeholder="Email subject line"
              />
            </div>
            <div className="space-y-2">
              <Label>Body (HTML)</Label>
              <Textarea
                value={templateForm.body}
                onChange={(e) => setTemplateForm({ ...templateForm, body: e.target.value })}
                placeholder="<h2>Hello {{customer_name}}</h2><p>Your booking is confirmed...</p>"
                rows={10}
                className="font-mono text-sm"
              />
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="template-active"
                checked={templateForm.active}
                onCheckedChange={(checked) => setTemplateForm({ ...templateForm, active: checked })}
              />
              <Label htmlFor="template-active">Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTemplateDialog(false)}>
              Cancel
            </Button>
            <Button className="bg-orange-600 hover:bg-orange-700" onClick={handleSaveTemplate}>
              {editingTemplate ? 'Update' : 'Create'} Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={previewDialog} onOpenChange={setPreviewDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Email Preview</DialogTitle>
            <DialogDescription>Preview of how the email will look</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-sm text-gray-500">Subject</Label>
              <p className="font-medium">{previewContent.subject}</p>
            </div>
            <div>
              <Label className="text-sm text-gray-500">Body</Label>
              <div 
                className="mt-2 p-4 bg-gray-50 rounded-lg border"
                dangerouslySetInnerHTML={{ __html: previewContent.body }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPreviewDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
