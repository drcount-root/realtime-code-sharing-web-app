import React from "react";
import Link from "next/link";

const Navbar = () => {
  return (
    <header className="bg-sky-950 flex justify-between items-center px-4 py-2 sticky top-0">
      <Link href="/" className="text-lg font-bold text-white">
        CodeShare
      </Link>
    </header>
  );
};

export default Navbar;
