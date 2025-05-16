"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/src/contexts/AuthContext";
import { useAuthActions } from "@/src/hooks/useAuthActions";

export default function Navigation() {
  const { user } = useAuth();
  const { logout } = useAuthActions();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="font-semibold text-gray-500 text-lg">
                Expense Tracker
              </span>
            </Link>
          </div>

          {/* Hamburger Menu (Mobile) */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-500 focus:outline-none"
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}
                />
              </svg>
            </button>
          </div>

          {/* Navigation Links (Desktop) */}
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="py-2 px-2 font-medium text-gray-500 rounded hover:bg-indigo-500 hover:text-white transition duration-300"
                >
                  Dashboard
                </Link>
                <Link
                  href="/expenses"
                  className="py-2 px-2 font-medium text-gray-500 rounded hover:bg-indigo-500 hover:text-white transition duration-300"
                >
                  Quản lý chi tiêu
                </Link>
                <Link
                  href="/budgets"
                  className="py-2 px-2 font-medium text-gray-500 rounded hover:bg-indigo-500 hover:text-white transition duration-300"
                >
                  Ngân sách
                </Link>
                <Link
                  href="/reminders"
                  className="py-2 px-2 font-medium text-gray-500 rounded hover:bg-indigo-500 hover:text-white transition duration-300"
                >
                  Nhắc nhở
                </Link>
                <Link
                  href="/incomes"
                  className="py-2 px-2 font-medium text-gray-500 rounded hover:bg-green-500 hover:text-white transition duration-300"
                >
                  Thu nhập
                </Link>
                <button
                  onClick={logout}
                  className="py-2 px-2 font-medium text-gray-500 rounded hover:bg-red-500 hover:text-white transition duration-300"
                >
                  Đăng xuất
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="py-2 px-2 font-medium text-gray-500 rounded hover:bg-indigo-500 hover:text-white transition duration-300"
                >
                  Đăng nhập
                </Link>
                <Link
                  href="/register"
                  className="py-2 px-2 font-medium text-gray-500 rounded hover:bg-indigo-500 hover:text-white transition duration-300"
                >
                  Đăng ký
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu (shown when isOpen is true) */}
        <div className={`md:hidden ${isOpen ? "block" : "hidden"} pb-4`}>
          <div className="flex flex-col space-y-2">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="py-2 px-2 font-medium text-gray-500 rounded hover:bg-indigo-500 hover:text-white transition duration-300"
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  href="/expenses"
                  className="py-2 px-2 font-medium text-gray-500 rounded hover:bg-indigo-500 hover:text-white transition duration-300"
                  onClick={() => setIsOpen(false)}
                >
                  Quản lý chi tiêu
                </Link>
                <Link
                  href="/budgets"
                  className="py-2 px-2 font-medium text-gray-500 rounded hover:bg-indigo-500 hover:text-white transition duration-300"
                  onClick={() => setIsOpen(false)}
                >
                  Ngân sách
                </Link>
                <Link
                  href="/reminders"
                  className="py-2 px-2 font-medium text-gray-500 rounded hover:bg-indigo-500 hover:text-white transition duration-300"
                  onClick={() => setIsOpen(false)}
                >
                  Nhắc nhở
                </Link>
                <Link
                  href="/incomes"
                  className="py-2 px-2 font-medium text-gray-500 rounded hover:bg-green-500 hover:text-white transition duration-300"
                  onClick={() => setIsOpen(false)}
                >
                  Thu nhập
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                  className="py-2 px-2 font-medium text-gray-500 rounded hover:bg-red-500 hover:text-white transition duration-300 text-left"
                >
                  Đăng xuất
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="py-2 px-2 font-medium text-gray-500 rounded hover:bg-indigo-500 hover:text-white transition duration-300"
                  onClick={() => setIsOpen(false)}
                >
                  Đăng nhập
                </Link>
                <Link
                  href="/register"
                  className="py-2 px-2 font-medium text-gray-500 rounded hover:bg-indigo-500 hover:text-white transition duration-300"
                  onClick={() => setIsOpen(false)}
                >
                  Đăng ký
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
