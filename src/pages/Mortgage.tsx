import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Phone, Building2, ArrowLeft, Shield, Award, Clock, Lock, LogIn, UserPlus, Globe, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useProperty } from "@/hooks/useProperties";
import { formatPrice } from "@/lib/propertyUtils";
import { Layout } from "@/components/layout/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { MortgageEnquiryDialog } from "@/components/mortgage/MortgageEnquiryDialog";

// Broker details - Vickers Young Commercial Finance
const MORTGAGE_BROKER = {
  name: "Paul Kalé",
  company: "Vickers Young Commercial Finance",
  phone: "07983 553780",
  email: "commercial2@vickersyoung.co.uk",
  website: "vickersyoungcommercialfinance.co.uk",
  bio: "Specialist in commercial and buy-to-let mortgages. Expert guidance on investment property finance, helping you secure the best rates for your portfolio.",
  credentials: "FCA Regulated | Whole of Market Access",
  responseTime: "24 hours",
};

export default function Mortgage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const propertyId = searchParams.get("propertyId");
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const { user, loading: authLoading } = useAuth();
  const { data: property, isLoading: propertyLoading } = useProperty(propertyId || "");

  const deposit = property ? Math.round(property.asking_price * 0.25) : 0;
  const mortgageNeeded = property ? property.asking_price - deposit : 0;

  const handleSignIn = () => {
    navigate(`/login?redirect=/mortgage${propertyId ? `?propertyId=${propertyId}` : ''}`);
  };

  const handleSignUp = () => {
    navigate(`/register?redirect=/mortgage${propertyId ? `?propertyId=${propertyId}` : ''}`);
  };

  const handleCallBroker = () => {
    window.location.href = `tel:${MORTGAGE_BROKER.phone.replace(/\s/g, "")}`;
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Back Button */}
          {propertyId && (
            <Link to={`/properties/${propertyId}`} className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Property
            </Link>
          )}

          {/* Hero Section */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <Building2 className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-3">Get Your Mortgage Sorted</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Our trusted mortgage partner specialises in investment property finance and can help you secure the best rates.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Property Summary Card */}
            {propertyId && (
              <Card className="md:col-span-2 border-primary/20 bg-primary/5">
                <CardHeader>
                  <CardTitle className="text-lg">Property Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  {propertyLoading ? (
                    <div className="animate-pulse space-y-3">
                      <div className="h-5 bg-muted rounded w-3/4" />
                      <div className="h-4 bg-muted rounded w-1/2" />
                    </div>
                  ) : property ? (
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-semibold text-lg">{property.title}</h3>
                        <p className="text-muted-foreground text-sm">
                          {property.property_city} {property.property_postcode}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Asking Price</p>
                          <p className="font-semibold text-lg">{formatPrice(property.asking_price)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Deposit (25%)</p>
                          <p className="font-semibold text-lg">{formatPrice(deposit)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Mortgage Needed</p>
                          <p className="font-semibold text-lg">{formatPrice(mortgageNeeded)}</p>
                        </div>
                        {property.estimated_rental_income && (
                          <div>
                            <p className="text-muted-foreground">Est. Monthly Rent</p>
                            <p className="font-semibold text-lg">{formatPrice(property.estimated_rental_income)}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">Property not found</p>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Auth Gate or Broker Contact Card */}
            {authLoading ? (
              <Card>
                <CardContent className="p-8">
                  <div className="animate-pulse space-y-4">
                    <div className="h-6 bg-muted rounded w-1/2" />
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-10 bg-muted rounded w-full" />
                  </div>
                </CardContent>
              </Card>
            ) : !user ? (
              <Card className="border-amber-500/30 bg-amber-500/5">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Lock className="h-5 w-5 text-amber-600" />
                    Sign In to Get Mortgage Help
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    To speak with our mortgage specialist and receive personalised rates tailored to your investment profile, please sign in or create an account.
                  </p>
                  
                  <div className="space-y-3">
                    <Button onClick={handleSignIn} className="w-full" size="lg">
                      <LogIn className="mr-2 h-5 w-5" />
                      Sign In
                    </Button>
                    
                    <Button onClick={handleSignUp} variant="outline" className="w-full" size="lg">
                      <UserPlus className="mr-2 h-5 w-5" />
                      Create Account
                    </Button>
                  </div>
                  
                  <p className="text-xs text-muted-foreground text-center">
                    Your investment profile helps our broker find the best rates for you.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Your Mortgage Specialist</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-xl">{MORTGAGE_BROKER.name}</h3>
                    <p className="text-primary font-medium">{MORTGAGE_BROKER.company}</p>
                    <p className="text-sm text-muted-foreground mt-2">{MORTGAGE_BROKER.bio}</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-3 text-sm">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Shield className="h-4 w-4 text-green-600" />
                      <span>{MORTGAGE_BROKER.credentials}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Clock className="h-4 w-4 text-blue-600" />
                      <span>Responds within {MORTGAGE_BROKER.responseTime}</span>
                    </div>
                  </div>
                  
                  <a 
                    href={`https://${MORTGAGE_BROKER.website}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-sm text-primary hover:underline"
                  >
                    <Globe className="h-4 w-4" />
                    {MORTGAGE_BROKER.website}
                  </a>

                  <Separator />

                  {/* CTA Buttons */}
                  <div className="space-y-3">
                    <Button 
                      onClick={() => setDialogOpen(true)} 
                      className="w-full" 
                      size="lg"
                    >
                      <Send className="mr-2 h-5 w-5" />
                      Send Enquiry
                    </Button>
                    
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground mb-2">Need to speak urgently?</p>
                      <Button 
                        onClick={handleCallBroker} 
                        variant="outline" 
                        className="w-full" 
                        size="lg"
                      >
                        <Phone className="mr-2 h-5 w-5" />
                        Call Paul Now
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Why Use Our Partner */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Why Use Our Partner?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Award className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">Investment Specialists</h4>
                    <p className="text-sm text-muted-foreground">
                      Expert knowledge in buy-to-let and portfolio mortgages
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">Whole of Market</h4>
                    <p className="text-sm text-muted-foreground">
                      Access to all major lenders for the best rates
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">Fast Turnaround</h4>
                    <p className="text-sm text-muted-foreground">
                      Quick decisions to help you secure properties faster
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Trust Footer */}
          <p className="text-center text-xs text-muted-foreground mt-8">
            Your home may be repossessed if you do not keep up repayments on your mortgage.
            {' '}{MORTGAGE_BROKER.company} is authorised and regulated by the Financial Conduct Authority.
          </p>
        </div>
      </div>

      {/* Enquiry Dialog */}
      {user && (
        <MortgageEnquiryDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          property={property || null}
          userId={user.id}
          brokerPhone={MORTGAGE_BROKER.phone}
        />
      )}
    </Layout>
  );
}
