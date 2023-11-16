'use client';
import Link from 'next/link';
// import { signIn, signOut, useSession } from "next-auth/react";
import { usePathname } from 'next/navigation';

const ACTIVE_ROUTE = 'py-1 px-2 text-gray-300 bg-gray-700';
const INACTIVE_ROUTE =
  'py-1 px-2 text-gray-500 hover:text-gray-300 hover:bg-gray-700';

export default function NavMenu() {
  const pathname = usePathname();
  return (
    <div>
      <hr className="my-4" />
      <ul>
        <Link href="/">
          <li className={pathname === '/' ? ACTIVE_ROUTE : INACTIVE_ROUTE}>
            Home
          </li>
        </Link>
        <Link href="/protected">
          <li
            className={
              pathname === '/protected' ? ACTIVE_ROUTE : INACTIVE_ROUTE
            }
          >
            Protected Route
          </li>
        </Link>
      </ul>
    </div>
  );
}
