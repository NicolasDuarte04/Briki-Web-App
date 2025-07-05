import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { useToast } from "../../hooks/use-toast";
import CompanyLayout from "../../components/layout/company-layout";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import { Textarea } from "../../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Switch } from "../../components/ui/switch";
import { Checkbox } from "../../components/ui/checkbox";
import { FileUploader } from "../../components/ui/file-uploader";
import { Separator } from "../../components/ui/separator";
import { 
  Upload, 
  FileText, 
  AlertCircle, 
  CheckCircle, 
  ArrowRight,
  Info,
  Zap
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/alert";

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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl font-bold text-white">Upload Insurance Plan</h1>
          <p className="text-gray-400">Create a new insurance plan to be featured on Briki</p>
        </motion.div>
        
        {showPreview ? (
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Alert className="bg-[#002050] border border-[#0074FF]/30 text-white">
              <Info className="h-4 w-4 text-[#33BFFF]" />
              <AlertTitle className="text-[#33BFFF] font-medium">Preview Mode</AlertTitle>
              <AlertDescription className="text-gray-300">
                This is how your insurance plan will appear to Briki users. Review the details before finalizing.
              </AlertDescription>
            </Alert>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Plan Card Preview */}
              <Card className="bg-[#001A40]/60 backdrop-blur-sm border-[#002C7A] shadow-[0_4px_12px_rgba(0,46,115,0.1)]">
                <CardHeader className="pb-2 border-b border-[#002C7A]">
                  <div className="flex justify-between items-center">
                    <Badge className="bg-[#002C7A] text-[#33BFFF] hover:bg-[#003087] border border-[#0074FF]/30">
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
                    <span className="text-xs text-gray-400">Plan ID: {watchedValues.planId}</span>
                  </div>
                  <CardTitle className="mt-2 text-white">{watchedValues.planName}</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-4">
                    <div>
                      <p className="text-gray-300 text-sm">{watchedValues.description}</p>
                    </div>
                    
                    <div>
                      <div className="text-sm text-gray-400">Coverage Amount</div>
                      <div className="text-lg font-bold text-white">${watchedValues.coverageAmount.toLocaleString()}</div>
                    </div>
                    
                    <div>
                      <div className="text-sm text-gray-400">Coverage Period</div>
                      <div className="text-lg font-bold text-white">{watchedValues.coveragePeriod} {watchedValues.coveragePeriodUnit}</div>
                    </div>
                    
                    <div>
                      <div className="text-sm text-gray-400 mb-2">Key Features</div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        {watchedValues.features.medicalExpenses && (
                          <div className="flex items-center">
                            <CheckCircle className="h-4 w-4 text-[#33BFFF] mr-2" />
                            <span className="text-gray-300">Medical Expenses</span>
                          </div>
                        )}
                        {watchedValues.features.tripCancellation && (
                          <div className="flex items-center">
                            <CheckCircle className="h-4 w-4 text-[#33BFFF] mr-2" />
                            <span className="text-gray-300">Trip Cancellation</span>
                          </div>
                        )}
                        {watchedValues.features.lostBaggage && (
                          <div className="flex items-center">
                            <CheckCircle className="h-4 w-4 text-[#33BFFF] mr-2" />
                            <span className="text-gray-300">Lost Baggage</span>
                          </div>
                        )}
                        {watchedValues.features.accidentalDeath && (
                          <div className="flex items-center">
                            <CheckCircle className="h-4 w-4 text-[#33BFFF] mr-2" />
                            <span className="text-gray-300">Accidental Death</span>
                          </div>
                        )}
                        {watchedValues.features.emergencyEvacuation && (
                          <div className="flex items-center">
                            <CheckCircle className="h-4 w-4 text-[#33BFFF] mr-2" />
                            <span className="text-gray-300">Emergency Evacuation</span>
                          </div>
                        )}
                        {watchedValues.features.adventureActivities && (
                          <div className="flex items-center">
                            <CheckCircle className="h-4 w-4 text-[#33BFFF] mr-2" />
                            <span className="text-gray-300">Adventure Activities</span>
                          </div>
                        )}
                        {watchedValues.features.preExistingConditions && (
                          <div className="flex items-center">
                            <CheckCircle className="h-4 w-4 text-[#33BFFF] mr-2" />
                            <span className="text-gray-300">Pre-existing Conditions</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t border-[#002C7A] pt-4 flex justify-between items-center">
                  <div className="text-2xl font-bold text-[#33BFFF]">${watchedValues.basePrice}</div>
                  <Button className="bg-[#0074FF] hover:bg-[#0055CC] text-white">Get Quote</Button>
                </CardFooter>
              </Card>
              
              {/* AI Assistant Preview */}
              <Card className="bg-[#001A40]/60 backdrop-blur-sm border-[#002C7A] shadow-[0_4px_12px_rgba(0,46,115,0.1)]">
                <CardHeader className="pb-2">
                  <CardTitle className="text-white">AI Assistant Recommendation</CardTitle>
                  <CardDescription className="text-gray-400">How your plan will appear in AI recommendations</CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="bg-[#002050]/80 p-4 rounded-lg space-y-4 border border-[#002C7A]">
                    <div className="bg-[#001A40]/80 p-3 rounded-lg shadow-sm border border-[#002C7A]">
                      <div className="flex items-start space-x-2">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-r from-[#003087] to-[#0074FF] flex items-center justify-center text-white font-bold shadow-[0_0_10px_rgba(51,191,255,0.3)]">
                          B
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-300">
                            I'd recommend <span className="font-semibold text-[#33BFFF]">{watchedValues.planName}</span> from your company, which provides ${watchedValues.coverageAmount.toLocaleString()} in coverage for {watchedValues.coveragePeriod} {watchedValues.coveragePeriodUnit}.
                          </p>
                          <p className="text-sm text-gray-300 mt-2">
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
              <Button 
                variant="outline" 
                onClick={handleReset}
                className="border-[#002C7A] text-gray-300 hover:text-white hover:bg-[#002C7A]/50 hover:border-[#0074FF]/50"
              >
                Edit Plan
              </Button>
              <Button 
                className="bg-[#0074FF] hover:bg-[#0055CC] text-white"
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
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Tabs 
              defaultValue={activeTab} 
              onValueChange={setActiveTab}
              className="space-y-6"
            >
              <TabsList className="grid grid-cols-2 mb-6 bg-[#002050] border border-[#003087]">
                <TabsTrigger 
                  value="manual" 
                  className="data-[state=active]:bg-[#0055CC] data-[state=active]:text-white"
                >
                  Manual Entry
                </TabsTrigger>
                <TabsTrigger 
                  value="csv"
                  className="data-[state=active]:bg-[#0055CC] data-[state=active]:text-white"
                >
                  Import from CSV
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="manual">
                <Card className="bg-[#001A40]/60 backdrop-blur-sm border-[#002C7A] shadow-[0_4px_12px_rgba(0,46,115,0.1)]">
                  <CardHeader>
                    <CardTitle className="text-white">Enter Insurance Plan Details</CardTitle>
                    <CardDescription className="text-gray-400">
                      Add information about your insurance plan to be shown on Briki
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form id="manual-form" onSubmit={handleSubmit(onSubmitManual)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Basic information */}
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="planName" className="text-gray-300">Plan Name</Label>
                            <Input 
                              id="planName" 
                              {...register("planName")} 
                              placeholder="e.g. Premium Travel Protection"
                              className="bg-[#001E47] border-[#002C7A] text-white placeholder:text-gray-500 focus:border-[#0074FF] focus:ring-[#0074FF]/20"
                            />
                            {errors.planName && (
                              <p className="text-sm text-red-400">{errors.planName.message}</p>
                            )}
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="planId" className="text-gray-300">Plan ID</Label>
                            <Input 
                              id="planId" 
                              {...register("planId")} 
                              placeholder="e.g. TRVL-PREMIUM-2023"
                              className="bg-[#001E47] border-[#002C7A] text-white placeholder:text-gray-500 focus:border-[#0074FF] focus:ring-[#0074FF]/20"
                            />
                            {errors.planId && (
                              <p className="text-sm text-red-400">{errors.planId.message}</p>
                            )}
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="insuranceType" className="text-gray-300">Insurance Type</Label>
                            <Select 
                              onValueChange={(value) => setValue("insuranceType", value)}
                            >
                              <SelectTrigger id="insuranceType" className="bg-[#001E47] border-[#002C7A] text-white focus:ring-[#0074FF]/20">
                                <SelectValue placeholder="Select insurance type" />
                              </SelectTrigger>
                              <SelectContent className="bg-[#001A40] border-[#002C7A] text-white">
                                <SelectItem value="travel">Travel Insurance</SelectItem>
                                <SelectItem value="auto">Auto Insurance</SelectItem>
                                <SelectItem value="health">Health Insurance</SelectItem>
                                <SelectItem value="pet">Pet Insurance</SelectItem>
                              </SelectContent>
                            </Select>
                            {errors.insuranceType && (
                              <p className="text-sm text-red-400">{errors.insuranceType.message}</p>
                            )}
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="basePrice" className="text-gray-300">Base Price ($)</Label>
                            <Input 
                              id="basePrice" 
                              type="number" 
                              step="0.01" 
                              {...register("basePrice")} 
                              className="bg-[#001E47] border-[#002C7A] text-white placeholder:text-gray-500 focus:border-[#0074FF] focus:ring-[#0074FF]/20"
                            />
                            {errors.basePrice && (
                              <p className="text-sm text-red-400">{errors.basePrice.message}</p>
                            )}
                          </div>
                        </div>
                        
                        {/* Details and coverage */}
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="description" className="text-gray-300">Description</Label>
                            <Textarea 
                              id="description" 
                              {...register("description")} 
                              placeholder="Describe your insurance plan in detail"
                              className="bg-[#001E47] border-[#002C7A] text-white placeholder:text-gray-500 focus:border-[#0074FF] focus:ring-[#0074FF]/20 min-h-[100px]"
                            />
                            {errors.description && (
                              <p className="text-sm text-red-400">{errors.description.message}</p>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="coverageAmount" className="text-gray-300">Coverage Amount ($)</Label>
                              <Input 
                                id="coverageAmount" 
                                type="number" 
                                {...register("coverageAmount")} 
                                className="bg-[#001E47] border-[#002C7A] text-white placeholder:text-gray-500 focus:border-[#0074FF] focus:ring-[#0074FF]/20"
                              />
                              {errors.coverageAmount && (
                                <p className="text-sm text-red-400">{errors.coverageAmount.message}</p>
                              )}
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="coveragePeriod" className="text-gray-300">Coverage Period</Label>
                              <div className="grid grid-cols-2 gap-2">
                                <Input 
                                  id="coveragePeriod" 
                                  type="number" 
                                  {...register("coveragePeriod")} 
                                  className="bg-[#001E47] border-[#002C7A] text-white placeholder:text-gray-500 focus:border-[#0074FF] focus:ring-[#0074FF]/20"
                                />
                                <Select 
                                  onValueChange={(value) => setValue("coveragePeriodUnit", value)}
                                >
                                  <SelectTrigger className="bg-[#001E47] border-[#002C7A] text-white focus:ring-[#0074FF]/20">
                                    <SelectValue placeholder="Unit" />
                                  </SelectTrigger>
                                  <SelectContent className="bg-[#001A40] border-[#002C7A] text-white">
                                    <SelectItem value="days">Days</SelectItem>
                                    <SelectItem value="months">Months</SelectItem>
                                    <SelectItem value="years">Years</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              {errors.coveragePeriod && (
                                <p className="text-sm text-red-400">{errors.coveragePeriod.message}</p>
                              )}
                              {errors.coveragePeriodUnit && (
                                <p className="text-sm text-red-400">{errors.coveragePeriodUnit.message}</p>
                              )}
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="termsUrl" className="text-gray-300">Terms URL (Optional)</Label>
                            <Input 
                              id="termsUrl" 
                              type="url" 
                              {...register("termsUrl")} 
                              placeholder="https://example.com/terms"
                              className="bg-[#001E47] border-[#002C7A] text-white placeholder:text-gray-500 focus:border-[#0074FF] focus:ring-[#0074FF]/20"
                            />
                            {errors.termsUrl && (
                              <p className="text-sm text-red-400">{errors.termsUrl.message}</p>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <Separator className="bg-[#002C7A]" />
                      
                      {/* Features section */}
                      <div>
                        <h3 className="text-lg font-medium text-white mb-4">Plan Features</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="medicalExpenses" 
                              onCheckedChange={(checked) => {
                                setValue("features.medicalExpenses", checked === true);
                              }}
                              className="border-[#0074FF] data-[state=checked]:bg-[#0074FF] data-[state=checked]:text-white"
                            />
                            <Label htmlFor="medicalExpenses" className="text-gray-300">Medical Expenses</Label>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="tripCancellation" 
                              onCheckedChange={(checked) => {
                                setValue("features.tripCancellation", checked === true);
                              }}
                              className="border-[#0074FF] data-[state=checked]:bg-[#0074FF] data-[state=checked]:text-white"
                            />
                            <Label htmlFor="tripCancellation" className="text-gray-300">Trip Cancellation</Label>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="lostBaggage" 
                              onCheckedChange={(checked) => {
                                setValue("features.lostBaggage", checked === true);
                              }}
                              className="border-[#0074FF] data-[state=checked]:bg-[#0074FF] data-[state=checked]:text-white"
                            />
                            <Label htmlFor="lostBaggage" className="text-gray-300">Lost Baggage</Label>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="accidentalDeath" 
                              onCheckedChange={(checked) => {
                                setValue("features.accidentalDeath", checked === true);
                              }}
                              className="border-[#0074FF] data-[state=checked]:bg-[#0074FF] data-[state=checked]:text-white"
                            />
                            <Label htmlFor="accidentalDeath" className="text-gray-300">Accidental Death</Label>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="emergencyEvacuation" 
                              onCheckedChange={(checked) => {
                                setValue("features.emergencyEvacuation", checked === true);
                              }}
                              className="border-[#0074FF] data-[state=checked]:bg-[#0074FF] data-[state=checked]:text-white"
                            />
                            <Label htmlFor="emergencyEvacuation" className="text-gray-300">Emergency Evacuation</Label>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="adventureActivities" 
                              onCheckedChange={(checked) => {
                                setValue("features.adventureActivities", checked === true);
                              }}
                              className="border-[#0074FF] data-[state=checked]:bg-[#0074FF] data-[state=checked]:text-white"
                            />
                            <Label htmlFor="adventureActivities" className="text-gray-300">Adventure Activities</Label>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="preExistingConditions" 
                              onCheckedChange={(checked) => {
                                setValue("features.preExistingConditions", checked === true);
                              }}
                              className="border-[#0074FF] data-[state=checked]:bg-[#0074FF] data-[state=checked]:text-white"
                            />
                            <Label htmlFor="preExistingConditions" className="text-gray-300">Pre-existing Conditions</Label>
                          </div>
                        </div>
                      </div>
                    </form>
                  </CardContent>
                  <CardFooter className="flex justify-end space-x-4 border-t border-[#002C7A] pt-6">
                    <Button 
                      variant="outline" 
                      onClick={() => reset()}
                      className="border-[#002C7A] text-gray-300 hover:text-white hover:bg-[#002C7A]/50 hover:border-[#0074FF]/50"
                    >
                      Reset
                    </Button>
                    <Button 
                      type="submit" 
                      form="manual-form" 
                      disabled={isSubmitting}
                      className="bg-[#0074FF] hover:bg-[#0055CC] text-white"
                    >
                      {isSubmitting ? "Creating..." : "Create Plan"}
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="csv">
                <Card className="bg-[#001A40]/60 backdrop-blur-sm border-[#002C7A] shadow-[0_4px_12px_rgba(0,46,115,0.1)]">
                  <CardHeader>
                    <CardTitle className="text-white">Import Plan from CSV</CardTitle>
                    <CardDescription className="text-gray-400">
                      Upload a CSV file with your insurance plan details
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="bg-[#001E47]/80 border border-dashed border-[#002C7A] rounded-lg p-8">
                      <div className="flex flex-col items-center text-center">
                        <div className="p-3 bg-[#002C7A]/70 rounded-full mb-4">
                          <FileText className="h-6 w-6 text-[#33BFFF]" />
                        </div>
                        
                        <h3 className="text-lg font-medium text-white mb-2">CSV Upload</h3>
                        <p className="text-gray-400 mb-4 max-w-md">
                          Upload a CSV file with your plan details. The file should include columns for plan name, ID, price, and features.
                        </p>
                        
                        <FileUploader 
                          onUpload={handleFileUpload}
                          accept=".csv"
                          className="bg-[#002050] border-[#002C7A] text-white hover:bg-[#002C7A]/70 hover:border-[#0074FF]/50"
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          {uploadedFile ? "Replace CSV" : "Upload CSV"}
                        </FileUploader>
                        
                        {uploadedFile && (
                          <div className="mt-4 flex items-center text-sm text-[#33BFFF]">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            <span className="mr-1">Uploaded:</span>
                            <span className="font-medium">{uploadedFile.name}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="p-4 bg-[#002050]/80 border-l-4 border-[#33BFFF] rounded-sm">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <AlertCircle className="h-5 w-5 text-[#33BFFF]" />
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-white">CSV Format Tips</h3>
                          <div className="mt-2 text-sm text-gray-300">
                            <p>Your CSV should include the following headers:</p>
                            <ul className="list-disc pl-5 mt-1 space-y-1">
                              <li>planName, planId, insuranceType, basePrice</li>
                              <li>description, coverageAmount, coveragePeriod</li>
                              <li>features (comma-separated list of features)</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end space-x-4 border-t border-[#002C7A] pt-6">
                    <Button 
                      onClick={() => setShowPreview(true)}
                      disabled={!uploadedFile}
                      className="bg-[#0074FF] hover:bg-[#0055CC] text-white flex items-center"
                    >
                      <Zap className="mr-2 h-4 w-4" />
                      Preview Plan
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        )}
      </div>
    </CompanyLayout>
  );
}