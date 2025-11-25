'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const userRole = (session.user as any)?.role;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-600">AlcoLens</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-700">
                Welcome, <strong>{session.user?.name}</strong>
              </span>
              <button
                onClick={() => signOut({ redirect: true, callbackUrl: '/login' })}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Dashboard</h2>

            {userRole === 'doctor' ? (
              <div className="space-y-4">
                <p className="text-gray-600">Welcome to your Doctor Dashboard</p>
                <Link
                  href="/doctor/dashboard"
                  className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Go to Doctor Dashboard
                </Link>
              </div>
            ) : userRole === 'patient' ? (
              <div className="space-y-4">
                <p className="text-gray-600">Welcome to your Patient Dashboard</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Link
                    href="/patient/check_in"
                    className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Check In
                  </Link>
                  <Link
                    href="/patient/audit"
                    className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    View Audit
                  </Link>
                </div>
              </div>
            ) : null}

            <div className="mt-8 p-4 bg-gray-100 rounded-md">
              <h3 className="font-semibold text-gray-900">Session Info:</h3>
              <pre className="text-sm text-gray-700 mt-2">
                {JSON.stringify(
                  {
                    name: session.user?.name,
                    email: session.user?.email,
                    role: userRole,
                  },
                  null,
                  2
                )}
              </pre>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

