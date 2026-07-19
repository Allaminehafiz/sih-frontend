import Icon from "../common/Icon";

const FeaturedStaffCard = ({ staff }) => {
  return (
    <div className="md:col-span-2 bg-white rounded-xl p-8 flex flex-col md:flex-row gap-8 items-center shadow-sm relative overflow-hidden group">
      {/* Cercle décoratif */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-teal-600/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700"></div>

      {/* Photo */}
      <img
        className="w-32 h-32 md:w-40 md:h-40 rounded-xl object-cover shadow-lg relative z-10"
        src={staff.avatar}
        alt={staff.name}
      />

      {/* Infos */}
      <div className="flex-1 space-y-4 relative z-10 text-center md:text-left">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-block px-3 py-1 bg-teal-100 text-teal-800 text-[10px] font-bold uppercase tracking-widest rounded-full mb-2">
              {staff.role}
            </div>
            <h4
              className="text-2xl font-extrabold text-gray-900"
              style={{ fontFamily: 'Manrope, sans-serif' }}
            >
              {staff.name}
            </h4>
          </div>
          <div className="flex items-center gap-2 justify-center md:justify-end">
            <span className="w-2 h-2 bg-teal-600 rounded-full animate-pulse"></span>
            <span className="text-xs font-semibold text-teal-700">{staff.status}</span>
          </div>
        </div>

        {/* Contact */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2 text-gray-500">
            <Icon name="mail" size={18} color="#005e53" />
            {staff.email}
          </div>
          <div className="flex items-center gap-2 text-gray-500">
            <Icon name="call" size={18} color="#005e53" />
            {staff.phone}
          </div>
        </div>

        {/* Stats */}
        <div className="pt-4 flex gap-4 justify-center md:justify-start">
          <div className="text-center bg-gray-100 px-4 py-2 rounded-lg">
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tight">
              Active Patients
            </p>
            <p
              className="text-xl font-bold text-teal-700"
              style={{ fontFamily: 'Manrope, sans-serif' }}
            >
              {staff.activePatients}
            </p>
          </div>
          <div className="text-center bg-gray-100 px-4 py-2 rounded-lg">
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tight">
              Experience
            </p>
            <p
              className="text-xl font-bold text-teal-700"
              style={{ fontFamily: 'Manrope, sans-serif' }}
            >
              {staff.experience}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedStaffCard;