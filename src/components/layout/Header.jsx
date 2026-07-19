import Icon from "../common/Icon";
import Avatar from "../common/Avatar";
import SearchInput from "../common/SearchInput";
import { useState } from "react";
import ChangePasswordModal from "../auth/ChangePasswordModal";

const Header = ({ pageTitle = "Sanctuary Health", user }) => {
  const userName = user?.name || "Dr. Sterling";
  return (
    <header className="flex justify-between items-center px-8 h-16 w-full sticky top-0 bg-white/90 backdrop-blur-sm z-40 border-b border-gray-100">
      <div className="flex items-center gap-4">
        <h2 className="font-semibold tracking-tight text-teal-700 text-lg" style={{ fontFamily: 'Manrope, sans-serif' }}>
          {pageTitle}
        </h2>
      </div>
      <div className="flex items-center gap-6">
        <SearchInput placeholder="Rechercher un patient ou un dossier..." />
        <div className="flex items-center gap-2">
          <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
            <Icon name="notifications" size={22} />
          </button>
          <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
            <Icon name="settings" size={22} />
          </button>
          <Avatar
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=005e53&color=fff&size=128`}
            alt={userName}
            size="sm"
            className="ml-2 ring-2 ring-teal-100"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;