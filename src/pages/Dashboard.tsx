import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { PropertyCard } from "@/components/properties/PropertyCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Loader2, Heart, Clock, Settings, CheckCircle, Home, Building, Building2, LayoutDashboard } from "lucide-react";
import { MyListingsTab } from "@/components/dashboard/MyListingsTab";
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
  const { user, investorStatus } = useAuth();
  const [savedProperties, setSavedProperties] = useState<SavedProperty[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<{ full_name: string; email: string } | null>(null);
  const { submissions } = useUserSubmissions();

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        // Fetch profile
        const { data: profileData } = await supabase
          .from("profiles")
          .select("full_name, email")
          .eq("user_id", user.id)
          .single();

        if (profileData) {
          setProfile(profileData);
        }

        // Fetch saved properties
        const { data: savedData } = await supabase
          .from("saved_properties")
          .select(`
            created_at,
            property:properties(*)
          `)
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (savedData) {
          const saved = savedData
            .filter((item) => item.property)
            .map((item) => ({
              ...(item.property as Property),
              saved_at: item.created_at,
            }));
          setSavedProperties(saved);
        }

        // Fetch reservations
        const { data: reservationData } = await supabase
          .from("property_reservations")
          .select(`
            id,
            property_id,
            status,
            deposit_amount,
            created_at,
            property:properties(*)
          `)
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
        pageIcon={<LayoutDashboard className="h-5 w-5 text-primary" />}
      >
        <div className="min-h-[80vh] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout
      pageTitle={`Welcome back, ${profile?.full_name?.split(" ")[0] || "Investor"}`}
      pageSubtitle="Manage your property investments"
      pageIcon={<LayoutDashboard className="h-5 w-5 text-primary" />}
      headerActions={
        <Badge variant={investorStatus === "approved" ? "default" : "secondary"} className="gap-1">
          {investorStatus === "approved" ? (
            <CheckCircle className="h-3 w-3" />
          ) : (
            <Clock className="h-3 w-3" />
          )}
          {investorStatus === "approved" ? "Approved Investor" : "Pending Approval"}
        </Badge>
      }
    >
      <div className="p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Saved Properties</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{savedProperties.length}</div>
              <p className="text-xs text-muted-foreground">Properties in your watchlist</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">My Listings</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{submissions.length}</div>
              <p className="text-xs text-muted-foreground">Properties you've submitted</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Reservations</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {reservations.filter((r) => r.status === "pending").length}
              </div>
              <p className="text-xs text-muted-foreground">Properties reserved for you</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Deals</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {reservations.filter((r) => r.status === "completed").length}
              </div>
              <p className="text-xs text-muted-foreground">Successfully acquired</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="saved" className="space-y-6">
          <TabsList>
            <TabsTrigger value="saved" className="gap-2">
              <Heart className="h-4 w-4" />
              Saved Properties
            </TabsTrigger>
            <TabsTrigger value="listings" className="gap-2">
              <Building2 className="h-4 w-4" />
              My Listings
            </TabsTrigger>
            <TabsTrigger value="reservations" className="gap-2">
              <Clock className="h-4 w-4" />
              Reservations
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="saved" className="space-y-6">
            {savedProperties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedProperties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Heart className="h-12 w-12 text-muted-foreground mb-4" />
                  <CardTitle className="text-xl mb-2">No saved properties yet</CardTitle>
                  <CardDescription className="text-center mb-4">
                    Browse our property listings and save your favorites
                  </CardDescription>
                  <Button asChild>
                    <Link to="/properties">
                      <Home className="mr-2 h-4 w-4" />
                      Browse Properties
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="listings" className="space-y-6">
            <MyListingsTab />
          </TabsContent>

          <TabsContent value="reservations" className="space-y-6">
            {reservations.length > 0 ? (
              <div className="space-y-4">
                {reservations.map((reservation) => (
                  <Card key={reservation.id}>
                    <CardContent className="flex flex-col md:flex-row items-start md:items-center gap-4 p-4">
                      <div className="flex-shrink-0">
                        <img
                          src={reservation.property.photo_urls?.[0] || "/placeholder.svg"}
                          alt={reservation.property.title}
                          className="w-24 h-24 object-cover rounded-lg"
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
                          {reservation.property.property_address}, {reservation.property.property_city}
                        </p>
                        <p className="text-lg font-bold text-primary">
                          £{reservation.property.asking_price.toLocaleString()}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge
                          variant={
                            reservation.status === "completed"
                              ? "default"
                              : reservation.status === "pending"
                              ? "secondary"
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
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Clock className="h-12 w-12 text-muted-foreground mb-4" />
                  <CardTitle className="text-xl mb-2">No reservations yet</CardTitle>
                  <CardDescription className="text-center mb-4">
                    Reserve a property to start your investment journey
                  </CardDescription>
                  <Button asChild>
                    <Link to="/properties">
                      <Home className="mr-2 h-4 w-4" />
                      Browse Properties
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
                <CardDescription>Manage your account details and preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                    <p className="text-foreground">{profile?.full_name || "Not set"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Email</label>
                    <p className="text-foreground">{profile?.email || user?.email}</p>
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <Button variant="outline" disabled>
                    Edit Profile (Coming Soon)
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
