import { Layout } from "@/components/layout/Layout";
import { SellerForm } from "@/components/seller/SellerForm";
import { Building2 } from "lucide-react";

const SubmitProperty = () => {
  return (
    <Layout>
      <div className="bg-background-secondary border-b border-border">
        <div className="container py-12 md:py-16">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center">
              <Building2 className="h-7 w-7 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground md:text-4xl">
                Submit Your Property
              </h1>
              <p className="text-muted-foreground mt-1">
                Connect with verified investors ready to buy
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-12">
        <SellerForm />
      </div>
    </Layout>
  );
};

export default SubmitProperty;
