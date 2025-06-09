import React, { useRef, useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import AuthLayout from '@/Layouts/AuthLayout';
import Button from '@/Components/Landing/Button';
import AuthFooter from '@/Components/AuthFooter';

export default function AcceptTerms() {
    const scrollRef = useRef(null);
    const [scrolledToBottom, setScrolledToBottom] = useState(false);

    const handleScroll = () => {
        const el = scrollRef.current;
        if (!el) return;
        const isBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 10;
        if (isBottom) setScrolledToBottom(true);
    };

    useEffect(() => {
        const el = scrollRef.current;
        if (el) {
            el.addEventListener('scroll', handleScroll);
        }
        return () => {
            if (el) {
                el.removeEventListener('scroll', handleScroll);
            }
        };
    }, []);

    const acceptTerms = () => {
        router.post(route('terms.accept'));
    };

    return (
        <AuthLayout>
            <div className="layout:box-container landing-rounded-lg relative mx-auto w-3/4 bg-white pb-20 sm:pb-44">
                <div className="mx-auto -mb-12 mt-12 w-full max-w-2xl p-4">
                    <Head title="Accept Terms" />

                    <img
                        className="w-1/3 pb-12"
                        src="https://storage.googleapis.com/staging-sst-01-staging-static/edvise-logo.svg"
                        alt="Edvise Logo"
                    />

                    <div className="pb-8 text-2xl">Please review and accept our Terms of Service:</div>

                    <div
                        ref={scrollRef}
                        className="overflow-y-auto max-h-[50vh] rounded border border-gray-200 bg-gray-50 p-6 text-sm shadow-inner space-y-4"
                        data-lenis-prevent
                    >
                        {/* Your terms content here (unchanged) */}
                        <h2 className="text-lg font-semibold">
                            DataKind’s [AppName] Service Terms and Conditions of Use
                        </h2>
                        <p>
                            DataKind (the “Company”) has developed the [AppName] (available at
                            the entry-point URL [AppUrl]) (the “Site”). [AppName] (“[App]” or
                            the “Service” or “Project”) is [AppDescription].
                        </p>

                        <h3 className="text-base font-semibold">1. USE OF THE SERVICE</h3>
                        <p>
                            We will provide you with, and you desire to receive, access to the
                            Service during the term of any applicable order for Services
                            (“Order”), and subject to your compliance with the terms and
                            conditions set forth herein (the “Terms of Use”). Your continued
                            use of the Service evidences your agreement to be bound by these
                            Terms of Use and constitutes a legally binding contract between
                            you and the Company. IF YOU DO NOT AGREE WITH ANY OF THE TERMS OF
                            USE, YOU ARE NOT PERMITTED TO USE THE SERVICE.
                        </p>

                        <h3 className="text-base font-semibold">2. MODIFICATION OF TERMS OF USE</h3>
                        <p>
                            We reserve the right to change or modify the Terms of Use at our
                            sole discretion at any time. Any change or modification to the
                            Terms of Use will be effective immediately upon posting on the
                            Site. We will take reasonable steps to notify you of any changes
                            or modifications to the Terms of Use. Your continued use of the
                            Service constitutes acceptance of any changes or modifications.
                        </p>
                        <p>
                            The Company reserves the right to modify fees at any time for the
                            applicable services upon notice to you. Modified fees apply to all
                            Orders and renewals after the date of such notice.
                        </p>

                        <h3 className="text-base font-semibold">3. SITE USER CONDUCT</h3>
                        <p>
                            To access the Site and Services, you must select a unique login ID
                            (“User Email”) and password (“User Password”). Do not share your
                            credentials with anyone. Do not allow others to access your
                            account.
                        </p>
                        <p>
                            Submissions to the Site are subject to the Code of Conduct. The
                            Company may suspend access for behavior it deems inappropriate.
                        </p>
                        <p>
                            This site uses a Creative Commons (CC BY-SA 4.0) license. You may
                            reuse DataKind content with attribution and under the same license.
                        </p>
                        <ul className="list-disc list-inside">
                            <li>
                                <strong>Attribution:</strong> Clearly attribute the work to
                                [AppName] and link to [AppUrl].
                            </li>
                            <li>
                                <strong>ShareAlike:</strong> Derivative works must use the same
                                license.
                            </li>
                        </ul>
                        <p>
                            Some third-party content, especially images, may have separate
                            restrictions. Contact us with questions about reuse.
                        </p>

                        <h3 className="text-base font-semibold">4. INTELLECTUAL PROPERTY RIGHTS</h3>
                        <p>
                            All content (data, text, media, layouts, code, etc.) on the Site is
                            owned by the Company or licensors and protected under law.
                        </p>
                        <p>
                            Logos, trademarks, and service marks on the Site are property of
                            their respective owners and protected under applicable law.
                        </p>
                    </div>

                    <div className="mt-8 flex items-center justify-end">
                        <Button onClick={acceptTerms} disabled={!scrolledToBottom}>
                            I Agree
                        </Button>


                    </div>

                    <div className="text-center mt-20">
                        <AuthFooter />
                    </div>
                </div>
            </div>
        </AuthLayout>
    );
}
