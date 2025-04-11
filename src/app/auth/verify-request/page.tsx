'use client';
import { ProservLogo } from '@/components/ProservLogo';

export default function VerifyRequest() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center">
          <ProservLogo size={80} />
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Check your email
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            A sign in link has been sent to your email address.
          </p>
          <p className="mt-4 text-center text-sm text-gray-500">
            Please click the link in the email to complete the sign-in process.
            If you don't see the email, check your spam folder.
          </p>
        </div>
      </div>
    </div>
  );
}