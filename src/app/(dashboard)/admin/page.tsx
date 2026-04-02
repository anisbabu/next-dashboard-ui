import UserCard from "@/components/UserCard";

const AdminPage = () => {
  return (
    <div className="p-4 flex gap-4 flex-col md:flex-row">
      {/* LEFT */}
      <div className="w-full lg:w-2/3">
        {/* USER CARDS */}
        <div className="flex gap-4 justify-between flex-wrap">
          <UserCard type="student" />
          <UserCard type="teacher" />
          <UserCard type="parent" />
          <UserCard type="staff" />
        </div>
      </div>

      {/* RIGHT */}
      <div className="w-full lg:w-1/3 bg-gray-50 p-4 rounded">
        {/* Placeholder for right-side content */} 
        <h2 className="text-lg font-semibold mb-2">Right Section</h2>
        <p>Add widgets, notifications, or quick stats here.</p>
      </div>
    </div>
  );
};

export default AdminPage;
 