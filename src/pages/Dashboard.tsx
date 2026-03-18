import { useEffect, useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { PropertyCard } from "@/components/properties/PropertyCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { 
  Loader2, Heart, Clock, CheckCircle, Building, Building2, 
  LayoutDashboard, Rocket, TrendingUp, User, LogOut
} from "lucide-react";
import { MyListingsTab } from "@/components/dashboard/MyListingsTab";
import { StatCard } from "@/components/dashboard/StatCard";
import { MarketPulse } from "@/components/dashboard/MarketPulse";
import { useUserSubmissions } from "@/hooks/useUserSubmissions";
import type { Tables } from "@/integrations/supabase/types";

type Property = Tables<"properties">;

interface SavedProperty extends Property {
  saved_at: string;
}

interface Reservation {
  id: string;
  property_id: string;
  status: string;
  deposit_amount: number | null;
  created_at: string;
  property: Property;
}

const Dashboard = () => {
  const { user, investorStatus, signOut } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const currentTab = searchParams.get("tab") || "overview";
  const [savedProperties, setSavedProperties] = useState<SavedProperty[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<{ full_name: string; email: string } | null>(null);
  const { submissions } = useUserSubmissions();

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        const { data: profileData } = await supabase
          .from("profiles")
          .select("full_name, email")
          .eq("user_id", user.id)
          .single();

        if (profileData) setProfile(profileData);

        const { data: savedData } = await supabase
          .from("saved_properties")
          .select(`created_at, property:properties(*)`)
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (savedData) {
          const saved = savedData
            .filter((item) => item.property)
            .map((item) => ({ ...(item.property as Property), saved_at: item.created_at }));
          setSavedProperties(saved);
        }

        const { data: reservationData } = await supabase
          .from("property_reservations")
          .select(`id, property_id, status, deposit_amount, created_at, property:properties(*)`)
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (reservationData) {
          const reservs = reservationData
            .filter((item) => item.property)
            .map((item) => ({
              id: item.id,
              property_id: item.property_id,
              status: item.status,
              deposit_amount: item.deposit_amount,
              created_at: item.created_at,
              property: item.property as Property,
            }));
          setReservations(reservs);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading) {
    return (
      <AppLayout 
        pageTitle="Dashboard" 
        pageIcon={<LayoutDashboard className="h-5 w-5" />}
      >
        <div className="min-h-[80vh] flex items-center justify-center bg-background-secondary">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  const renderContent = () => {
    switch (currentTab) {
      case "listings":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-foreground">My Listings</h2>
              <p className="text-sm text-muted-foreground">Properties you've submitted for review</p>
            </div>
            <MyListingsTab />
          </div>
        );
      
      case "reservations":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-foreground">My Reservations</h2>
              <p className="text-sm text-muted-foreground">Properties you've reserved or completed</p>
            </div>
            {reservations.length > 0 ? (
              <div className="space-y-4">
                {reservations.map((reservation) => (
                  <Card key={reservation.id} className="shadow-sm bg-card">
                    <CardContent className="flex flex-col md:flex-row items-start md:items-center gap-4 p-5">
                      <div className="flex-shrink-0">
                        <img
                          src={reservation.property.photo_urls?.[0] || "/placeholder.svg"}
                          alt={reservation.property.title}
                          className="w-24 h-24 object-cover rounded-xl"
                        />
                      </div>
                      <div className="flex-1">
                        <Link
                          to={`/properties/${reservation.property.id}`}
                          className="font-semibold hover:text-primary transition-colors"
                        >
                          {reservation.property.title}
                        </Link>
                        <p className="text-sm text-muted-foreground">
                          {reservation.property.property_city} {reservation.property.property_postcode}
                        </p>
                        <p className="text-lg font-bold text-primary mt-1">
                          £{reservation.property.asking_price.toLocaleString()}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge
                          variant={
                            reservation.status === "completed" ? "default"
                              : reservation.status === "pending" ? "secondary"
                              : "outline"
                          }
                        >
                          {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          Reserved {new Date(reservation.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="shadow-sm bg-card">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <Clock className="h-8 w-8 text-muted-foreground mb-4" />
                  <CardTitle className="text-xl mb-2">No reservations yet</CardTitle>
                  <CardDescription className="text-center mb-6 max-w-md">
                    Reserve a property to start your investment journey.
                  </CardDescription>
                  <Button asChild>
                    <Link to="/properties">
                      <Rocket className="mr-2 h-4 w-4" />
                      Find New Deals
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        );

      case "saved":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-foreground">Saved Properties</h2>
              <p className="text-sm text-muted-foreground">Properties you've added to your watchlist</p>
            </div>
            {savedProperties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {savedProperties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            ) : (
              <Card className="shadow-sm bg-card">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <Heart className="h-8 w-8 text-muted-foreground mb-4" />
                  <CardTitle className="text-xl mb-2">No saved properties</CardTitle>
                  <CardDescription className="text-center mb-6 max-w-md">
                    Save properties you're interested in to keep track of them here.
                  </CardDescription>
                  <Button asChild>
                    <Link to="/properties">
                      <Rocket className="mr-2 h-4 w-4" />
                      Browse Properties
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        );

      case "settings":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-foreground">Account Settings</h2>
              <p className="text-sm text-muted-foreground">Manage your profile and preferences</p>
            </div>
            <Card className="shadow-sm bg-card">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>Your account details</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                    <p className="text-foreground font-medium">{profile?.full_name || "Not set"}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-muted-foreground">Email Address</label>
                    <p className="text-foreground font-medium">{profile?.email || user?.email}</p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">Investor Status</p>
                    <p className="text-sm text-muted-foreground">Your current verification level</p>
                  </div>
                  <Badge variant={investorStatus === "approved" ? "default" : "secondary"} className="gap-1">
                    {investorStatus === "approved" ? <CheckCircle className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                    {investorStatus === "approved" ? "Approved" : "Pending"}
                  </Badge>
                </div>
                <Separator />
                <Button variant="outline" disabled>Edit Profile (Coming Soon)</Button>
              </CardContent>
            </Card>

            <Card className="shadow-sm bg-card border-destructive/20">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <LogOut className="h-5 w-5 text-destructive" />
                  <div>
                    <CardTitle>Sign Out</CardTitle>
                    <CardDescription>Log out of your account</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  You'll need to sign in again to access your dashboard and saved properties.
                </p>
                <Button 
                  variant="destructive" 
                  onClick={async () => { await signOut(); navigate("/"); }}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Log Out
                </Button>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Saved Properties"
                value={savedProperties.length}
                subtitle="In your watchlist"
                icon={<Heart className="h-4 w-4" />}
                isPrimary
              />
              <StatCard
                title="My Listings"
                value={submissions.length}
                subtitle="Submitted for review"
                icon={<Building2 className="h-4 w-4" />}
              />
              <StatCard
                title="Active Reservations"
                value={reservations.filter((r) => r.status === "pending").length}
                subtitle="Awaiting completion"
                icon={<Clock className="h-4 w-4" />}
              />
              <StatCard
                title="Completed Deals"
                value={reservations.filter((r) => r.status === "completed").length}
                subtitle="Successfully acquired"
                icon={<Building className="h-4 w-4" />}
              />
            </div>

            {savedProperties.length > 0 ? (
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <h2 className="text-lg font-semibold text-foreground">Saved Properties</h2>
                      <p className="text-sm text-muted-foreground">Your watchlist for quick access</p>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {savedProperties.slice(0, 6).map((property) => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
                </div>
                {savedProperties.length > 6 && (
                  <div className="text-center pt-2">
                    <Button variant="outline" asChild>
                      <Link to="/dashboard?tab=saved">
                        View All {savedProperties.length} Saved Properties
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <MarketPulse />
            )}

            {(submissions.length > 0 || reservations.length > 0) && (
              <div className="space-y-5">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">Recent Activity</h2>
                    <p className="text-sm text-muted-foreground">Your latest updates</p>
                  </div>
                </div>
                <Card className="shadow-sm bg-card">
                  <CardContent className="p-0 divide-y divide-border">
                    {submissions.slice(0, 3).map((submission) => (
                      <div key={submission.id} className="flex items-center gap-4 p-4">
                        <Building2 className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground truncate">
                            {submission.property_address}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Listing submitted · {new Date(submission.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant="secondary" className="capitalize">
                          {submission.admin_status}
                        </Badge>
                      </div>
                    ))}
                    {reservations.slice(0, 2).map((reservation) => (
                      <div key={reservation.id} className="flex items-center gap-4 p-4">
                        <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground truncate">
                            {reservation.property.title}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Reservation · {new Date(reservation.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge 
                          variant={reservation.status === "completed" ? "default" : "secondary"} 
                          className="capitalize"
                        >
                          {reservation.status}
                        </Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            )}
          </>
        );
    }
  };

  return (
    <AppLayout
      pageTitle={`Welcome back, ${profile?.full_name?.split(" ")[0] || "Investor"}`}
      pageSubtitle="Manage your property investments"
      pageIcon={<LayoutDashboard className="h-5 w-5" />}
      headerActions={
        <div className="flex items-center gap-3">
          <Badge variant={investorStatus === "approved" ? "default" : "secondary"} className="gap-1 hidden sm:flex">
            {investorStatus === "approved" ? <CheckCircle className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
            {investorStatus === "approved" ? "Approved Investor" : "Pending Approval"}
          </Badge>
          <Button asChild size="sm" className="gap-2">
            <Link to="/properties">
              <Rocket className="h-4 w-4" />
              <span className="hidden sm:inline">Find New Deals</span>
              <span className="sm:hidden">Browse</span>
            </Link>
          </Button>
        </div>
      }
    >
      <div className="p-6 bg-background-secondary min-h-full space-y-8">
        {renderContent()}
      </div>
    </AppLayout>
  );
};

export default Dashboard;
