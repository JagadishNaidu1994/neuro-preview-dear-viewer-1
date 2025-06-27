import Header from "@/components/Header";
import {
  FaUser,
  FaBox,
  FaHistory,
  FaCogs,
  FaEnvelope,
  FaLock,
  FaAddressBook,
  FaCreditCard,
} from "react-icons/fa";

const items = [
  { icon: <FaUser size={24} />, label: "Account Settings" },
  { icon: <FaBox size={24} />, label: "Subscriptions" },
  { icon: <FaHistory size={24} />, label: "Order History" },
  { icon: <FaCogs size={24} />, label: "Preferences" },
  { icon: <FaEnvelope size={24} />, label: "Contact Us" },
  { icon: <FaLock size={24} />, label: "Security" },
  { icon: <FaAddressBook size={24} />, label: "Address Book" },
  { icon: <FaCreditCard size={24} />, label: "Payment Methods" },
];

const AccountPage = () => {
  return (
    <>
      <Header />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6 text-[#161616]">My Account</h1>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-4 p-4 bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="text-[#514B3D]">{item.icon}</div>
              <span className="text-sm text-[#161616] font-medium">
                {item.label}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-8">
          <button className="px-4 py-2 bg-[#514B3D] text-white rounded-lg hover:bg-[#3f3a2f]">
            Log Out
          </button>
        </div>
      </div>
    </>
  );
};

export default AccountPage;
