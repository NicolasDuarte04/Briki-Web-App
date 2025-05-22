import { useState, useRef, useEffect } from "react";
import { 
  FileUp, 
  Check, 
  X, 
  FileText, 
  AlertCircle, 
  Download, 
  TableIcon,
  Upload,
  FileSpreadsheet,
  Info
} from "lucide-react";
import CompanyLayout from "@/components/layout/company-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { trackEvent } from "@/lib/analytics";
import { EventCategory } from "@/constants/analytics";

// File validation statuses
type ValidationStatus = "idle" | "validating" | "success" | "error" | "uploading";

// API response interfaces
interface ValidationError {
  row: number;
  field?: string;
  message: string;
  type?: "missing" | "format" | "invalid";
}

interface ValidationStats {
  totalRecords: number;
  validRecords: number;
  invalidRecords: number;
}

interface ValidationResponse {
  success: boolean;
  message: string;
  stats: ValidationStats;
  errors?: Record<number, string[]>;
  warnings?: Record<number, string[]>;
  validPlans?: PlanPreviewData[];
}

// Plan data preview
interface PlanPreviewData {
  name: string;
  category: string;
  basePrice: number;
  coverageAmount: number;
  provider?: string;
  features?: string[];
  planId?: string;
  [key: string]: any; // For category-specific fields
}

