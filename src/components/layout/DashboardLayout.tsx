// src/components/layout/DashboardLayout.tsx
import Sidebar from "./Sidebar";
import type { NavItem } from "./Sidebar";
interface Props {
  role: string;
  nom: string;
  prenom: string;
  navItems: NavItem[];
  children: React.ReactNode;
  subTitle?: string;
}

export default function DashboardLayout({
  role,
  nom,
  prenom,
  navItems,
  children,
  subTitle,
}: Props) {
  return (
    <div className="admin-layout">
      <Sidebar role={role} nom={nom} prenom={prenom} navItems={navItems} subTitle={subTitle} />
      <main className="admin-main">{children}</main>
    </div>
  );
}
