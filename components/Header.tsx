'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Shield, Home } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');
  const [logoError, setLogoError] = useState(false);

  return (
    <header className="gradient-bg shadow-lg sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-12 h-12 rounded-full bg-white p-0.5 shadow-md flex-shrink-0 overflow-hidden flex items-center justify-center">
            {!logoError ? (
              <Image
                src="/logo.png"
                alt="โรงเรียนเซกา"
                width={48}
                height={48}
                className="w-full h-full object-contain rounded-full"
                onError={() => setLogoError(true)}
              />
            ) : (
              <span className="text-blue-700 font-bold text-lg">ซ</span>
            )}
          </div>
          <div>
            <p className="text-white font-bold text-base leading-tight">โรงเรียนเซกา</p>
            <p className="text-blue-200 text-xs">จังหวัดบึงกาฬ</p>
          </div>
        </Link>

        <nav className="flex items-center gap-2">
          <Link
            href="/"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              !isAdmin
                ? 'bg-white/20 text-white'
                : 'text-blue-200 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Home size={15} />
            <span className="hidden sm:inline">แจ้งปัญหา</span>
          </Link>
          <Link
            href="/admin"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              isAdmin
                ? 'bg-white/20 text-white'
                : 'text-blue-200 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Shield size={15} />
            <span className="hidden sm:inline">ผู้ดูแลระบบ</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
