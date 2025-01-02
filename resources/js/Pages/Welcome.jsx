import React, { useState, useEffect } from 'react';
import AppLayout from '@/Layouts/AppLayout';

// Front page.

export default function Welcome() {

    return (
        <AppLayout>
            <div className="px-12">
                <div className="w-full mb-12">
                    <div className="items-center">
                        SST WEBAPP FRONT PAGE
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
