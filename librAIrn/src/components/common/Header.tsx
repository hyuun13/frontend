// src/components/common/Header.tsx
import { FC } from "react";
import { Link } from "react-router-dom";

const Header: FC = () => (
  <header className="flex items-center justify-between p-4 bg-white text-primary">
    <h1 className="text-2xl font-bold">
      <Link to="/">LibrAIry</Link>
    </h1>
    <nav></nav>
  </header>
);

export default Header;
