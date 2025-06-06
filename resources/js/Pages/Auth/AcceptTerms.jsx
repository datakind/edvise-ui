import { router } from '@inertiajs/react';
import React from 'react';
import Button from '@/Components/Landing/Button';

export default function AcceptTerms() {
    const acceptTerms = () => {
        router.post(route('terms.accept'));
    };

    return (
        <div className="flex h-screen items-center justify-center bg-gray-100">
            <div className="max-w-xl rounded bg-white p-8 shadow">
                <h1 className="text-xl font-bold mb-4">Terms of Service</h1>
                <div className="mb-4 max-h-60 overflow-y-auto text-sm text-gray-700">
                    <p>[Insert Terms of Service here...]</p>
                </div>
                <Button onClick={acceptTerms}>I Agree</Button>
            </div>
        </div>
    );
}
