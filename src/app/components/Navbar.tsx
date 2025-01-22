// src/app/components/Navbar.tsx

"use client";
import Link from "next/link";
import { FaStar, FaList} from "react-icons/fa";

export default function Navbar() {
  return (
    <nav className="bg-green-500 p-4 flex justify-between items-center">
      <div className="text-white text-xl font-bold">Todo Tasks</div>
      <div className="flex gap-4">
        <Link href="/starred" className="text-white flex items-center gap-2">
          <FaStar /> Starred
        </Link>
        <Link href="/" className="text-white flex items-center gap-2">
          <FaList /> My Lists
        </Link>
      </div>
    </nav>
  );
}
