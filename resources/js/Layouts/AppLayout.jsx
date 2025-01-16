import { router } from '@inertiajs/core';
import { Link, Head, usePage } from '@inertiajs/react';
import classNames from 'classnames';
import React, { useState, useEffect } from 'react';
import useTypedPage from '@/Hooks/useTypedPage';
import Dropdown from '@/Components/Fields/Dropdown';
import AppLogo from '@/Components/Icons/AppLogo';
import { ChevronDownIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline';
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { ChevronRightIcon } from '@heroicons/react/20/solid';
import {
  CalendarIcon,
  ChartPieIcon,
  DocumentDuplicateIcon,
  HomeIcon,
  UsersIcon,
  Cog8ToothIcon,
  BookOpenIcon,
  ArrowRightStartOnRectangleIcon,
  AdjustmentsVerticalIcon,
  ChartBarIcon,
  ClipboardDocumentListIcon,
  PlusIcon
} from '@heroicons/react/24/outline';

const VisibilityType = Object.freeze({
    PUBLIC_ONLY: "PUBLIC_ONLY",
    PRIVATE_ONLY: "PRIVATE_ONLY",
    BOTH: "BOTH"
});

const navigationAboveLine = [
    {
        name: 'Dashboard',
        icon: ChartBarIcon,
        public: VisibilityType.PRIVATE_ONLY ,
        children: [
          { name: 'Model 1', href: route('dashboard') },
          { name: 'Model 2', href: route('dashboard') },
        ],
    },
    { name: 'View Data', href: route('view-data'), icon: DocumentDuplicateIcon ,public: VisibilityType.PRIVATE_ONLY },
    { name: 'Download Data', href: route('download-data'), icon: DocumentDuplicateIcon ,public: VisibilityType.PRIVATE_ONLY },
    { name: 'File Upload', href: route('file-upload'), icon: DocumentDuplicateIcon ,public: VisibilityType.PRIVATE_ONLY },
    { name: 'Data Dictionary', href: route('data-dictionary'), icon: BookOpenIcon, public: VisibilityType.BOTH},
    { name: 'FAQ', href: route('FAQ'), icon: DocumentDuplicateIcon ,public: VisibilityType.BOTH },
];

const navigationBelowLine = [
    { name: 'Settings', href: '#', icon: Cog8ToothIcon, public: VisibilityType.PRIVATE_ONLY },
    { name: 'Login', href: route('login'), icon: UsersIcon, public: VisibilityType.PUBLIC_ONLY },
    { name: 'Register', href: route('register'), icon: UsersIcon, public: VisibilityType.PUBLIC_ONLY },
    { name: 'Home', href: route('home'), icon: HomeIcon, public: VisibilityType.BOTH },
    { name: 'Privacy Policy', href: route('privacy-policy'), icon: ClipboardDocumentListIcon, public: VisibilityType.BOTH },
    { name: 'Terms of Service', href: route('terms-of-service'), icon: ClipboardDocumentListIcon, public: VisibilityType.BOTH },
    { name: 'License', href: route('license'), icon: ClipboardDocumentListIcon, public: VisibilityType.BOTH },
];

// The title set in the page needs to match the name in the navigation map so that the highlighting works correctly.
export default function AppLayout({ title, renderHeader, children }) {

    
    const { auth, jetstream } = useTypedPage().props;
    const user = auth.user;
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const pathname = window.location.pathname;
    const openFeedbackForm = () => {
        const feedbackFormUrl = import.meta.env.VITE_FEEDBACK_FORM_URL;
        window.open(feedbackFormUrl, '_blank');
    };




    const renderNav = (navMap) => (

        navMap.map((item) => (
             (!user && item.public == VisibilityType.PRIVATE_ONLY) || (user && item.public == VisibilityType.PUBLIC_ONLY) ? (<></>) : ( 
            <li key={item.name}>
              {!item.children ? (
               <a href={item.href}
                  className={classNames(
                    (item.name == title) ? 'bg-gray-50' : 'hover:bg-gray-50',
                      'group flex w-full items-center py-3 gap-x-3 rounded-md p-2 text-left text-sm/12 font-semibold text-[#637381]',
                  )}
                >
                <item.icon aria-hidden="true" className="size-6 shrink-0" /> {item.name}
                </a>
                
              ) : (
                <Disclosure as="div">
                  <DisclosureButton
                    className={classNames(
                      (item.name == title) ? 'bg-gray-50' : 'hover:bg-gray-50',
                      'group flex w-full items-center gap-x-3 rounded-md p-2 text-left text-sm/12 font-semibold text-[#637381]',
                    )}
                  >
                     <item.icon aria-hidden="true" className="size-6 shrink-0" />
                    {item.name}
                    <ChevronRightIcon
                      aria-hidden="true"
                      className="size-5 shrink-0 text-gray-400 group-data-[open]:rotate-90 group-data-[open]:text-gray-500"
                    />
                  </DisclosureButton>
                  <DisclosurePanel as="ul" className="mt-1 px-2">
                    {item.children.map((subItem) => (
                      <li key={subItem.name}>
                        <DisclosureButton
                          as="a"
                          href={subItem.href}
                          className={classNames(
                            (subItem.name == title) ? 'bg-gray-50' : 'hover:bg-gray-50',
                            'block rounded-md py-2 pl-9 pr-2 text-sm/12 text-[#637381]',
                          )}
                        >
                          {subItem.name}
                        </DisclosureButton>
                      </li>
                    ))}
                  </DisclosurePanel>
                </Disclosure>
              )}
            </li>) 
          ))
    );


    if (isMobile) {
        return (
            <div className="min-h-screen flex flex-col">
                <header className="flex items-center justify-between p-4 text-secondary-dark">
                    <AppLogo />
                </header>
                <main className="flex flex-col items-center p-6 bg-[#637381] min-h-screen">
                    <p className="text-center text-xl text-white">
                        This application is not optimized for mobile devices at this time. Please visit the site on desktop.
                    </p>
                </main>
            </div>
        );
    }

    return (

<div className="bg-background flex flex-row">

<div className="basis-2/12 bg-white shadow-md">
<header>
      <nav className="flex flex-1 auto w-1/8 flex-row gap-y-6 overflow-y-auto border-r border-gray-200 bg-blue px-6 min-h-screen">
        <ul role="list" className="flex flex-1 flex-col gap-y-12">
        <div className="flex h-16 shrink-0 flex-col items-center pt-12">
        <a href={route('home')}>
            <AppLogo  className="h-8 w-auto" />
        </a>
    </div>
    {user ? (
    <div className="flex items-center justify-center px-3">
    <a className="flex items-center gap-2 text-gray-900 h-[50px] px-6 bg-[#f79222] rounded-md justify-center items-center gap-2 inline-flex"
href= {route('run-inference')}
    >
        <PlusIcon aria-hidden="true" className="size-6 shrink-0 text-white" />
        <div className="text-center text-white text-base font-medium font-['Helvetica Neue'] leading-normal">Start new prediction</div>
    </a>
</div>
) : (<></>)}


                 
          <li>
            {renderNav(navigationAboveLine)} 
        <hr class="h-1 my-8 bg-[#dfe4ea] border-0"></hr>

            {renderNav(navigationBelowLine)} 

{user ? (
    <div  className="flex items-end gap-x-4 px-6 py-3 text-sm/6 font-semibold text-[#637381] hover:bg-gray-50">
<span className="sr-only">Your profile</span>
    <Dropdown>
        <Dropdown.Trigger>
            <button className="flex items-center gap-2 text-[#637381]">
                <UsersIcon aria-hidden="true" className="size-6 shrink-0" />
                {user.name}
                <ChevronDownIcon className="h-4 w-4" />
            </button>
        </Dropdown.Trigger>
        <Dropdown.Content>
            <Dropdown.Link href={route('profile.edit')}>Profile</Dropdown.Link>
            <Dropdown.Link href={route('teams.show', user.current_team)}>
                Team Settings
            </Dropdown.Link>
            {jetstream.hasTeamFeatures && (
                <>
                    {jetstream.canCreateTeams && (
                        <Dropdown.Link href={route('teams.create')}>
                            Create New Team
                        </Dropdown.Link>
                    )}
                    {user.all_teams.length > 1 && (
                        <>
                            <div className="border-t border-gray-200" />
                            <div className="block px-4 py-2 text-xs text-gray-400">
                                Switch Teams
                            </div>
                            {user.all_teams.map((team) => (
                                <form key={team.id} onSubmit={(e) => {
                                    e.preventDefault();
                                    switchToTeam(team);
                                }}>
                                    <Dropdown.Link as="button">
                                        <div className="flex items-center">
                                            {team.id === user.current_team_id && (
                                                <svg className="me-2 h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            )}
                                            <div>{team.name}</div>
                                        </div>
                                    </Dropdown.Link>
                                </form>
                            ))}
                        </>
                    )}
                </>
            )}
            <Dropdown.Link href={route('logout')} method="post" as="button">
                Log Out
            </Dropdown.Link>
        </Dropdown.Content>
    </Dropdown>
</div>
) : (<></>)}

  </li>
</ul>
</nav>
</header>
</div>
<div className="z-50 cursor-pointer fixed bottom-10 hover:bg-primary-dark shadow-md right-10 bg-primary rounded-full p-2 px-4 text-white text-sm">
    <button onClick={openFeedbackForm}>Feedback</button>
</div>
<div className="basis-10/12 pt-12 min-h-screen">
    <main>{children}</main>
    </div>
</div>



    );
}




