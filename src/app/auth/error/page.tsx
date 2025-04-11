'use client';
export const dynamic = 'force-dynamic';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ProservLogo } from '@/components/ProservLogo';
import Link from 'next/link';

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  let errorMessage = 'An unexpected error occurred.';

  if (error === 'AccessDenied') {
    errorMessage = 'Access denied. You do not have permission to access this resource.';
  } else if (error === 'Verification') {
    errorMessage = 'The sign-in link is no longer valid. It may have expired or been used already.';
  } else if (error === 'EmailSignin') {
    errorMessage = 'There was a problem sending the sign-in email. Please try again.';
  }

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="flex flex-col items-center">
        <ProservLogo size={80} />
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          Authentication Error
        </h2>
        <div className="mt-4 text-center p-4 bg-red-50 rounded-md border border-red-200">
          <p className="text-red-600">{errorMessage}</p>
        </div>
        <div className="mt-6">
          <Link href="/auth/signin" className="text-blue-600 hover:text-blue-500">
            Return to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ErrorPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <Suspense fallback={<div>Loading...</div>}>
        <ErrorContent />
      </Suspense>
    </div>
  );
}
