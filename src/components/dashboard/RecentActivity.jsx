import ActivityItem from "./ActivityItem";

const RecentActivity = ({ activities = [] }) => {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100">
      <h4 className="text-lg font-bold text-gray-900 mb-6" style={{ fontFamily: 'Manrope, sans-serif' }}>
        Recent Activity
      </h4>

      <div className="space-y-6">
        {activities.map((activity, index) => (
          <ActivityItem key={index} {...activity} />
        ))}
      </div>

      <button className="w-full mt-8 py-3 border border-gray-200 text-gray-500 text-xs font-bold rounded-lg hover:bg-gray-50 transition-colors">
        View All Activity
      </button>
    </div>
  );
};

export default RecentActivity;