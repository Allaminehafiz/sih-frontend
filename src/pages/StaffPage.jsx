import { useState, useEffect, useCallback } from "react";
import StaffHeader from "../components/staff/StaffHeader";
import QuickFilters from "../components/staff/QuickFilters";
import ShiftsCard from "../components/staff/ShiftsCard";
import FeaturedStaffCard from "../components/staff/FeaturedStaffCard";
import StaffCard from "../components/staff/StaffCard";
import StaffFooter from "../components/staff/StaffFooter";
import StaffForm from "../components/staff/StaffForm";
import StaffEditForm from "../components/staff/StaffEditForm";
import ConfirmDialog from "../components/common/ConfirmDialog";
import staffService from "../services/staffService";

const featuredStaff = {
  name: "Dr. Elena Rodriguez",
  role: "Head of Surgery",
  status: "ON DUTY",
  email: "e.rodriguez@sanctuary.med",
  phone: "+1 (555) 0122-34",
  activePatients: 24,
  experience: "12y",
  avatar: "https://ui-avatars.com/api/?name=Elena+Rodriguez&background=005e53&color=fff&size=256",
};

// Seul l'ADMIN peut gérer le personnel
const canManageStaff = (role) => role === "ADMIN";

const StaffPage = ({ user }) => {
  const [activeFilter, setActiveFilter] = useState("medical");
  const [showStaffForm, setShowStaffForm] = useState(false);
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editStaff, setEditStaff] = useState(null);
  const [deleteStaff, setDeleteStaff] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadStaff = useCallback(async () => {
    setLoading(true);
    try {
      const response = await staffService.getAllUtilisateurs();
      const formatted = response.data.map((u) => ({
        id: u.id,
        displayId: `#SR-${u.id}00`,
        name: u.nom,
        role: u.specialite || u.role,
        isActive: u.actif,
        status: u.actif ? "ACTIVE" : "OFF DUTY",
        statusColor: u.actif ? "text-teal-600" : "text-red-600",
        infoLabel: "Department",
        infoValue: u.departement || "N/A",
        actionLabel: u.actif ? "Contact Now" : "Profile Detail",
        borderColor: u.actif ? "primary" : "secondary",
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(u.nom)}&background=005e53&color=fff&size=128`,
        nom: u.nom,
        email: u.email,
        telephone: u.telephone || "",
        role: u.role,
        departement: u.departement || "",
        specialite: u.specialite || "",
        actif: u.actif,
      }));
      setStaffList(formatted);
    } catch (error) {
      console.error("Erreur staff :", error);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadStaff();
  }, [loadStaff]);

  const handleDeleteStaff = async () => {
    if (!deleteStaff) return;
    setDeleting(true);
    try {
      await staffService.deleteUtilisateur(deleteStaff.id);
      setDeleteStaff(null);
      loadStaff();
    } catch (error) {
      console.error("Erreur suppression :", error);
    }
    setDeleting(false);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <StaffHeader onOnboardClick={canManageStaff(user?.role) ? () => setShowStaffForm(true) : null} />
        <p className="text-center text-gray-400 mt-12">Loading staff directory...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <StaffHeader onOnboardClick={canManageStaff(user?.role) ? () => setShowStaffForm(true) : null} />

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-3 space-y-8">
          <QuickFilters selected={activeFilter} onSelect={setActiveFilter} />
          <ShiftsCard onViewRota={() => console.log("View rota")} />
        </div>

        <div className="col-span-12 lg:col-span-9">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FeaturedStaffCard staff={featuredStaff} />
            {staffList.map((staff, index) => (
              <StaffCard
                key={index}
                staff={staff}
                onAction={(s) => console.log("Action sur", s.name)}
                onEdit={canManageStaff(user?.role) ? (s) => setEditStaff(s) : null}
                onDelete={canManageStaff(user?.role) ? (s) => setDeleteStaff(s) : null}
              />
            ))}
          </div>
        </div>
      </div>

      <StaffFooter />

      {showStaffForm && canManageStaff(user?.role) && (
        <StaffForm
          onSubmit={() => {
            
            
          }}
          onCancel={() => {
            setShowStaffForm(false);
          loadStaff();
          }}
        />
      )}

      {editStaff && canManageStaff(user?.role) && (
        <StaffEditForm
          staff={editStaff}
          onSubmit={() => {
            setEditStaff(null);
            loadStaff();
          }}
          onCancel={() => setEditStaff(null)}
        />
      )}

      {deleteStaff && canManageStaff(user?.role) && (
        <ConfirmDialog
          title="Delete Staff"
          message={`Are you sure you want to delete ${deleteStaff.name}? This action cannot be undone.`}
          onConfirm={handleDeleteStaff}
          onCancel={() => setDeleteStaff(null)}
          loading={deleting}
        />
      )}
    </div>
  );
};

export default StaffPage;