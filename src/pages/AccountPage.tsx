const sections = [
  { icon: "👤", label: "Account Settings", link: "#" },
  { icon: "📦", label: "Subscriptions", link: "#" },
  { icon: "🧾", label: "Order History", link: "#" },
  { icon: "⚙️", label: "Preferences", link: "#" },
  { icon: "📨", label: "Contact Us", link: "#" },
  { icon: "🔒", label: "Security", link: "#" },
  { icon: "📬", label: "Address Book", link: "#" },
  { icon: "💳", label: "Payment Methods", link: "#" },
];

export default function AccountPage() {
  return (
    <div className="p-6 bg-[#f8f8f5] min-h-screen">
      <h2 className="text-2xl font-bold mb-6">My Account</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {sections.map(({ icon, label, link }) => (
          <a
            key={label}
            href={link}
            className="bg-white rounded-lg shadow hover:shadow-md transition-all duration-200 flex flex-col justify-center items-center p-6 text-center"
          >
            <div className="text-3xl mb-2">{icon}</div>
            <span className="text-sm font-medium text-gray-800">{label}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
