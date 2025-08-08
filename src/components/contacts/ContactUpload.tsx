import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { FileUp, Upload, CheckCircle, XCircle, Users, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Contact {
  email: string;
  first_name?: string;
  last_name?: string;
  company?: string;
  title?: string;
}

interface Campaign {
  id: string;
  name: string;
  status: string;
}

export const ContactUpload = () => {
  const [selectedCampaign, setSelectedCampaign] = useState<string>("");
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [validContacts, setValidContacts] = useState<Contact[]>([]);
  const [invalidContacts, setInvalidContacts] = useState<Contact[]>([]);
  const { toast } = useToast();

  // Fetch campaigns on component mount
  useState(() => {
    fetchCampaigns();
  });

  const fetchCampaigns = async () => {
    try {
      const { data, error } = await supabase
        .from("campaigns")
        .select("id, name, status")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setCampaigns(data || []);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      toast({
        title: "Error",
        description: "Failed to fetch campaigns",
        variant: "destructive",
      });
    }
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const processFile = useCallback(async (file: File) => {
    setIsProcessing(true);
    setUploadProgress(0);

    try {
      const text = await file.text();
      let rows: string[][] = [];

      if (file.name.endsWith('.csv')) {
        // Simple CSV parsing
        rows = text.split('\n').map(row => 
          row.split(',').map(cell => cell.trim().replace(/^["']|["']$/g, ''))
        );
      } else if (file.name.endsWith('.xlsx')) {
        toast({
          title: "XLSX Support",
          description: "XLSX support will be added in the next update. Please use CSV for now.",
          variant: "destructive",
        });
        setIsProcessing(false);
        return;
      }

      // Assume first row is headers
      const headers = rows[0]?.map(h => h.toLowerCase()) || [];
      const dataRows = rows.slice(1).filter(row => row.some(cell => cell.trim()));

      const emailIndex = headers.findIndex(h => 
        h.includes('email') || h.includes('e-mail') || h.includes('mail')
      );
      const firstNameIndex = headers.findIndex(h => 
        h.includes('first') || h.includes('fname') || h.includes('given')
      );
      const lastNameIndex = headers.findIndex(h => 
        h.includes('last') || h.includes('lname') || h.includes('surname') || h.includes('family')
      );
      const companyIndex = headers.findIndex(h => 
        h.includes('company') || h.includes('organization') || h.includes('business')
      );
      const titleIndex = headers.findIndex(h => 
        h.includes('title') || h.includes('position') || h.includes('job')
      );

      if (emailIndex === -1) {
        toast({
          title: "Error",
          description: "No email column found. Please ensure your file has an email column.",
          variant: "destructive",
        });
        setIsProcessing(false);
        return;
      }

      const processedContacts: Contact[] = [];
      const valid: Contact[] = [];
      const invalid: Contact[] = [];

      dataRows.forEach((row, index) => {
        setUploadProgress(((index + 1) / dataRows.length) * 100);

        const email = row[emailIndex]?.trim();
        if (!email) return;

        const contact: Contact = {
          email,
          first_name: firstNameIndex >= 0 ? row[firstNameIndex]?.trim() : undefined,
          last_name: lastNameIndex >= 0 ? row[lastNameIndex]?.trim() : undefined,
          company: companyIndex >= 0 ? row[companyIndex]?.trim() : undefined,
          title: titleIndex >= 0 ? row[titleIndex]?.trim() : undefined,
        };

        processedContacts.push(contact);

        if (validateEmail(email)) {
          valid.push(contact);
        } else {
          invalid.push(contact);
        }
      });

      setContacts(processedContacts);
      setValidContacts(valid);
      setInvalidContacts(invalid);

      toast({
        title: "File processed",
        description: `Found ${valid.length} valid and ${invalid.length} invalid email addresses`,
      });

    } catch (error) {
      console.error("Error processing file:", error);
      toast({
        title: "Error",
        description: "Failed to process file. Please check the format and try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setUploadProgress(0);
    }
  }, [toast]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv') && !file.name.endsWith('.xlsx')) {
      toast({
        title: "Invalid file type",
        description: "Please upload a CSV or XLSX file",
        variant: "destructive",
      });
      return;
    }

    setFile(file);
    processFile(file);
  };

  const uploadContacts = async () => {
    if (!selectedCampaign || validContacts.length === 0) {
      toast({
        title: "Error",
        description: "Please select a campaign and ensure you have valid contacts",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Prepare contacts for insertion
      const contactsToInsert = validContacts.map(contact => ({
        campaign_id: selectedCampaign,
        email: contact.email,
        first_name: contact.first_name || null,
        last_name: contact.last_name || null,
        company: contact.company || null,
        title: contact.title || null,
      }));

      // Insert contacts
      const { data, error } = await supabase
        .from("contacts")
        .insert(contactsToInsert);

      if (error) throw error;

      // Update campaign total_contacts count
      const { error: updateError } = await supabase
        .from("campaigns")
        .update({ 
          total_contacts: validContacts.length 
        })
        .eq("id", selectedCampaign);

      if (updateError) throw updateError;

      toast({
        title: "Success",
        description: `Successfully uploaded ${validContacts.length} contacts`,
      });

      // Reset form
      setFile(null);
      setContacts([]);
      setValidContacts([]);
      setInvalidContacts([]);
      setSelectedCampaign("");

      // Reset file input
      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

    } catch (error) {
      console.error("Error uploading contacts:", error);
      toast({
        title: "Error",
        description: "Failed to upload contacts. Some emails might already exist in the campaign.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Upload Contacts</h1>
        <p className="text-muted-foreground">
          Import contacts from CSV or XLSX files to your campaigns
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Section */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileUp className="w-5 h-5" />
              File Upload
            </CardTitle>
            <CardDescription>
              Upload a CSV or XLSX file containing your contact information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="campaign-select">Select Campaign</Label>
              <Select value={selectedCampaign} onValueChange={setSelectedCampaign}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a campaign" />
                </SelectTrigger>
                <SelectContent>
                  {campaigns.map((campaign) => (
                    <SelectItem key={campaign.id} value={campaign.id}>
                      <div className="flex items-center gap-2">
                        <span>{campaign.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {campaign.status}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="file-upload">Upload File</Label>
              <Input
                id="file-upload"
                type="file"
                accept=".csv,.xlsx"
                onChange={handleFileUpload}
                disabled={isProcessing}
                className="cursor-pointer"
              />
              <p className="text-sm text-muted-foreground mt-2">
                Supported formats: CSV, XLSX. Include columns: email, first_name, last_name, company, title
              </p>
            </div>

            {isProcessing && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Processing file...</span>
                  <span>{uploadProgress.toFixed(0)}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            )}

            {validContacts.length > 0 && (
              <Button
                onClick={uploadContacts}
                disabled={isProcessing || !selectedCampaign}
                className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload {validContacts.length} Contacts
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Preview Section */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Contact Preview
            </CardTitle>
            <CardDescription>
              Review your contacts before uploading
            </CardDescription>
          </CardHeader>
          <CardContent>
            {contacts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Mail className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Upload a file to see contact preview</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 p-3 bg-success/10 rounded-lg">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <div>
                      <div className="font-medium text-success">Valid</div>
                      <div className="text-sm">{validContacts.length} contacts</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-destructive/10 rounded-lg">
                    <XCircle className="w-4 h-4 text-destructive" />
                    <div>
                      <div className="font-medium text-destructive">Invalid</div>
                      <div className="text-sm">{invalidContacts.length} contacts</div>
                    </div>
                  </div>
                </div>

                {validContacts.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-success" />
                      Valid Contacts (showing first 5)
                    </h4>
                    <div className="border border-border/50 rounded-lg overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Email</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Company</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {validContacts.slice(0, 5).map((contact, index) => (
                            <TableRow key={index}>
                              <TableCell className="font-mono text-sm">
                                {contact.email}
                              </TableCell>
                              <TableCell>
                                {[contact.first_name, contact.last_name]
                                  .filter(Boolean)
                                  .join(' ') || '-'}
                              </TableCell>
                              <TableCell>{contact.company || '-'}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};