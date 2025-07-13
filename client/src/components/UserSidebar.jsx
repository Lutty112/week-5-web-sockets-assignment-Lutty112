
export default function UserSidebar({ users }) {
  return (
    <aside className="w-60 bg-gray-200 shadow-md p-4 border-r">
      <h2 className="font-semibold mb-2">Online Users</h2>
      <ul className="space-y-1">
        {users.map((user) => (
          <li key={user._id} className="text-sm font-semibold text-pink-600">
            🟢 {user.username}
          </li>
        ))}
      </ul>
    </aside>
  );
}
