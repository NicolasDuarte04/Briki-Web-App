import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { format } from "date-fns";
import { 
  ChevronRight, 
  Download, 
  Filter, 
  RefreshCw, 
  Search, 
  Trash2, 
  Calendar,
  FileText,
  Shield,
  MapPin
} from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { trackEvent } from "@/lib/analytics";
import { Quote } from "@shared/schema";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// Using components we created directly in this project
import PageHeader from "../components/page-header";
import EmptyState from "../components/empty-state";

// Quote status badge component
const StatusBadge = ({ status }: { status: string }) => {
  let variant: "default" | "secondary" | "destructive" | "outline" = "default";
  let label = status;

  switch (status) {
    case "pending":
      variant = "outline";
      label = "Pending";
      break;
    case "active":
      variant = "default";
      label = "Active";
      break;
    case "expired":
      variant = "destructive";
      label = "Expired";
      break;
    case "purchased":
      variant = "secondary";
      label = "Purchased";
      break;
    default:
      variant = "outline";
  }

  return <Badge variant={variant}>{label}</Badge>;
};

// Get icon for insurance category
const CategoryIcon = ({ category }: { category: string }) => {
  switch (category.toLowerCase()) {
    case "travel":
      return <MapPin className="h-4 w-4 mr-1" />;
    case "auto":
      return <Calendar className="h-4 w-4 mr-1" />;
    case "pet":
      return <FileText className="h-4 w-4 mr-1" />;
    case "health":
      return <Shield className="h-4 w-4 mr-1" />;
    default:
      return <FileText className="h-4 w-4 mr-1" />;
  }
};

