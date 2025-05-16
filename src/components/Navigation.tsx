"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/src/contexts/AuthContext";
import { useAuthActions } from "@/src/hooks/useAuthActions";
import { usePathname } from 'next/navigation';
import { 
  FaChartLine, 
  FaWallet, 
  FaPiggyBank, 
  FaBell, 
  FaMoneyBillWave,
  FaSignOutAlt,
  FaUserCircle
} from 'react-icons/fa';

export default function Navigation() {
  const { user } = useAuth();
  const { logout } = useAuthActions();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const navLinks = user ? [
    { href: '/dashboard', label: 'Dashboard', icon: FaChartLine },
    { href: '/expenses', label: 'Quản lý chi tiêu', icon: FaWallet },
    { href: '/budgets', label: 'Ngân sách', icon: FaPiggyBank },
    { href: '/reminders', label: 'Nhắc nhở', icon: FaBell },
    { href: '/incomes', label: 'Thu nhập', icon: FaMoneyBillWave },
  ] : [
    { href: '/login', label: 'Đăng nhập', icon: FaUserCircle },
    { href: '/register', label: 'Đăng ký', icon: FaUserCircle },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] bg-white backdrop-blur-sm transition-all duration-300 ${
      isScrolled ? 'shadow-lg' : ''
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <FaWallet className="text-white text-xl" />
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
                Expense Tracker
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    pathname === link.href
                      ? 'text-indigo-600 bg-indigo-50'
                      : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {link.label}
                </Link>
              );
            })}
            {user && (
              <button
                onClick={logout}
                className="flex items-center px-4 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-all duration-200"
              >
                <FaSignOutAlt className="w-4 h-4 mr-2" />
                Đăng xuất
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="h-6 w-6"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`md:hidden ${isOpen ? 'block' : 'hidden'}`}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
                    pathname === link.href
                      ? 'text-indigo-600 bg-indigo-50'
                      : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {link.label}
                </Link>
              );
            })}
            {user && (
              <button
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
                className="flex items-center w-full px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50"
              >
                <FaSignOutAlt className="w-5 h-5 mr-3" />
                Đăng xuất
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
