import React from 'react';
import APITokenManager from '@/Pages/API/Partials/APITokenManager';
import AppLayout from '@/Layouts/AppLayout';
export default function ApiTokenIndex({
  tokens,
  availablePermissions,
  defaultPermissions,
}) {
  return (
    <AppLayout
      title={'API Tokens'}
      renderHeader={() => (
        <h2 className="text-xl leading-tight font-semibold text-gray-800">
          API Tokens
        </h2>
      )}
    >
      <div>
        <div className="mx-auto max-w-7xl py-10 sm:px-6 lg:px-8">
          <APITokenManager
            tokens={tokens}
            availablePermissions={availablePermissions}
            defaultPermissions={defaultPermissions}
          />
        </div>
      </div>
    </AppLayout>
  );
}
