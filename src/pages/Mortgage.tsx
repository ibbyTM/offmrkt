import { useSearchParams, Link } from "react-router-dom";
import { useEffect, useRef } from "react";
import { Phone, Mail, Building2, ArrowLeft, Shield, Award, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useProperty } from "@/hooks/useProperties";
import { formatPrice } from "@/lib/propertyUtils";
import { Layout } from "@/components/layout/Layout";
import { supabase } from "@/integrations/supabase/client";

// Broker details - easily configurable
const MORTGAGE_BROKER = {
  name: "John Smith",
  company: "ABC Mortgages Ltd",
  phone: "+44 7700 900123",
  email: "john@abcmortgages.com",
  bio: "Specialist in buy-to-let and investment property mortgages with 15+ years experience. We help investors secure the best rates for their property portfolio.",
  credentials: "FCA Regulated | Whole of Market Access",
};

export default function Mortgage() {
  const [searchParams] = useSearchParams();
  const propertyId = searchParams.get("propertyId");
  const hasTracked = useRef(false);
  
  const { data: property, isLoading } = useProperty(propertyId || "");

  // Track referral when user visits from a property
  useEffect(() => {
    const trackReferral = async () => {
      if (hasTracked.current) return;
      hasTracked.current = true;

      const { data: { user } } = await supabase.auth.getUser();
      
      await supabase.from("mortgage_referrals").insert({
        property_id: propertyId || null,
        user_id: user?.id || null,
        referrer_url: document.referrer || null,
      });
    };

    trackReferral();
  }, [propertyId]);

  const deposit = property ? Math.round(property.asking_price * 0.25) : 0;
  const mortgageNeeded = property ? property.asking_price - deposit : 0;

  const emailSubject = property 
    ? `Mortgage Enquiry - ${property.title} (${formatPrice(property.asking_price)})`
    : "Mortgage Enquiry";
  
  const emailBody = property
    ? `Hi ${MORTGAGE_BROKER.name},\n\nI'm interested in getting a mortgage for the following property:\n\n${property.title}\n${property.property_address}, ${property.property_city} ${property.property_postcode}\nAsking Price: ${formatPrice(property.asking_price)}\n\nPlease get in touch to discuss my options.\n\nThank you`
    : `Hi ${MORTGAGE_BROKER.name},\n\nI'm interested in getting a mortgage for an investment property. Please get in touch to discuss my options.\n\nThank you`;

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
                  {isLoading ? (
                    <div className="animate-pulse space-y-3">
                      <div className="h-5 bg-muted rounded w-3/4" />
                      <div className="h-4 bg-muted rounded w-1/2" />
                    </div>
                  ) : property ? (
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-semibold text-lg">{property.title}</h3>
                        <p className="text-muted-foreground text-sm">
                          {property.property_address}, {property.property_city} {property.property_postcode}
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

            {/* Broker Contact Card */}
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
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Shield className="h-4 w-4 text-green-600" />
                  <span>{MORTGAGE_BROKER.credentials}</span>
                </div>

                <Separator />

                <div className="space-y-3">
                  <Button asChild className="w-full" size="lg">
                    <a href={`tel:${MORTGAGE_BROKER.phone.replace(/\s/g, "")}`}>
                      <Phone className="mr-2 h-5 w-5" />
                      Call Now
                    </a>
                  </Button>
                  
                  <Button asChild variant="outline" className="w-full" size="lg">
                    <a href={`mailto:${MORTGAGE_BROKER.email}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`}>
                      <Mail className="mr-2 h-5 w-5" />
                      Send Email Enquiry
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>

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
            {MORTGAGE_BROKER.company} is authorised and regulated by the Financial Conduct Authority.
          </p>
        </div>
      </div>
    </Layout>
  );
}
