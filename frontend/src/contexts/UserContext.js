// src/contexts/UserContext.js
"use client";

import { createContext, useState, useContext } from "react";

// Tạo Context
const UserContext = createContext(null);

// Tạo Provider component
export function UserProvider({ children }) {
  const [user, setUser] = useState(null); // State để lưu thông tin user, ban đầu là null

  // Hàm để cập nhật một phần của user state, ví dụ như chỉ cập nhật balance
  const updateUser = (newUserData) => {
    setUser((prevUser) => ({
      ...prevUser,
      ...newUserData,
    }));
  };

  return (
    <UserContext.Provider value={{ user, setUser, updateUser }}>
      {children}
    </UserContext.Provider>
  );
}

// Tạo custom hook để dễ dàng sử dụng context
export function useUser() {
  return useContext(UserContext);
}
