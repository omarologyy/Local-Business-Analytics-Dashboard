import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import BasicTableOne from "../../components/tables/BasicTables/BasicTableOne";

export default function BasicTables() {
  return (
    <>
      <PageMeta
        title="UmarNova"
        description="A business dashboard that aggregates sales, customer retention, and market trends."
      />
      <PageBreadcrumb pageTitle="Customer records" />
      <div className="space-y-6">
        <ComponentCard title="Records">
          <BasicTableOne />
        </ComponentCard>
      </div>
    </>
  );
}
