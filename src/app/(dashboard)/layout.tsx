import Menu from "@/components/Menu";
import Navbar from "@/components/navbar";
import Link from "next/link";

export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex h-screen">
            <div className="w-[14%] md:w-[8%] lg:w-[16%] xl:w-[16%] p-4">
                <Link
                    href="/"
                    className="flex items-center justify-center lg:justify-start gap-2"
                >
                    <img src="/logo.png" alt="Logo" width={32} height={32} />
                    <span className="hidden lg:block">School Bro</span>
                </Link>
                <Menu />
            </div>
            <div className="w-[86%] md:w-[92%] lg:w-[84%] xl:w-[86%] p-4">
                <Navbar />
                {children}
            </div>
        </div>
    );
}