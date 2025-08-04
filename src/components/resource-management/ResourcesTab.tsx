import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  Filter,
  Plus,
  Eye,
  Edit2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState, useEffect } from "react";
// Removed AddEditResourceModal usage
import { createResource, getResources } from "@/lib/api";
import { useNavigate, useLocation } from "react-router-dom";
export const ResourcesTab = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  // Removed edit modal state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchResources = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token") || "";
        const params: any = {
          search: searchTerm,
          department: filterDepartment !== "all" ? filterDepartment : undefined,
          status: filterStatus !== "all" ? filterStatus : undefined,
          page: currentPage,
          pageSize: itemsPerPage,
        };
        const result = await getResources(token, params);
        // Exclude interns from the main resource list
        const allResources = (result as any).resources || [];
        setResources(allResources.filter((r: any) => !r.is_intern));
      } catch (err: any) {
        setError(err?.message || "Failed to fetch resources");
      } finally {
        setLoading(false);
      }
    };
    // Refetch if redirected with refresh state
    if (location.state && location.state.refresh) {
      fetchResources();
      // Clear refresh state so it doesn't refetch again
      navigate(location.pathname, { replace: true, state: {} });
    } else {
      fetchResources();
    }
  }, [searchTerm, filterDepartment, filterStatus, currentPage, location.state]);

  // Remove duplicate resource fetch effect

  // Pagination logic (from backend)
  const totalPages = Math.ceil(resources.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedResources = resources;

  const handleAddResource = () => {
    setIsAddModalOpen(true);
  };

  const handleEditResource = (resource: any) => {
    navigate("/add-resource", { state: { resource, mode: "edit" } });
  };

  const handleViewResource = (resource: any) => {
    navigate(
      `/resource-details/${
        resource.resourceId || resource.id || resource.employeeId
      }`
    );
  };

  // Removed handleSaveResource (modal logic)

  const formatCurrency = (amount: number) =>
    `$${amount?.toLocaleString() || "0"}`;

  return (
    <div className="space-y-6">
      <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
          <div>
            <CardTitle className="text-xl font-semibold text-gray-900">
              Master Resource Directory
            </CardTitle>
            <p className="text-gray-600 text-sm mt-1">
              Comprehensive resource records and management
            </p>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50/50 rounded-xl border border-gray-200">
            {/* ... filter controls remain unchanged */}
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div
              className="max-h-[600px] overflow-y-auto overflow-x-auto scrollbar scrollbar-thumb-gray-400 scrollbar-track-gray-100"
              style={{
                minWidth: "100%",
                overflowX: "auto",
                WebkitOverflowScrolling: "touch",
              }}
            >
              <Table className="min-w-[1000px]">
                <TableHeader className="bg-gray-50 sticky top-0 z-10">
                  <TableRow>
                    <TableHead className="text-left w-[120px]">
                      Employee ID
                    </TableHead>
                    <TableHead className="text-left w-[160px]">Name</TableHead>
                    <TableHead className="text-left w-[160px]">
                      Designation
                    </TableHead>
                    <TableHead className="text-left w-[160px]">
                      Department
                    </TableHead>
                    <TableHead className="text-left w-[180px]">
                      Primary Skills
                    </TableHead>
                    <TableHead className="text-left w-[180px]">
                      Secondary Skills
                    </TableHead>
                    <TableHead className="text-left w-[140px]">
                      Status
                    </TableHead>
                    <TableHead className="text-left w-[140px]">
                      Monthly Cost
                    </TableHead>
                    <TableHead className="text-center w-[160px]">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell
                        colSpan={9}
                        className="text-center text-gray-500"
                      >
                        Loading resources...
                      </TableCell>
                    </TableRow>
                  ) : error ? (
                    <TableRow>
                      <TableCell
                        colSpan={9}
                        className="text-center text-red-500"
                      >
                        {error}
                      </TableCell>
                    </TableRow>
                  ) : paginatedResources.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={9}
                        className="text-center text-gray-500"
                      >
                        No resources found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedResources.map((resource) => (
                      <TableRow
                        key={resource.resourceId}
                        className="hover:bg-blue-50/50 transition-colors duration-200"
                      >
                        <TableCell className="text-left font-medium text-blue-600">
                          {resource.employeeId}
                        </TableCell>
                        <TableCell className="text-left">
                          <div className="font-medium text-gray-900">
                            {resource.fullName}
                          </div>
                        </TableCell>
                        <TableCell className="text-left text-gray-700">
                          {resource.designation}
                        </TableCell>
                        <TableCell className="text-left text-gray-700">
                          {resource.department}
                        </TableCell>
                        <TableCell className="text-left">
                          <Badge variant="outline" className="text-xs">
                            {/* Primary Skills formatting logic */}
                            {(() => {
                              let skills = resource.skills;
                              const cleanSkill = (s: string) =>
                                s.replace(/[{}\[\]"\\]+/g, "").trim();
                              if (Array.isArray(skills)) {
                                const cleaned = skills
                                  .map((s) => cleanSkill(s))
                                  .filter((s) => !!s);
                                return cleaned.length
                                  ? cleaned.join(", ")
                                  : "—";
                              }
                              if (typeof skills === "string") {
                                skills = skills
                                  .replace(/[{}\[\]"\\]+/g, "")
                                  .split(",")
                                  .map((s) => cleanSkill(s))
                                  .filter((s) => !!s);
                                return skills.length ? skills.join(", ") : "—";
                              }
                              return "—";
                            })()}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-left">
                          <Badge variant="outline" className="text-xs">
                            {/* Secondary Skills formatting logic */}
                            {(() => {
                              let primarySkills = resource.primarySkills;
                              const cleanSkill = (s: string) =>
                                s.replace(/[{}\[\]"\\]+/g, "").trim();
                              if (Array.isArray(primarySkills)) {
                                const cleaned = primarySkills
                                  .map((s) => cleanSkill(s))
                                  .filter((s) => !!s);
                                return cleaned.length
                                  ? cleaned.join(", ")
                                  : "—";
                              }
                              if (typeof primarySkills === "string") {
                                primarySkills = primarySkills
                                  .replace(/[{}\[\]"\\]+/g, "")
                                  .split(",")
                                  .map((s) => cleanSkill(s))
                                  .filter((s) => !!s);
                                return primarySkills.length
                                  ? primarySkills.join(", ")
                                  : "—";
                              }
                              return "—";
                            })()}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              resource.billableStatus ? "default" : "secondary"
                            }
                            className={
                              resource.billableStatus
                                ? "bg-green-100 text-green-800 hover:bg-green-200"
                                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                            }
                          >
                            {resource.billableStatus
                              ? "Billable"
                              : "Non-Billable"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-left font-medium text-gray-900">
                          {(() => {
                            const salaryRaw =
                              resource.monthlySalaryCost ??
                              resource.monthly_cost ??
                              resource.monthlyCost;
                            const salary = Number(salaryRaw);
                            return formatCurrency(
                              isNaN(salary) || !salaryRaw ? 0 : salary
                            );
                          })()}
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex justify-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleViewResource(resource)}
                              className="hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition-all duration-200"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="default"
                              onClick={() => handleEditResource(resource)}
                              className="hover:bg-green-50 hover:border-green-300 hover:text-green-600 transition-all duration-200"
                            >
                              <Edit2 className="h-4 w-4" /> Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={async () => {
                                if (
                                  !window.confirm(
                                    "Are you sure you want to delete this resource permanently?"
                                  )
                                )
                                  return;
                                setLoading(true);
                                setError(null);
                                try {
                                  const token =
                                    localStorage.getItem("token") || "";
                                  const id =
                                    resource.resourceId ??
                                    resource.id ??
                                    resource.employeeId;
                                  await import("@/lib/api").then((api) =>
                                    api.deleteResource(token, id)
                                  );
                                  const params: any = {
                                    search: searchTerm,
                                    department:
                                      filterDepartment !== "all"
                                        ? filterDepartment
                                        : undefined,
                                    status:
                                      filterStatus !== "all"
                                        ? filterStatus
                                        : undefined,
                                    page: currentPage,
                                    pageSize: itemsPerPage,
                                  };
                                  const result = await getResources(
                                    token,
                                    params
                                  );
                                  setResources((result as any).resources || []);
                                } catch (err: any) {
                                  setError(
                                    err?.message || "Failed to delete resource"
                                  );
                                } finally {
                                  setLoading(false);
                                }
                              }}
                              className="hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-all duration-200"
                            >
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6 p-4 bg-gray-50/50 rounded-xl">
            <div className="text-sm text-gray-600">
              Showing {startIndex + 1}-
              {Math.min(startIndex + itemsPerPage, paginatedResources.length)}{" "}
              of {paginatedResources.length} resources
            </div>
            <div className="flex items-center gap-2">
              {/* Previous, page numbers, and next buttons */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-1"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className={
                        currentPage === page
                          ? "bg-blue-500 hover:bg-blue-600"
                          : ""
                      }
                    >
                      {page}
                    </Button>
                  );
                })}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="flex items-center gap-1"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResourcesTab;
