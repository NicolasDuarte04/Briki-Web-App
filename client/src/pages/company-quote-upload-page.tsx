import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import CompanyLayout from "@/components/layout/company-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { FileUploader } from "@/components/ui/file-uploader";
import { Separator } from "@/components/ui/separator";
import { 
  Upload, 
  FileText, 
  AlertCircle, 
  CheckCircle, 
  ArrowRight,
  Info
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Insurance plan schema
const planSchema = z.object({
  planName: z.string().min(2, "Plan name is required"),
  planId: z.string().min(2, "Plan ID is required"),
  insuranceType: z.string().min(1, "Insurance type is required"),
  basePrice: z.coerce.number().min(1, "Price must be greater than 0"),
  description: z.string().min(10, "Description is too short"),
  coverageAmount: z.coerce.number().min(1, "Coverage amount is required"),
  coveragePeriod: z.coerce.number().min(1, "Coverage period is required"),
  coveragePeriodUnit: z.string().min(1, "Period unit is required"),
  features: z.object({
    medicalExpenses: z.boolean().optional(),
    tripCancellation: z.boolean().optional(),
    lostBaggage: z.boolean().optional(),
    accidentalDeath: z.boolean().optional(),
    emergencyEvacuation: z.boolean().optional(),
    adventureActivities: z.boolean().optional(),
    preExistingConditions: z.boolean().optional(),
  }),
  termsUrl: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
});

type PlanFormValues = z.infer<typeof planSchema>;

export default function CompanyQuoteUploadPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("manual");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset
  } = useForm<PlanFormValues>({
    resolver: zodResolver(planSchema),
    defaultValues: {
      planName: "",
      planId: "",
      insuranceType: "",
      basePrice: 0,
      description: "",
      coverageAmount: 0,
      coveragePeriod: 0,
      coveragePeriodUnit: "",
      features: {
        medicalExpenses: false,
        tripCancellation: false,
        lostBaggage: false,
        accidentalDeath: false,
        emergencyEvacuation: false,
        adventureActivities: false,
        preExistingConditions: false,
      },
      termsUrl: "",
    },
  });
  
  // Values for the preview
  const watchedValues = watch();
  
  // Handle manual form submission
  const onSubmitManual = async (data: PlanFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setShowPreview(true);
      
      toast({
        title: "Plan Created",
        description: "Your insurance plan has been created successfully.",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "There was an error creating your plan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle CSV upload
  const handleFileUpload = (file: File) => {
    setUploadedFile(file);
    
    // Simulate processing CSV and filling form
    setTimeout(() => {
      // This would normally parse the CSV and fill the form
      setValue("planName", "Premium Travel Protection");
      setValue("planId", "TRVL-PREMIUM-2023");
      setValue("insuranceType", "travel");
      setValue("basePrice", 89.99);
      setValue("description", "Comprehensive travel insurance plan covering medical expenses, trip cancellation, lost baggage, and emergency evacuation.");
      setValue("coverageAmount", 250000);
      setValue("coveragePeriod", 30);
      setValue("coveragePeriodUnit", "days");
      setValue("features.medicalExpenses", true);
      setValue("features.tripCancellation", true);
      setValue("features.lostBaggage", true);
      setValue("features.emergencyEvacuation", true);
      
      toast({
        title: "File Processed",
        description: "Your CSV has been processed. Please review the imported data.",
      });
    }, 1000);
  };
  
  // Reset the form and go back to edit mode
  const handleReset = () => {
    setShowPreview(false);
    reset();
  };

  return (
    <CompanyLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Upload Insurance Plan</h1>
          <p className="text-gray-600">Create a new insurance plan to be featured on Briki</p>
        </div>
        
        {showPreview ? (
          <div className="space-y-6">
            <Alert className="bg-blue-50 border-blue-200 text-blue-800">
              <Info className="h-4 w-4" />
              <AlertTitle>Preview Mode</AlertTitle>
              <AlertDescription>
                This is how your insurance plan will appear to Briki users. Review the details before finalizing.
              </AlertDescription>
            </Alert>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Plan Card Preview */}
              <Card className="bg-white shadow-md border-blue-100">
                <CardHeader className="pb-2 border-b border-blue-50">
                  <div className="flex justify-between items-center">
                    <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                      {watchedValues.insuranceType === "travel" 
                        ? "Travel Insurance" 
                        : watchedValues.insuranceType === "auto"
                          ? "Auto Insurance"
                          : watchedValues.insuranceType === "health"
                            ? "Health Insurance"
                            : watchedValues.insuranceType === "pet"
                              ? "Pet Insurance"
                              : "Insurance"}
                    </Badge>
                    <span className="text-xs text-gray-500">Plan ID: {watchedValues.planId}</span>
                  </div>
                  <CardTitle className="mt-2">{watchedValues.planName}</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-4">
                    <div>
                      <p className="text-gray-600 text-sm">{watchedValues.description}</p>
                    </div>
                    
                    <div>
                      <div className="text-sm text-gray-500">Coverage Amount</div>
                      <div className="text-lg font-bold">${watchedValues.coverageAmount.toLocaleString()}</div>
                    </div>
                    
                    <div>
                      <div className="text-sm text-gray-500">Coverage Period</div>
                      <div className="text-lg font-bold">{watchedValues.coveragePeriod} {watchedValues.coveragePeriodUnit}</div>
                    </div>
                    
                    <div>
                      <div className="text-sm text-gray-500 mb-2">Key Features</div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        {watchedValues.features.medicalExpenses && (
                          <div className="flex items-center">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                            <span>Medical Expenses</span>
                          </div>
                        )}
                        {watchedValues.features.tripCancellation && (
                          <div className="flex items-center">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                            <span>Trip Cancellation</span>
                          </div>
                        )}
                        {watchedValues.features.lostBaggage && (
                          <div className="flex items-center">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                            <span>Lost Baggage</span>
                          </div>
                        )}
                        {watchedValues.features.accidentalDeath && (
                          <div className="flex items-center">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                            <span>Accidental Death</span>
                          </div>
                        )}
                        {watchedValues.features.emergencyEvacuation && (
                          <div className="flex items-center">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                            <span>Emergency Evacuation</span>
                          </div>
                        )}
                        {watchedValues.features.adventureActivities && (
                          <div className="flex items-center">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                            <span>Adventure Activities</span>
                          </div>
                        )}
                        {watchedValues.features.preExistingConditions && (
                          <div className="flex items-center">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                            <span>Pre-existing Conditions</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t border-blue-50 pt-4 flex justify-between items-center">
                  <div className="text-2xl font-bold text-blue-600">${watchedValues.basePrice}</div>
                  <Button>Get Quote</Button>
                </CardFooter>
              </Card>
              
              {/* AI Assistant Preview */}
              <Card className="bg-white shadow-md border-blue-100">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">AI Assistant Recommendation</CardTitle>
                  <CardDescription>How your plan will appear in AI recommendations</CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="bg-slate-100 p-4 rounded-lg space-y-4">
                    <div className="bg-white p-3 rounded-lg shadow-sm">
                      <div className="flex items-start space-x-2">
                        <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                          B
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-600">
                            I'd recommend <span className="font-semibold">{watchedValues.planName}</span> from your company, which provides ${watchedValues.coverageAmount.toLocaleString()} in coverage for {watchedValues.coveragePeriod} {watchedValues.coveragePeriodUnit}.
                          </p>
                          <p className="text-sm text-gray-600 mt-2">
                            This plan is particularly good because it 
                            {watchedValues.features.medicalExpenses ? " covers medical expenses," : ""}
                            {watchedValues.features.tripCancellation ? " provides trip cancellation," : ""}
                            {watchedValues.features.emergencyEvacuation ? " includes emergency evacuation," : ""}
                            {watchedValues.features.adventureActivities ? " covers adventure activities," : ""}
                            and costs only ${watchedValues.basePrice} for the whole trip.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={handleReset}>
                Edit Plan
              </Button>
              <Button 
                onClick={() => {
                  toast({
                    title: "Plan Published",
                    description: "Your insurance plan has been published to Briki.",
                  });
                  reset();
                  setShowPreview(false);
                }}
              >
                Publish Plan
              </Button>
            </div>
          </div>
        ) : (
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="manual">Manual Entry</TabsTrigger>
              <TabsTrigger value="csv">Import from CSV</TabsTrigger>
            </TabsList>
            
            <TabsContent value="manual">
              <Card className="bg-white border-blue-100">
                <CardHeader>
                  <CardTitle>Enter Insurance Plan Details</CardTitle>
                  <CardDescription>
                    Add information about your insurance plan to be shown on Briki
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form id="manual-form" onSubmit={handleSubmit(onSubmitManual)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Basic information */}
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="planName">Plan Name</Label>
                          <Input 
                            id="planName" 
                            {...register("planName")} 
                            placeholder="e.g. Premium Travel Protection"
                          />
                          {errors.planName && (
                            <p className="text-sm text-red-500">{errors.planName.message}</p>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="planId">Plan ID</Label>
                          <Input 
                            id="planId" 
                            {...register("planId")} 
                            placeholder="e.g. TRVL-PREMIUM-2023"
                          />
                          {errors.planId && (
                            <p className="text-sm text-red-500">{errors.planId.message}</p>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="insuranceType">Insurance Type</Label>
                          <Select 
                            onValueChange={(value) => setValue("insuranceType", value)}
                          >
                            <SelectTrigger id="insuranceType">
                              <SelectValue placeholder="Select insurance type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="travel">Travel Insurance</SelectItem>
                              <SelectItem value="auto">Auto Insurance</SelectItem>
                              <SelectItem value="health">Health Insurance</SelectItem>
                              <SelectItem value="pet">Pet Insurance</SelectItem>
                            </SelectContent>
                          </Select>
                          {errors.insuranceType && (
                            <p className="text-sm text-red-500">{errors.insuranceType.message}</p>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="basePrice">Base Price ($)</Label>
                          <Input 
                            id="basePrice" 
                            type="number" 
                            {...register("basePrice")} 
                            placeholder="e.g. 89.99"
                          />
                          {errors.basePrice && (
                            <p className="text-sm text-red-500">{errors.basePrice.message}</p>
                          )}
                        </div>
                      </div>
                      
                      {/* Coverage details */}
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="description">Description</Label>
                          <Textarea 
                            id="description" 
                            {...register("description")} 
                            placeholder="Brief description of your insurance plan"
                            className="min-h-[100px]"
                          />
                          {errors.description && (
                            <p className="text-sm text-red-500">{errors.description.message}</p>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="coverageAmount">Coverage Amount ($)</Label>
                            <Input 
                              id="coverageAmount" 
                              type="number" 
                              {...register("coverageAmount")} 
                              placeholder="e.g. 250000"
                            />
                            {errors.coverageAmount && (
                              <p className="text-sm text-red-500">{errors.coverageAmount.message}</p>
                            )}
                          </div>
                          
                          <div className="space-y-2">
                            <Label>Coverage Period</Label>
                            <div className="flex gap-3">
                              <Input 
                                id="coveragePeriod" 
                                type="number" 
                                {...register("coveragePeriod")} 
                                placeholder="e.g. 30"
                                className="flex-1"
                              />
                              <Select 
                                onValueChange={(value) => setValue("coveragePeriodUnit", value)}
                              >
                                <SelectTrigger id="coveragePeriodUnit" className="w-24">
                                  <SelectValue placeholder="Unit" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="days">Days</SelectItem>
                                  <SelectItem value="months">Months</SelectItem>
                                  <SelectItem value="years">Years</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            {(errors.coveragePeriod || errors.coveragePeriodUnit) && (
                              <p className="text-sm text-red-500">
                                {errors.coveragePeriod?.message || errors.coveragePeriodUnit?.message}
                              </p>
                            )}
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="termsUrl">Terms & Conditions URL (optional)</Label>
                          <Input 
                            id="termsUrl" 
                            {...register("termsUrl")} 
                            placeholder="https://example.com/terms"
                          />
                          {errors.termsUrl && (
                            <p className="text-sm text-red-500">{errors.termsUrl.message}</p>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    {/* Features */}
                    <div>
                      <h3 className="text-lg font-medium mb-3">Plan Features</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="medicalExpenses" 
                            onCheckedChange={(checked) => {
                              setValue("features.medicalExpenses", checked === true);
                            }}
                          />
                          <label
                            htmlFor="medicalExpenses"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Medical Expenses
                          </label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="tripCancellation" 
                            onCheckedChange={(checked) => {
                              setValue("features.tripCancellation", checked === true);
                            }}
                          />
                          <label
                            htmlFor="tripCancellation"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Trip Cancellation
                          </label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="lostBaggage" 
                            onCheckedChange={(checked) => {
                              setValue("features.lostBaggage", checked === true);
                            }}
                          />
                          <label
                            htmlFor="lostBaggage"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Lost Baggage
                          </label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="accidentalDeath" 
                            onCheckedChange={(checked) => {
                              setValue("features.accidentalDeath", checked === true);
                            }}
                          />
                          <label
                            htmlFor="accidentalDeath"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Accidental Death
                          </label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="emergencyEvacuation" 
                            onCheckedChange={(checked) => {
                              setValue("features.emergencyEvacuation", checked === true);
                            }}
                          />
                          <label
                            htmlFor="emergencyEvacuation"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Emergency Evacuation
                          </label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="adventureActivities" 
                            onCheckedChange={(checked) => {
                              setValue("features.adventureActivities", checked === true);
                            }}
                          />
                          <label
                            htmlFor="adventureActivities"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Adventure Activities
                          </label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="preExistingConditions" 
                            onCheckedChange={(checked) => {
                              setValue("features.preExistingConditions", checked === true);
                            }}
                          />
                          <label
                            htmlFor="preExistingConditions"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Pre-existing Conditions
                          </label>
                        </div>
                      </div>
                    </div>
                  </form>
                </CardContent>
                <CardFooter className="flex justify-end gap-3">
                  <Button 
                    variant="outline" 
                    onClick={() => reset()}
                  >
                    Reset
                  </Button>
                  <Button 
                    type="submit"
                    form="manual-form"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Creating Plan..." : "Create Plan"}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="csv">
              <Card className="bg-white border-blue-100">
                <CardHeader>
                  <CardTitle>Import from CSV</CardTitle>
                  <CardDescription>
                    Upload a CSV file with your insurance plan details
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <Alert className="bg-amber-50 border-amber-200 text-amber-800">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>CSV Format Required</AlertTitle>
                      <AlertDescription>
                        Your CSV file must include columns for plan name, ID, type, price, coverage, and features.{" "}
                        <Button variant="link" className="p-0 h-auto text-amber-800 underline">
                          Download template
                        </Button>
                      </AlertDescription>
                    </Alert>
                    
                    <div className="border-2 border-dashed border-blue-200 rounded-lg p-6 text-center">
                      <input
                        type="file"
                        id="csv-upload"
                        className="hidden"
                        accept=".csv"
                        onChange={(e) => {
                          const files = e.target.files;
                          if (files && files.length > 0) {
                            handleFileUpload(files[0]);
                          }
                        }}
                      />
                      
                      {uploadedFile ? (
                        <div className="space-y-3">
                          <div className="flex items-center justify-center">
                            <FileText className="h-8 w-8 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-gray-900 font-medium">{uploadedFile.name}</p>
                            <p className="text-sm text-gray-500">
                              {(uploadedFile.size / 1024).toFixed(2)} KB
                            </p>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-2"
                            onClick={() => setUploadedFile(null)}
                          >
                            Remove File
                          </Button>
                        </div>
                      ) : (
                        <label htmlFor="csv-upload" className="cursor-pointer block space-y-3">
                          <div className="flex items-center justify-center">
                            <Upload className="h-8 w-8 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-gray-900 font-medium">Click to upload CSV file</p>
                            <p className="text-sm text-gray-500">or drag and drop</p>
                          </div>
                          <Button variant="outline" size="sm" className="mt-2">
                            Browse Files
                          </Button>
                        </label>
                      )}
                    </div>
                    
                    {uploadedFile && (
                      <div className="pt-4">
                        <h3 className="text-lg font-medium mb-3">Imported Data</h3>
                        <p className="text-sm text-gray-600 mb-4">
                          Review the data imported from your CSV file. You can make changes as needed.
                        </p>
                        
                        <form id="csv-form" onSubmit={handleSubmit(onSubmitManual)} className="space-y-6">
                          {/* Form fields - same as manual entry but pre-filled from CSV */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Basic information */}
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label htmlFor="planName">Plan Name</Label>
                                <Input 
                                  id="planName" 
                                  {...register("planName")} 
                                />
                                {errors.planName && (
                                  <p className="text-sm text-red-500">{errors.planName.message}</p>
                                )}
                              </div>
                              
                              <div className="space-y-2">
                                <Label htmlFor="planId">Plan ID</Label>
                                <Input 
                                  id="planId" 
                                  {...register("planId")} 
                                />
                                {errors.planId && (
                                  <p className="text-sm text-red-500">{errors.planId.message}</p>
                                )}
                              </div>
                              
                              <div className="space-y-2">
                                <Label htmlFor="insuranceType">Insurance Type</Label>
                                <Select 
                                  value={watchedValues.insuranceType}
                                  onValueChange={(value) => setValue("insuranceType", value)}
                                >
                                  <SelectTrigger id="insuranceType">
                                    <SelectValue placeholder="Select insurance type" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="travel">Travel Insurance</SelectItem>
                                    <SelectItem value="auto">Auto Insurance</SelectItem>
                                    <SelectItem value="health">Health Insurance</SelectItem>
                                    <SelectItem value="pet">Pet Insurance</SelectItem>
                                  </SelectContent>
                                </Select>
                                {errors.insuranceType && (
                                  <p className="text-sm text-red-500">{errors.insuranceType.message}</p>
                                )}
                              </div>
                              
                              <div className="space-y-2">
                                <Label htmlFor="basePrice">Base Price ($)</Label>
                                <Input 
                                  id="basePrice" 
                                  type="number" 
                                  {...register("basePrice")} 
                                />
                                {errors.basePrice && (
                                  <p className="text-sm text-red-500">{errors.basePrice.message}</p>
                                )}
                              </div>
                            </div>
                            
                            {/* More fields... similar to the manual entry form */}
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea 
                                  id="description" 
                                  {...register("description")} 
                                  className="min-h-[100px]"
                                />
                                {errors.description && (
                                  <p className="text-sm text-red-500">{errors.description.message}</p>
                                )}
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor="coverageAmount">Coverage Amount ($)</Label>
                                  <Input 
                                    id="coverageAmount" 
                                    type="number" 
                                    {...register("coverageAmount")} 
                                  />
                                  {errors.coverageAmount && (
                                    <p className="text-sm text-red-500">{errors.coverageAmount.message}</p>
                                  )}
                                </div>
                                
                                <div className="space-y-2">
                                  <Label>Coverage Period</Label>
                                  <div className="flex gap-3">
                                    <Input 
                                      id="coveragePeriod" 
                                      type="number" 
                                      {...register("coveragePeriod")} 
                                      className="flex-1"
                                    />
                                    <Select 
                                      value={watchedValues.coveragePeriodUnit}
                                      onValueChange={(value) => setValue("coveragePeriodUnit", value)}
                                    >
                                      <SelectTrigger id="coveragePeriodUnit" className="w-24">
                                        <SelectValue placeholder="Unit" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="days">Days</SelectItem>
                                        <SelectItem value="months">Months</SelectItem>
                                        <SelectItem value="years">Years</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  {(errors.coveragePeriod || errors.coveragePeriodUnit) && (
                                    <p className="text-sm text-red-500">
                                      {errors.coveragePeriod?.message || errors.coveragePeriodUnit?.message}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </form>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-3">
                  {uploadedFile && (
                    <>
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setUploadedFile(null);
                          reset();
                        }}
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="submit"
                        form="csv-form"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Creating Plan..." : "Create Plan"}
                      </Button>
                    </>
                  )}
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </CompanyLayout>
  );
}