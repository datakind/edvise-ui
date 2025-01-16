import React, { useState, useEffect } from 'react';
import AppLayout from '@/Layouts/AppLayout';

// Front page.

export default function Welcome() {

    return (
        <AppLayout title="Home">
            <div className="flex auto flex-row px-12">
                <div className="w-full mb-12">
                    <div className="items-center">
                        SST WEBAPP FRONT PAGE!
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