export default function CompanyUploadPage() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [validationStatus, setValidationStatus] = useState<ValidationStatus>("idle");
  const [validationProgress, setValidationProgress] = useState(0);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [validationStats, setValidationStats] = useState<ValidationStats | null>(null);
  const [validationResponse, setValidationResponse] = useState<ValidationResponse | null>(null);
  const [uploadMethod, setUploadMethod] = useState<"file" | "template">("file");
  const [planCategory, setPlanCategory] = useState<string>("");
  const [isPublic, setIsPublic] = useState(false);
  const [previewData, setPreviewData] = useState<PlanPreviewData[]>([]);
  const [showPreviewTable, setShowPreviewTable] = useState(false);

  // Convert API errors structure to our ValidationError format
  const formatApiErrors = (errors: Record<number, string[]> | undefined): ValidationError[] => {
    if (!errors) return [];
    
    const formattedErrors: ValidationError[] = [];
    Object.entries(errors).forEach(([rowStr, messages]) => {
      const row = parseInt(rowStr, 10);
      
      messages.forEach(message => {
        // Try to detect field name from error message
        let field: string | undefined;
        let type: "missing" | "format" | "invalid" | undefined;
        
        if (message.includes("required")) {
          type = "missing";
          // Extract field name from message like "Field 'name' is required"
          const match = message.match(/'([^']+)'/);
          field = match ? match[1] : undefined;
        } else if (message.includes("must be")) {
          type = "format";
        } else {
          type = "invalid";
        }
        
        formattedErrors.push({
          row,
          field,
          message,
          type
        });
      });
    });
    
    return formattedErrors;
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check if it's a CSV or Excel file
      if (file.type === "text/csv" || 
          file.type === "application/vnd.ms-excel" || 
          file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
          file.name.endsWith('.csv') ||
          file.name.endsWith('.xlsx')) {
        setSelectedFile(file);
        // Reset validation state
        setValidationStatus("idle");
        setValidationProgress(0);
        setValidationErrors([]);
        setPreviewData([]);
        setShowPreviewTable(false);
        setValidationResponse(null);
        
        // Track file selection in analytics
        trackEvent('file_selected', EventCategory.PlanManagement, 'plan_upload', {
          file_type: file.type || file.name.split('.').pop(),
          file_size: file.size
        });
      } else {
        toast({
          variant: "destructive",
          title: "Invalid file type",
          description: "Please upload a CSV or Excel file.",
        });
        
        // Track invalid file selection
        trackEvent('invalid_file_selected', EventCategory.PlanManagement, 'plan_upload');
      }
    }
  };

  // Trigger file input click
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // Real file validation against the API
  const validateFile = async () => {
    if (!selectedFile) return;
    
    setValidationStatus("validating");
    setValidationProgress(0);
    
    // Create a progress simulation for better UX
    const progressInterval = setInterval(() => {
      setValidationProgress(prev => {
        // Only go up to 90% - the final 10% will be set when we get the response
        return prev < 90 ? prev + 5 : prev;
      });
    }, 200);
    
    try {
      // Prepare form data for file upload
      const formData = new FormData();
      formData.append('file', selectedFile);
      
      // Track validation start
      trackEvent('validate_file', EventCategory.PlanManagement, 'plan_upload');
      
      // Call the API to validate and parse the file
      const response = await fetch('/api/company/plans/upload', {
        method: 'POST',
        body: formData,
        // No need to set Content-Type header, it will be set automatically with boundary
      });
      
      // Set progress to 100%
      clearInterval(progressInterval);
      setValidationProgress(100);
      
      const data = await response.json();
      
      // Store the raw API response
      setValidationResponse(data);
      
      if (response.ok) {
        if (data.stats.validRecords > 0) {
          // Success - at least some records are valid
          setValidationStatus("success");
          setValidationStats(data.stats);
          
          // Format any warnings
          setValidationErrors(data.warnings ? formatApiErrors(data.warnings) : []);
          
          // Create preview data from valid plans (mock for now, real data would come from API)
          setPreviewData(data.validPlans || generateMockPreviewData(data.stats.validRecords));
          setShowPreviewTable(true);
          
          toast({
            title: "File validated successfully",
            description: `${data.stats.validRecords} plans validated successfully${data.stats.invalidRecords > 0 ? ` (${data.stats.invalidRecords} with issues)` : ''}.`,
          });
          
          // Track success
          trackEvent('file_validated', EventCategory.PlanManagement, 'plan_upload', {
            total_records: data.stats.totalRecords,
            valid_records: data.stats.validRecords,
            invalid_records: data.stats.invalidRecords
          });
        } else {
          // No valid records found
          setValidationStatus("error");
          setValidationStats(data.stats);
          setValidationErrors(formatApiErrors(data.errors));
          setShowPreviewTable(false);
          
          toast({
            variant: "destructive",
            title: "Validation failed",
            description: "No valid plans found in your file. Please check the errors and try again.",
          });
          
          // Track failure
          trackEvent('file_validation_failed', EventCategory.PlanManagement, 'plan_upload', {
            error_count: data.stats.invalidRecords
          });
        }
      } else {
        // API returned an error
        setValidationStatus("error");
        setValidationErrors([{
          row: -1,
          message: data.message || "Unknown error occurred during validation",
          type: "invalid"
        }]);
        setShowPreviewTable(false);
        
        toast({
          variant: "destructive",
          title: "Validation failed",
          description: data.message || "An error occurred while validating your file.",
        });
        
        // Track API error
        trackEvent('api_error', EventCategory.PlanManagement, 'plan_upload', {
          status: response.status,
          message: data.message
        });
      }
    } catch (error) {
      // Network or other error
      clearInterval(progressInterval);
      setValidationProgress(100);
      setValidationStatus("error");
      setValidationErrors([{
        row: -1,
        message: "Connection error. Please try again.",
        type: "invalid"
      }]);
      setShowPreviewTable(false);
      
      toast({
        variant: "destructive",
        title: "Connection error",
        description: "Could not connect to the server. Please try again.",
      });
      
      // Track exception
      trackEvent('exception', EventCategory.PlanManagement, 'plan_upload', {
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  // Generate mock preview data for display (will be replaced with real data from API)
  const generateMockPreviewData = (count: number): PlanPreviewData[] => {
    const categories = ['travel', 'auto', 'pet', 'health'];
    const providers = ['Acme Insurance', 'Global Coverage', 'SecureLife', 'TotalProtect'];
    
    return Array.from({ length: count }).map((_, i) => ({
      name: `Insurance Plan ${i + 1}`,
      category: categories[Math.floor(Math.random() * categories.length)],
      basePrice: Math.floor(Math.random() * 1000) + 100,
      coverageAmount: Math.floor(Math.random() * 100000) + 10000,
      provider: providers[Math.floor(Math.random() * providers.length)],
      features: ['Feature 1', 'Feature 2', 'Feature 3'].slice(0, Math.floor(Math.random() * 3) + 1),
      planId: `PLAN-${Date.now()}-${i}`
    }));
  };

  // Handle final submit/upload
  const handleSubmit = async () => {
    if (validationStatus === "success") {
      if (!validationResponse) {
        toast({
          variant: "destructive",
          title: "Cannot upload plans",
          description: "Please validate your file first.",
        });
        return;
      }
      
      // Since we've already uploaded and validated the file in the validation step,
      // and since the backend has already saved the valid plans from the file,
      // we can just show a success message.
      
      // In a real implementation, you might want to do a separate API call to confirm
      // the plans should be finalized/published.
      
      toast({
        title: "Plans uploaded successfully",
        description: `${validationStats?.validRecords || 0} plans have been uploaded and are ready for analysis.`,
      });
      
      // Track final submission
      trackEvent('plans_uploaded', EventCategory.PlanManagement, 'plan_upload', {
        count: validationStats?.validRecords || 0,
        category: planCategory || 'all'
      });
      
      // Reset the form
      setSelectedFile(null);
      setValidationStatus("idle");
      setValidationProgress(0);
      setValidationErrors([]);
      setPreviewData([]);
      setShowPreviewTable(false);
      setPlanCategory("");
      setIsPublic(false);
      setValidationResponse(null);
      
      // Navigate to dashboard or analysis page after short delay
      setTimeout(() => {
        window.location.href = "/company-dashboard/analysis";
      }, 1500);
    } else if (validationStatus === "error") {
      toast({
        variant: "destructive",
        title: "Cannot upload plans",
        description: "Please fix the validation errors before uploading.",
      });
      
      // Track failed submission attempt
      trackEvent('upload_blocked', EventCategory.PlanManagement, 'plan_upload', {
        error_count: validationErrors.length
      });
    } else {
      // If not validated yet, start validation
      validateFile();
    }
  };

  // Download sample template
  const downloadTemplate = () => {
    trackEvent('template_downloaded', EventCategory.PlanManagement, 'plan_upload');
    
    toast({
      title: "Template downloaded",
      description: "The sample template has been downloaded to your device.",
    });
  };

  return (
    <CompanyLayout
      pageTitle="Upload Insurance Plans"
      activeNav="upload"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-white">Upload Insurance Plans</h1>
          <p className="text-gray-400">Import your insurance plan data for competitive analysis</p>
        </div>
        
        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column (2/3 width) */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-[#0A2540] border-[#1E3A59]">
              <CardHeader>
                <CardTitle className="text-white">Upload Method</CardTitle>
                <CardDescription className="text-gray-400">
                  Choose how you want to upload your insurance plan data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="file" onValueChange={(value) => setUploadMethod(value as "file" | "template")}>
                  <TabsList className="bg-[#01101F] mb-6">
                    <TabsTrigger value="file">Upload CSV/Excel</TabsTrigger>
                    <TabsTrigger value="template">Use Template</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="file" className="space-y-6">
                    {/* File Upload Card */}
                    <div className={`
                      border-2 border-dashed rounded-lg p-6 text-center
                      ${selectedFile ? 'border-[#1570EF]' : 'border-[#1E3A59]'}
                      ${validationStatus === 'error' ? 'border-red-500' : ''}
                      ${validationStatus === 'success' ? 'border-emerald-500' : ''}
                      transition-colors duration-200
                    `}>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept=".csv,.xls,.xlsx"
                      />
                      
                      {!selectedFile ? (
                        <div 
                          className="py-8 flex flex-col items-center justify-center cursor-pointer"
                          onClick={handleUploadClick}
                        >
                          <FileUp className="h-12 w-12 text-[#33BFFF] mb-4" />
                          <h3 className="text-white text-lg font-medium mb-2">Drop your file here or click to browse</h3>
                          <p className="text-gray-400 text-sm max-w-md">
                            Upload a CSV or Excel file containing your insurance plan data. 
                            Make sure it follows our required format.
                          </p>
                          <Button 
                            className="mt-6 bg-[#1570EF] hover:bg-[#0E63D6]"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUploadClick();
                            }}
                          >
                            Select File
                          </Button>
                        </div>
                      ) : (
                        <div className="py-4">
                          <div className="flex items-center justify-center mb-4">
                            <FileSpreadsheet className="h-8 w-8 text-[#33BFFF] mr-3" />
                            <div className="text-left">
                              <p className="text-white font-medium">{selectedFile.name}</p>
                              <p className="text-gray-400 text-sm">
                                {(selectedFile.size / 1024).toFixed(1)} KB • {selectedFile.type.split('/')[1]?.toUpperCase() || selectedFile.name.split('.').pop()?.toUpperCase()}
                              </p>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              className="ml-auto text-gray-400 hover:text-white hover:bg-[#01101F]"
                              onClick={() => setSelectedFile(null)}
                            >
                              <X className="h-5 w-5" />
                            </Button>
                          </div>
                          
                          {validationStatus === "validating" && (
                            <div className="space-y-2">
                              <p className="text-gray-400 text-sm">Validating file...</p>
                              <Progress value={validationProgress} className="h-1.5 bg-[#01101F]" />
                            </div>
                          )}
                          
                          {validationStatus === "success" && (
                            <div className="bg-emerald-900/20 border border-emerald-500/20 rounded-md p-3 flex items-start">
                              <Check className="h-5 w-5 text-emerald-500 mt-0.5 mr-3 flex-shrink-0" />
                              <div>
                                <p className="text-emerald-400 font-medium">File validated successfully</p>
                                <p className="text-gray-400 text-sm">Your file meets all requirements and is ready for upload.</p>
                              </div>
                            </div>
                          )}
                          
                          {validationStatus === "error" && (
                            <div className="bg-red-900/20 border border-red-500/20 rounded-md p-3">
                              <div className="flex items-start mb-3">
                                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
                                <div>
                                  <p className="text-red-400 font-medium">Validation errors found</p>
                                  <p className="text-gray-400 text-sm">Please fix the following issues and try again.</p>
                                </div>
                              </div>
                              
                              <div className="space-y-2 mt-2 max-h-40 overflow-y-auto custom-scrollbar">
                                {validationErrors.map((error, index) => (
                                  <div key={index} className="bg-[#01101F] rounded p-2 text-left flex items-start">
                                    <Badge className="bg-red-500/20 text-red-400 border-red-400/20 mr-2">
                                      {error.row > 0 ? `Row ${error.row}` : 'File'}
                                    </Badge>
                                    <p className="text-gray-300 text-sm">{error.message}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {validationStatus === "idle" && (
                            <Button
                              className="mt-2 bg-[#1570EF] hover:bg-[#0E63D6]"
                              onClick={validateFile}
                            >
                              Validate File
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                    
                    {/* Preview Table for Validated Plans */}
                    {showPreviewTable && previewData.length > 0 && (
                      <div className="mt-6 bg-[#0A2540] border border-[#1E3A59] rounded-lg p-5">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="text-white font-medium">Plan Preview</h3>
                            <p className="text-gray-400 text-sm">
                              Review the {previewData.length} plan{previewData.length !== 1 ? 's' : ''} before confirming upload
                            </p>
                          </div>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="outline" size="icon" className="h-8 w-8 rounded-full border-[#1E3A59]">
                                  <Info className="h-4 w-4 text-gray-400" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent className="bg-[#01101F] border-[#1E3A59] text-white max-w-[300px]">
                                <p>This preview shows the validated plans that will be uploaded. You can review them before final submission.</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        
                        <div className="rounded-md border border-[#1E3A59] overflow-hidden">
                          <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                            <Table className="w-full">
                              <TableHeader className="bg-[#01101F]">
                                <TableRow className="hover:bg-[#01101F]/80 border-b border-[#1E3A59]">
                                  <TableHead className="text-[#33BFFF] font-medium">Name</TableHead>
                                  <TableHead className="text-[#33BFFF] font-medium">Category</TableHead>
                                  <TableHead className="text-[#33BFFF] font-medium">Base Price</TableHead>
                                  <TableHead className="text-[#33BFFF] font-medium">Coverage</TableHead>
                                  <TableHead className="text-[#33BFFF] font-medium">Provider</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {previewData.map((plan, index) => (
                                  <TableRow key={index} className="hover:bg-[#01101F]/50 border-b border-[#1E3A59]">
                                    <TableCell className="text-white font-medium">{plan.name}</TableCell>
                                    <TableCell>
                                      <Badge className="bg-[#1570EF]/10 text-[#33BFFF] border-[#1570EF]/20">
                                        {plan.category.charAt(0).toUpperCase() + plan.category.slice(1)}
                                      </Badge>
                                    </TableCell>
                                    <TableCell className="text-gray-300">
                                      ${plan.basePrice.toLocaleString()}
                                    </TableCell>
                                    <TableCell className="text-gray-300">
                                      ${plan.coverageAmount.toLocaleString()}
                                    </TableCell>
                                    <TableCell className="text-gray-300">
                                      {plan.provider || 'N/A'}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        </div>
                        
                        {validationErrors.length > 0 && (
                          <div className="mt-3 p-2 bg-amber-900/20 border border-amber-500/20 rounded-md">
                            <div className="flex items-start">
                              <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5 mr-2 flex-shrink-0" />
                              <p className="text-sm text-amber-400">
                                {validationErrors.length} issue{validationErrors.length !== 1 ? 's' : ''} were found but will not prevent upload.
                                <Button variant="link" className="h-auto p-0 text-amber-400 underline text-sm" onClick={() => {
                                  document.getElementById('error-section')?.scrollIntoView({ behavior: 'smooth' });
                                }}>
                                  View details
                                </Button>
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="template" className="space-y-6">
                    <div className="grid gap-6">
                      <div className="bg-[#01101F] border border-[#1E3A59] rounded-lg p-5">
                        <div className="flex items-start mb-4">
                          <FileText className="h-8 w-8 text-[#33BFFF] mr-4 mt-1" />
                          <div>
                            <h3 className="text-white font-medium mb-1">Start with our template</h3>
                            <p className="text-gray-400 text-sm">
                              Download our pre-formatted template to ensure your data is structured correctly.
                              This simplifies the upload process and reduces validation errors.
                            </p>
                            <div className="mt-4 flex flex-wrap gap-3">
                              <Button 
                                variant="outline" 
                                className="border-[#1E3A59] text-white hover:bg-[#01101F] hover:border-[#33BFFF]"
                                onClick={downloadTemplate}
                              >
                                <Download className="h-4 w-4 mr-2" />
                                Download CSV Template
                              </Button>
                              <Button 
                                variant="outline" 
                                className="border-[#1E3A59] text-white hover:bg-[#01101F] hover:border-[#33BFFF]"
                                onClick={downloadTemplate}
                              >
                                <Download className="h-4 w-4 mr-2" />
                                Download Excel Template
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-[#01101F] border border-[#1E3A59] rounded-lg p-5">
                        <div className="flex items-start">
                          <TableIcon className="h-8 w-8 text-[#33BFFF] mr-4 mt-1" />
                          <div>
                            <h3 className="text-white font-medium mb-1">Required fields</h3>
                            <p className="text-gray-400 text-sm mb-4">
                              Ensure your file includes all of these fields for successful validation:
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div className="bg-[#0A2540] p-2 rounded-md flex items-center">
                                <span className="text-white text-sm font-medium mr-2">planName</span>
                                <Badge className="bg-[#1570EF]/20 text-[#33BFFF] border-[#1570EF]/20">Required</Badge>
                              </div>
                              <div className="bg-[#0A2540] p-2 rounded-md flex items-center">
                                <span className="text-white text-sm font-medium mr-2">category</span>
                                <Badge className="bg-[#1570EF]/20 text-[#33BFFF] border-[#1570EF]/20">Required</Badge>
                              </div>
                              <div className="bg-[#0A2540] p-2 rounded-md flex items-center">
                                <span className="text-white text-sm font-medium mr-2">basePrice</span>
                                <Badge className="bg-[#1570EF]/20 text-[#33BFFF] border-[#1570EF]/20">Required</Badge>
                              </div>
                              <div className="bg-[#0A2540] p-2 rounded-md flex items-center">
                                <span className="text-white text-sm font-medium mr-2">coverageAmount</span>
                                <Badge className="bg-[#1570EF]/20 text-[#33BFFF] border-[#1570EF]/20">Required</Badge>
                              </div>
                              <div className="bg-[#0A2540] p-2 rounded-md flex items-center">
                                <span className="text-white text-sm font-medium mr-2">provider</span>
                                <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/20">Optional</Badge>
                              </div>
                              <div className="bg-[#0A2540] p-2 rounded-md flex items-center">
                                <span className="text-white text-sm font-medium mr-2">features</span>
                                <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/20">Optional</Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
          
          {/* Right column (1/3 width) */}
          <div className="space-y-6">
            <Card className="bg-[#0A2540] border-[#1E3A59]">
              <CardHeader>
                <CardTitle className="text-white">Plan Options</CardTitle>
                <CardDescription className="text-gray-400">
                  Set additional options for your insurance plans
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-1.5">
                  <Label className="text-gray-300" htmlFor="category">
                    Insurance Category
                  </Label>
                  <Select 
                    value={planCategory} 
                    onValueChange={(value) => {
                      setPlanCategory(value);
                      // Track category selection in analytics
                      trackEvent('category_selected', EventCategory.PlanManagement, 'plan_upload', {
                        category: value
                      });
                    }}
                  >
                    <SelectTrigger className="bg-[#01101F] border-[#1E3A59] text-white">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0A2540] border-[#1E3A59] text-white">
                      <SelectItem value="travel">Travel Insurance</SelectItem>
                      <SelectItem value="auto">Auto Insurance</SelectItem>
                      <SelectItem value="pet">Pet Insurance</SelectItem>
                      <SelectItem value="health">Health Insurance</SelectItem>
                      <SelectItem value="home">Home Insurance</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-gray-500">
                    {planCategory 
                      ? `Plans will be analyzed against other ${planCategory} insurance offerings` 
                      : "Choose a category to enable competitive analysis"}
                  </p>
                </div>
                
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label className="text-gray-300" htmlFor="public">
                      Make plans public
                    </Label>
                    <Switch
                      id="public"
                      checked={isPublic}
                      onCheckedChange={(checked) => {
                        setIsPublic(checked);
                        // Track visibility toggle in analytics
                        trackEvent('visibility_toggled', EventCategory.PlanManagement, 'plan_upload', {
                          public: checked
                        });
                      }}
                    />
                  </div>
                  <p className="text-sm text-gray-500">
                    {isPublic 
                      ? "Plans will be visible in the Briki marketplace" 
                      : "Plans will only be visible to your company"}
                  </p>
                </div>
                
                <div className="pt-4">
                  <Button 
                    className={`w-full ${validationStatus === "success" 
                      ? "bg-green-600 hover:bg-green-700" 
                      : "bg-[#1570EF] hover:bg-[#0E63D6]"}`}
                    onClick={handleSubmit}
                    disabled={validationStatus === "validating" || validationStatus === "uploading" || (!selectedFile && uploadMethod === "file")}
                  >
                    {validationStatus === "validating" ? (
                      <>
                        <span className="mr-2">Validating</span>
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle 
                            className="opacity-25" 
                            cx="12" cy="12" r="10" 
                            stroke="currentColor" 
                            strokeWidth="4"
                            fill="none"
                          />
                          <path 
                            className="opacity-75" 
                            fill="currentColor" 
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                      </>
                    ) : validationStatus === "uploading" ? (
                      <>
                        <span className="mr-2">Uploading</span>
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle 
                            className="opacity-25" 
                            cx="12" cy="12" r="10" 
                            stroke="currentColor" 
                            strokeWidth="4"
                            fill="none"
                          />
                          <path 
                            className="opacity-75" 
                            fill="currentColor" 
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                      </>
                    ) : validationStatus === "success" ? (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        Upload {validationStats?.validRecords || ""} Plans
                      </>
                    ) : validationStatus === "error" ? (
                      "Fix Errors & Try Again"
                    ) : (
                      <>
                        <FileUp className="mr-2 h-4 w-4" />
                        Validate File
                      </>
                    )}
                  </Button>
                  
                  {/* Show validation stats if available */}
                  {validationStats && (
                    <div className="mt-4 text-center">
                      <p className="text-sm text-gray-400">
                        {validationStats.validRecords} of {validationStats.totalRecords} plans validated
                        {validationStats.invalidRecords > 0 && (
                          <span className="text-amber-400"> ({validationStats.invalidRecords} with issues)</span>
                        )}
                      </p>
                      <Progress 
                        value={(validationStats.validRecords / validationStats.totalRecords) * 100}
                        className="h-1.5 mt-2"
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-[#0A2540] border-[#1E3A59]">
              <CardHeader>
                <CardTitle className="text-white">Help & Support</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-[#1570EF]/20 p-1.5 rounded-full mr-3 mt-0.5">
                    <Check className="h-4 w-4 text-[#33BFFF]" />
                  </div>
                  <p className="text-gray-300 text-sm">
                    Supported file formats: CSV and Excel (.xlsx)
                  </p>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-[#1570EF]/20 p-1.5 rounded-full mr-3 mt-0.5">
                    <Check className="h-4 w-4 text-[#33BFFF]" />
                  </div>
                  <p className="text-gray-300 text-sm">
                    File size limit: 10MB
                  </p>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-[#1570EF]/20 p-1.5 rounded-full mr-3 mt-0.5">
                    <Check className="h-4 w-4 text-[#33BFFF]" />
                  </div>
                  <p className="text-gray-300 text-sm">
                    Limited to 20 plans per upload. For more, use multiple files.
                  </p>
                </div>
                
                <div className="pt-3">
                  <a href="mailto:support@briki.com" className="text-[#33BFFF] text-sm hover:underline flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" /> Need help? Contact support
                  </a>
                </div>
              </CardContent>
            </Card>
            
            {/* Error section with ID for scrolling */}
            {validationErrors.length > 0 && validationStatus === "success" && (
              <div id="error-section" className="bg-[#0A2540] border-[#1E3A59] rounded-lg p-5">
                <h3 className="text-amber-400 font-medium mb-3 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  {validationErrors.length} Warning{validationErrors.length !== 1 ? 's' : ''}
                </h3>
                <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar pr-2">
                  {validationErrors.map((error, index) => (
                    <div key={index} className="bg-[#01101F] rounded p-2 text-left flex items-start">
                      <Badge className="bg-amber-500/20 text-amber-400 border-amber-400/20 mr-2">
                        {error.row > 0 ? `Row ${error.row}` : 'File'}
                      </Badge>
                      <p className="text-gray-300 text-sm">{error.message}</p>
                    </div>
                  ))}
                </div>
                <p className="text-gray-400 text-sm mt-3">
                  These warnings won't prevent upload, but you may want to review your data.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </CompanyLayout>
  );
}