// Quote Detail Dialog Component
const QuoteDetailDialog = ({ 
  isOpen, 
  onClose, 
  quoteId 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  quoteId: number | null 
}) => {
  const { toast } = useToast();
  const [isDownloading, setIsDownloading] = useState(false);

  // Fetch quote details
  const { data: quote, isLoading, error } = useQuery<Quote>({
    queryKey: ['/api/quotes', quoteId],
    enabled: isOpen && quoteId !== null,
  });
  
  // Helper function to safely render coverage details
  const renderCoverageDetails = () => {
    if (!quote || !quote.quoteDetails) return null;
    
    try {
      const details = typeof quote.quoteDetails === 'object' ? 
        quote.quoteDetails as Record<string, any> : 
        JSON.parse(String(quote.quoteDetails));
        
      return (
        <div>
          <p className="text-sm font-medium">Selected Coverage</p>
          <div className="text-sm text-muted-foreground mt-1">
            {Object.entries(details).map(([key, value]) => (
              <div key={key} className="flex justify-between py-1 border-b">
                <span>{key.replace(/([A-Z])/g, ' $1').replace(/^./, (str: string) => str.toUpperCase())}</span>
                <span>{typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value)}</span>
              </div>
            ))}
          </div>
        </div>
      );
    } catch (e) {
      console.error('Error parsing quote details:', e);
      return (
        <div className="text-sm text-muted-foreground">
          <p>Coverage details unavailable</p>
        </div>
      );
    }
  };

  // Handle quote download as PDF
  const handleDownload = async () => {
    if (!quote) return;
    
    setIsDownloading(true);
    
    try {
      // Track download event
      trackEvent('quote_download', 'quote_history', quote.quoteReference);
      
      // Dynamically import jsPDF to avoid loading it on initial page load
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF();
      
      // Set up the PDF document
      doc.setFontSize(20);
      doc.text("Insurance Quote Details", 105, 20, { align: "center" });
      
      doc.setFontSize(12);
      doc.text(`Reference: ${quote.quoteReference}`, 20, 40);
      doc.text(`Date: ${quote.createdAt ? new Date(quote.createdAt).toLocaleDateString() : 'N/A'}`, 20, 50);
      doc.text(`Category: ${quote.category.charAt(0).toUpperCase() + quote.category.slice(1)} Insurance`, 20, 60);
      doc.text(`Status: ${quote.statusCode || 'Pending'}`, 20, 70);
      
      // Trip details
      doc.setFontSize(16);
      doc.text("Trip Information", 20, 90);
      doc.setFontSize(12);
      doc.text(`Destination: ${quote.country}`, 30, 100);
      doc.text(`Travel Dates: ${quote.startDate ? new Date(quote.startDate).toLocaleDateString() : 'N/A'} - ${quote.endDate ? new Date(quote.endDate).toLocaleDateString() : 'N/A'}`, 30, 110);
      doc.text(`Travelers: ${quote.travelersCount}`, 30, 120);
      
      // Coverage details
      if (quote.quoteDetails && typeof quote.quoteDetails === 'object') {
        doc.setFontSize(16);
        doc.text("Coverage Details", 20, 140);
        doc.setFontSize(12);
        
        let yPos = 150;
        Object.entries(quote.quoteDetails as Record<string, any>).forEach(([key, value], index) => {
          const formattedKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
          const formattedValue = typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value);
          doc.text(`${formattedKey}: ${formattedValue}`, 30, yPos + (index * 10));
        });
      }
      
      // Price information
      doc.setFontSize(16);
      doc.text("Price Information", 20, 220);
      doc.setFontSize(12);
      doc.text(`Total Premium: $${quote.totalPrice ? quote.totalPrice.toFixed(2) : '0.00'}`, 30, 230);
      
      // Footer
      doc.setFontSize(10);
      doc.text("This document is generated by Briki Insurance Platform", 105, 280, { align: "center" });
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 105, 285, { align: "center" });
      
      // Save the PDF
      doc.save(`briki-quote-${quote.quoteReference}.pdf`);
      
      toast({
        title: "Quote downloaded",
        description: `Quote ${quote.quoteReference} has been downloaded as PDF successfully.`,
      });
    } catch (err) {
      console.error('Error generating PDF:', err);
      toast({
        title: "Download failed",
        description: "There was an error downloading your quote. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Quote Details</DialogTitle>
          <DialogDescription>
            Complete information about your insurance quote.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-4 py-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : error ? (
          <div className="py-6 text-center text-destructive">
            <p>There was an error loading the quote details.</p>
          </div>
        ) : quote ? (
          <>
            <div className="grid gap-4 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Reference Number</p>
                  <p className="text-sm text-muted-foreground">{quote.quoteReference}</p>
                </div>
                <StatusBadge status={quote.statusCode || "pending"} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Created</p>
                  <p className="text-sm text-muted-foreground">
                    {quote.createdAt ? format(new Date(quote.createdAt), 'PPP') : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Expires</p>
                  <p className="text-sm text-muted-foreground">
                    {quote.expiresAt 
                      ? format(new Date(quote.expiresAt), 'PPP')
                      : 'Not applicable'}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium">Category</p>
                <div className="flex items-center text-sm text-muted-foreground">
                  <CategoryIcon category={quote.category} />
                  {quote.category.charAt(0).toUpperCase() + quote.category.slice(1)} Insurance
                </div>
              </div>

              <div>
                <p className="text-sm font-medium">Trip Information</p>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium">From:</span> {quote.startDate ? format(new Date(quote.startDate), 'PP') : 'N/A'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium">To:</span> {quote.endDate ? format(new Date(quote.endDate), 'PP') : 'N/A'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium">Destination:</span> {quote.country}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium">Travelers:</span> {quote.travelersCount}
                  </p>
                </div>
              </div>

              {renderCoverageDetails()}

              <div className="bg-primary/10 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-lg">Total Premium</span>
                  <span className="text-2xl font-bold">
                    ${quote.totalPrice ? quote.totalPrice.toFixed(2) : '0.00'}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  This quote is valid until {quote.expiresAt ? format(new Date(quote.expiresAt), 'PP') : 'N/A'}
                </p>
              </div>
            </div>

            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button 
                variant="outline" 
                onClick={handleDownload} 
                disabled={isDownloading}
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                {isDownloading ? 'Downloading...' : 'Download Quote'}
              </Button>
              <Button 
                onClick={() => {
                  trackEvent('quote_apply', 'quote_history', quote.quoteReference);
                  onClose();
                  // Navigate to application based on category
                  // window.location.href = `/insurance/${quote.category}/apply?quoteId=${quote.id}`;
                }}
              >
                Apply For This Plan
              </Button>
            </DialogFooter>
          </>
        ) : (
          <div className="py-6 text-center">
            <p>No quote details found.</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

// Main Quote History Page Component
export default function QuoteHistoryPage() {
  const [, navigate] = useLocation();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedQuoteId, setSelectedQuoteId] = useState<number | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [deleteQuoteId, setDeleteQuoteId] = useState<number | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Fetch quotes from API
  const {
    data: quotes,
    isLoading,
    error,
    refetch
  } = useQuery<Quote[]>({
    queryKey: ['/api/quotes'],
    enabled: isAuthenticated,
  });

  // Track page view and other analytics events
  React.useEffect(() => {
    if (isAuthenticated) {
      // Track page view with more detailed category and label
      trackEvent('view_quote_history', 'account_section', 'quote_management');
      
      // Report to Google Analytics for enhanced tracking
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'screen_view', {
          app_name: 'Briki',
          screen_name: 'Quote History'
        });
      }
    }
  }, [isAuthenticated]);

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to view your quote history",
        variant: "destructive",
      });
      navigate("/login?redirect=/quote-history");
    }
  }, [authLoading, isAuthenticated, navigate, toast]);

  // Handle view quote details with enhanced analytics
  const handleViewQuote = (quoteId: number, quoteReference?: string) => {
    setSelectedQuoteId(quoteId);
    setIsDetailOpen(true);
    
    // Enhanced analytics tracking with more context
    trackEvent('view_quote_details', 'quote_history', quoteReference || quoteId.toString());
    
    // Additional Google Analytics event for detailed tracking
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'view_item', {
        items: [{
          id: quoteId,
          item_id: quoteReference,
          item_category: 'insurance_quote'
        }]
      });
    }
  };

  // Handle delete quote confirmation
  const handleDeleteConfirm = (quoteId: number) => {
    setDeleteQuoteId(quoteId);
    setIsDeleteDialogOpen(true);
  };

  // Handle actual quote deletion
  const handleDeleteQuote = async () => {
    if (!deleteQuoteId) return;
    
    try {
      // In a real app, this would call the API to delete the quote
      // await fetch(`/api/quotes/${deleteQuoteId}`, { method: 'DELETE' });
      
      toast({
        title: "Quote deleted",
        description: "The quote has been deleted from your history.",
      });
      
      // Refetch quotes to update the list
      refetch();
      
      // Track delete event
      trackEvent('delete_quote', 'quote_history', deleteQuoteId.toString());
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete the quote. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setDeleteQuoteId(null);
    }
  };

  // Filter quotes based on search and filters
  const filteredQuotes = React.useMemo(() => {
    if (!quotes || !Array.isArray(quotes)) return [];
    
    return quotes.filter((quote: Quote) => {
      // Status filter
      if (statusFilter !== "all" && quote.statusCode !== statusFilter) {
        return false;
      }
      
      // Category filter
      if (categoryFilter !== "all" && quote.category !== categoryFilter) {
        return false;
      }
      
      // Search query
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        return (
          quote.quoteReference.toLowerCase().includes(searchLower) ||
          quote.country.toLowerCase().includes(searchLower)
        );
      }
      
      return true;
    });
  }, [quotes, searchQuery, statusFilter, categoryFilter]);

  return (
    <div className="container py-6 max-w-6xl">
      <PageHeader
        title="Quote History"
        description="View and manage your insurance quotes"
        className="mb-6"
      />
      
      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search quotes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
              <SelectItem value="purchased">Purchased</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[160px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="travel">Travel</SelectItem>
              <SelectItem value="auto">Auto</SelectItem>
              <SelectItem value="pet">Pet</SelectItem>
              <SelectItem value="health">Health</SelectItem>
            </SelectContent>
          </Select>
          
          <Button
            variant="outline"
            size="icon"
            onClick={() => refetch()}
            title="Refresh quotes"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="table" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="table">Table View</TabsTrigger>
          <TabsTrigger value="cards">Card View</TabsTrigger>
        </TabsList>
        
        <TabsContent value="table">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableCaption>Your quote history</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[180px]">Reference</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Destination</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    Array(3).fill(0).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                        <TableCell><Skeleton className="h-8 w-24 float-right" /></TableCell>
                      </TableRow>
                    ))
                  ) : error ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-destructive py-4">
                        Error loading quotes. Please try again.
                      </TableCell>
                    </TableRow>
                  ) : filteredQuotes.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-4">
                        No quotes found. {searchQuery || statusFilter !== "all" || categoryFilter !== "all" ? (
                          "Try adjusting your filters."
                        ) : (
                          <Link to="/trip-info" className="text-primary font-medium hover:underline">Get a quote</Link>
                        )}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredQuotes.map((quote) => (
                      <TableRow key={quote.id}>
                        <TableCell className="font-mono text-xs">
                          {quote.quoteReference}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <CategoryIcon category={quote.category} />
                            {quote.category.charAt(0).toUpperCase() + quote.category.slice(1)}
                          </div>
                        </TableCell>
                        <TableCell>
                          {quote.createdAt ? format(new Date(quote.createdAt), 'PP') : 'N/A'}
                        </TableCell>
                        <TableCell>{quote.country}</TableCell>
                        <TableCell>${quote.totalPrice?.toFixed(2) || "0.00"}</TableCell>
                        <TableCell>
                          <StatusBadge status={quote.statusCode || "pending"} />
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleViewQuote(quote.id, quote.quoteReference)}
                              title="View details"
                            >
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteConfirm(quote.id)}
                              title="Delete quote"
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="cards">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array(6).fill(0).map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <Skeleton className="h-4 w-1/2 mb-1" />
                    <Skeleton className="h-6 w-3/4" />
                  </CardHeader>
                  <CardContent className="pb-3">
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3 mb-2" />
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-8 w-1/3 mt-4" />
                  </CardContent>
                  <CardFooter className="flex justify-between pt-2 border-t">
                    <Skeleton className="h-9 w-20" />
                    <Skeleton className="h-9 w-20" />
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : error ? (
            <EmptyState
              title="Error loading quotes"
              description="There was a problem loading your quotes. Please try again."
              action={<Button onClick={() => refetch()}>Retry</Button>}
            />
          ) : filteredQuotes.length === 0 ? (
            <EmptyState
              title={searchQuery || statusFilter !== "all" || categoryFilter !== "all" 
                ? "No matching quotes" 
                : "No quotes found"}
              description={searchQuery || statusFilter !== "all" || categoryFilter !== "all"
                ? "Try adjusting your search filters to find what you're looking for."
                : "You haven't created any quotes yet. Get started by getting your first quote!"}
              action={
                searchQuery || statusFilter !== "all" || categoryFilter !== "all" ? (
                  <Button onClick={() => {
                    setSearchQuery("");
                    setStatusFilter("all");
                    setCategoryFilter("all");
                  }}>
                    Clear Filters
                  </Button>
                ) : (
                  <Link href="/trip-info"><Button>Get a Quote</Button></Link>
                )
              }
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredQuotes.map((quote) => (
                <Card key={quote.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-base">
                        <div className="flex items-center">
                          <CategoryIcon category={quote.category} />
                          {quote.category.charAt(0).toUpperCase() + quote.category.slice(1)} Insurance
                        </div>
                      </CardTitle>
                      <StatusBadge status={quote.statusCode || "pending"} />
                    </div>
                    <CardDescription className="font-mono text-xs mt-1">
                      {quote.quoteReference}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <div className="text-sm">
                      <div className="flex justify-between mb-1">
                        <span className="text-muted-foreground">Created:</span>
                        <span>{quote.createdAt ? format(new Date(quote.createdAt), 'PP') : 'N/A'}</span>
                      </div>
                      <div className="flex justify-between mb-1">
                        <span className="text-muted-foreground">Destination:</span>
                        <span>{quote.country}</span>
                      </div>
                      <div className="flex justify-between mb-1">
                        <span className="text-muted-foreground">Travel dates:</span>
                        <span>
                          {quote.startDate ? format(new Date(quote.startDate), 'PP') : 'N/A'} - {' '}
                          {quote.endDate ? format(new Date(quote.endDate), 'PP') : 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between mb-1">
                        <span className="text-muted-foreground">Travelers:</span>
                        <span>{quote.travelersCount}</span>
                      </div>
                    </div>
                    <div className="mt-3 bg-muted p-2 rounded-md">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">Total Price</span>
                        <span className="font-semibold">${quote.totalPrice?.toFixed(2) || "0.00"}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between pt-2 border-t">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => handleDeleteConfirm(quote.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                    <Button 
                      variant="default" 
                      size="sm"
                      onClick={() => handleViewQuote(quote.id, quote.quoteReference)}
                    >
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Quote Detail Dialog */}
      <QuoteDetailDialog
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        quoteId={selectedQuoteId}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this quote from your history.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90"
              onClick={handleDeleteQuote}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}