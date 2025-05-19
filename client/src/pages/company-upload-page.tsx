import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { 
  FileUp, 
  Check, 
  X, 
  FileText, 
  AlertCircle, 
  Download, 
  Table,
  Upload,
  FileSpreadsheet
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
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

// File validation statuses
type ValidationStatus = "idle" | "validating" | "success" | "error";

// Sample validation errors
const sampleValidationErrors = [
  { type: "missing", field: "coverageAmount", row: 3, message: "Coverage amount is required" },
  { type: "format", field: "basePrice", row: 5, message: "Base price must be a number" },
  { type: "invalid", field: "category", row: 8, message: "Category must be one of: auto, travel, pet, health, home" },
];

export default function CompanyUploadPage() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [validationStatus, setValidationStatus] = useState<ValidationStatus>("idle");
  const [validationProgress, setValidationProgress] = useState(0);
  const [validationErrors, setValidationErrors] = useState<typeof sampleValidationErrors>([]);
  const [uploadMethod, setUploadMethod] = useState<"file" | "template">("file");
  const [planCategory, setPlanCategory] = useState<string>("");
  const [isPublic, setIsPublic] = useState(false);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check if it's a CSV or Excel file
      if (file.type === "text/csv" || 
          file.type === "application/vnd.ms-excel" || 
          file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
        setSelectedFile(file);
        // Reset validation state
        setValidationStatus("idle");
        setValidationProgress(0);
        setValidationErrors([]);
      } else {
        toast({
          variant: "destructive",
          title: "Invalid file type",
          description: "Please upload a CSV or Excel file.",
        });
      }
    }
  };

  // Trigger file input click
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // Simulate file validation
  const validateFile = () => {
    if (!selectedFile) return;
    
    setValidationStatus("validating");
    setValidationProgress(0);
    
    // Simulate progress
    const interval = setInterval(() => {
      setValidationProgress((prev) => {
        const next = prev + 10;
        if (next >= 100) {
          clearInterval(interval);
          // Simulate validation complete with some errors
          setTimeout(() => {
            if (Math.random() > 0.5) {
              setValidationStatus("error");
              setValidationErrors(sampleValidationErrors);
            } else {
              setValidationStatus("success");
              setValidationErrors([]);
            }
          }, 500);
          return 100;
        }
        return next;
      });
    }, 300);
  };

  // Handle upload submit
  const handleSubmit = () => {
    if (validationStatus === "success") {
      toast({
        title: "Plan uploaded successfully",
        description: "Your insurance plan has been uploaded and is ready for analysis.",
      });
      
      // Reset the form
      setSelectedFile(null);
      setValidationStatus("idle");
      setValidationProgress(0);
      setValidationErrors([]);
      setPlanCategory("");
      setIsPublic(false);
      
      // Navigate to dashboard or analysis page
      // window.location.href = "/company-dashboard/analysis";
    } else if (validationStatus === "error") {
      toast({
        variant: "destructive",
        title: "Cannot upload plan",
        description: "Please fix the validation errors before uploading.",
      });
    } else {
      validateFile();
    }
  };

  // Download sample template
  const downloadTemplate = () => {
    toast({
      title: "Template downloaded",
      description: "The sample template has been downloaded to your device.",
    });
  };

  return (
    <CompanyLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-white">Upload Insurance Plan</h1>
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
                                {(selectedFile.size / 1024).toFixed(1)} KB • {selectedFile.type.split('/')[1].toUpperCase()}
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
                              
                              <div className="space-y-2 mt-2 max-h-40 overflow-y-auto">
                                {validationErrors.map((error, index) => (
                                  <div key={index} className="bg-[#01101F] rounded p-2 text-left flex items-start">
                                    <Badge className="bg-red-500/20 text-red-400 border-red-400/20 mr-2">Row {error.row}</Badge>
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
                          <Table className="h-8 w-8 text-[#33BFFF] mr-4 mt-1" />
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
                                <span className="text-white text-sm font-medium mr-2">features</span>
                                <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/20">Optional</Badge>
                              </div>
                              <div className="bg-[#0A2540] p-2 rounded-md flex items-center">
                                <span className="text-white text-sm font-medium mr-2">pricingTiers</span>
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
            {/* Plan Details Card */}
            <Card className="bg-[#0A2540] border-[#1E3A59]">
              <CardHeader>
                <CardTitle className="text-white">Plan Details</CardTitle>
                <CardDescription className="text-gray-400">
                  Additional information about your plan
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-white">Insurance Category</Label>
                  <Select value={planCategory} onValueChange={setPlanCategory}>
                    <SelectTrigger 
                      id="category" 
                      className="bg-[#01101F] border-[#1E3A59] text-white focus:ring-[#33BFFF]"
                    >
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0A2540] border-[#1E3A59] text-white">
                      <SelectItem value="auto">Auto Insurance</SelectItem>
                      <SelectItem value="travel">Travel Insurance</SelectItem>
                      <SelectItem value="pet">Pet Insurance</SelectItem>
                      <SelectItem value="health">Health Insurance</SelectItem>
                      <SelectItem value="home">Home Insurance</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-gray-500 text-xs">
                    This helps us analyze your plan against similar products
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="marketplace-visibility" className="text-white">Marketplace Visibility</Label>
                    <Switch 
                      id="marketplace-visibility" 
                      checked={isPublic}
                      onCheckedChange={setIsPublic}
                    />
                  </div>
                  <p className="text-gray-500 text-xs">
                    Allow your plan to be displayed publicly in the Briki marketplace
                  </p>
                </div>
              </CardContent>
              <CardFooter className="border-t border-[#1E3A59] pt-4 flex flex-col items-stretch">
                <Button
                  className="w-full bg-[#1570EF] hover:bg-[#0E63D6] mb-2"
                  disabled={!selectedFile || (validationStatus === "error")}
                  onClick={handleSubmit}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {validationStatus === "success" ? "Upload Plan" : "Validate & Upload"}
                </Button>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="w-full">
                        <Button
                          variant="outline"
                          className="w-full border-[#1E3A59] text-white hover:bg-[#01101F] hover:border-[#33BFFF]"
                          disabled={!selectedFile}
                          onClick={() => setSelectedFile(null)}
                        >
                          <X className="h-4 w-4 mr-2" />
                          Cancel
                        </Button>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Clear the current upload</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </CardFooter>
            </Card>
            
            {/* Upload Tips Card */}
            <Card className="bg-[#0A2540] border-[#1E3A59]">
              <CardHeader>
                <CardTitle className="text-white">Upload Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start">
                    <div className="bg-[#1570EF]/20 p-1.5 rounded-full mr-3 mt-0.5">
                      <Check className="h-4 w-4 text-[#33BFFF]" />
                    </div>
                    <p className="text-gray-300 text-sm">
                      Ensure your CSV has headers that match our template.
                    </p>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-[#1570EF]/20 p-1.5 rounded-full mr-3 mt-0.5">
                      <Check className="h-4 w-4 text-[#33BFFF]" />
                    </div>
                    <p className="text-gray-300 text-sm">
                      For multiple coverage options, separate them with commas within the cell.
                    </p>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-[#1570EF]/20 p-1.5 rounded-full mr-3 mt-0.5">
                      <Check className="h-4 w-4 text-[#33BFFF]" />
                    </div>
                    <p className="text-gray-300 text-sm">
                      Use consistent pricing formats across all plans (e.g., USD).
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
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </CompanyLayout>
  );
}