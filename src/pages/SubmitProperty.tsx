import { AppLayout } from "@/components/layout/AppLayout";
import { SellerForm } from "@/components/seller/SellerForm";
import { Building2 } from "lucide-react";

const SubmitProperty = () => {
  return (
    <AppLayout
      pageTitle="Submit Your Property"
      pageSubtitle="Connect with verified investors ready to buy"
      pageIcon={<Building2 className="h-5 w-5 text-primary" />}
    >
      <div className="p-6">
        <SellerForm />
      </div>
    </AppLayout>
  );
};

export default SubmitProperty;
