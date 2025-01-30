import { router } from '@inertiajs/core';
import { Link, Head, usePage } from '@inertiajs/react';
import classNames from 'classnames';
import React, { useState, useEffect } from 'react';
import useTypedPage from '@/Hooks/useTypedPage';
import Dropdown from '@/Components/Fields/Dropdown';
import AppLogo from '@/Components/Icons/AppLogo';
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { ChevronRightIcon } from '@heroicons/react/20/solid';
import {
  CalendarIcon,
  ChartPieIcon,
  PhoneIcon,
  ChevronDownIcon,
  DocumentDuplicateIcon,
  HomeIcon,
  UsersIcon,
  Cog8ToothIcon,
  BookOpenIcon,
  ArrowRightStartOnRectangleIcon,
  AdjustmentsVerticalIcon,
  ChartBarIcon,
  ClipboardDocumentListIcon,
  PlusIcon,
  PlusCircleIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';

const VisibilityType = Object.freeze({
    PUBLIC_ONLY: "PUBLIC_ONLY",
    PRIVATE_ONLY: "PRIVATE_ONLY",
    BOTH: "BOTH",
    DATAKIND_ONLY: "DATAKIND_ONLY" // This is a subset of PRIVATE_ONLY
});

const navigationAboveLine = [
    { name: 'Home', href: route('home'), icon: HomeIcon, visibility_type: VisibilityType.BOTH },

    {
        name: 'Dashboard',
        icon: ChartBarIcon,
        visibility_type: VisibilityType.PRIVATE_ONLY ,
        children: [
          { name: 'Model 1', href: route('dashboard') },
          { name: 'Model 2', href: route('dashboard') },
        ],
    },
    {
        name: 'Actions',
        icon: PlusCircleIcon,
        visibility_type: VisibilityType.PRIVATE_ONLY ,
        children: [
          { name: 'Upload Data', href: route('file-upload') },
          { name: 'Start Prediction', href: route('run-inference') },
        ],
    },
    {
        name: 'Admin Actions',
        icon: Cog8ToothIcon,
        visibility_type: VisibilityType.PRIVATE_ONLY ,
        children: [
            { name: 'Create Institution', href: route('create-inst'), icon: DocumentDuplicateIcon ,visibility_type: VisibilityType.PRIVATE_ONLY }, // TODO flip this to DATAKIND_ONLY after dev
            { name: 'View Data', href: route('view-data'), icon: DocumentDuplicateIcon ,visibility_type: VisibilityType.PRIVATE_ONLY },
            { name: 'Set Institution', href: route('set-inst'), icon: DocumentDuplicateIcon ,visibility_type: VisibilityType.PRIVATE_ONLY },
        ],
    },
    { name: 'Download Data', href: route('download-data'), icon: DocumentDuplicateIcon ,visibility_type: VisibilityType.PRIVATE_ONLY },
    { name: 'Data Dictionary', href: route('data-dictionary'), icon: BookOpenIcon, visibility_type: VisibilityType.BOTH},
];

const navigationBelowLine = [
    { name: 'FAQ', href: route('FAQ'), icon: DocumentDuplicateIcon ,visibility_type: VisibilityType.BOTH },
    { name: 'Logout', href: route('logout'), icon: ArrowRightStartOnRectangleIcon, visibility_type: VisibilityType.PRIVATE_ONLY },
    { name: 'Contact Us', href: '#', icon: PhoneIcon, visibility_type: VisibilityType.PUBLIC_ONLY },
    { name: 'About', href: '#', icon: InformationCircleIcon, visibility_type: VisibilityType.PUBLIC_ONLY },
];

// The title set in the page needs to match the name in the navigation map so that the highlighting works correctly.
export default function AppLayout({ title, renderHeader, children }) {

    
    const { auth, jetstream } = useTypedPage().props;
    const user = auth.user;
    const userIsDatakinder = auth.user ? auth.user.access == "DATAKINDER" : false;
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const pathname = window.location.pathname;

    const renderNav = (navMap) => (

        navMap.map((item) => (
             (!user && item.visibility_type == VisibilityType.PRIVATE_ONLY) || (user && item.visibility_type == VisibilityType.PUBLIC_ONLY) || (!userIsDatakinder && item.visibility_type == VisibilityType.DATAKIND_ONLY) ? (<></>) : ( 
            <li key={item.name}>
              {!item.children ? (

                // Logout gets treated as a button as it requires a post request
                // TODO: does this have auto-protection against csrf via the Laravel middleware stack?
                (item.name == "Logout") ? (
                <Link
            href={item.href}
            method="post"
            as="button"
            className='hover:bg-gray-50 group flex w-full items-center py-3 gap-x-3 rounded-md p-2 text-left text-sm/12 font-semibold text-[#637381]'>
            <item.icon aria-hidden="true" className="size-6 shrink-0" /> Log out
        </Link>
                ) :
                (<a href={item.href}
                  className={classNames(
                    (item.name == title) ? 'bg-gray-50' : 'hover:bg-gray-50',
                      'group flex w-full items-center py-3 gap-x-3 rounded-md p-2 text-left text-sm/12 font-semibold text-[#637381]',
                  )}
                >
                <item.icon aria-hidden="true" className="size-6 shrink-0" /> {item.name}
                </a>)
                
              ) : (
        (item.children.some(e => e.name === title)) ? (
            <Disclosure defaultOpen as="div">
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
                            (subItem.name == title) ? 'text-[#f79222]' : 'text-[#637381] hover:bg-gray-50',
                            'block font-semibold rounded-md py-2 pl-9 pr-2 text-sm/12',
                          )}
                        >
                          {subItem.name}
                        </DisclosureButton>
                      </li>
                    ))}
                  </DisclosurePanel>
                </Disclosure>) : (
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
                            (subItem.name == title) ? 'text-[#f79222]' : 'text-[#637381] hover:bg-gray-50',
                            'block font-semibold rounded-md py-2 pl-9 pr-2 text-sm/12',
                          )}
                        >
                          {subItem.name}
                        </DisclosureButton>
                      </li>
                    ))}
                  </DisclosurePanel>
                </Disclosure>)
                
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
<header>
      <nav className="basis-2/12 bg-white shadow-md flex flex-1 auto w-1/8 flex-row gap-y-6 overflow-y-auto border-r border-gray-200 bg-blue px-6 min-h-full">
        <div className="flex flex-col justify-between">

        <ul role="list" className="flex flex-1 flex-col gap-y-12">
        <div className="flex h-16 shrink-0 flex-col items-center pt-12" key="logo">
            <a href={route('home')}><AppLogo  className="h-8 w-auto" /></a>
        </div>        
        <ul>
            {renderNav(navigationAboveLine)} 
            <hr className="h-1 my-8 bg-[#dfe4ea] border-0"></hr>
            {renderNav(navigationBelowLine)} 
{user ? (
    <div  className="flex items-end gap-x-4 px-6 py-3 pb-48 text-sm/6 font-semibold text-[#637381] hover:bg-gray-50 hidden" key="profile">
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
        </Dropdown.Content>
    </Dropdown>
</div>
) : (<></>)}

  </ul>

</ul>
  {user ? (
    <a href={route('profile.edit')} className="">
        <div className="flex pr-4 pl-4 pt-6 pb-6 items-left justify-between text-[#637381] flex-col"> 
<div className="text-black font-semibold">{user.name}</div>
<div>{user.email}</div>
</div>  
    </a>


) : (
  <div className="flex pr-6 pl-6 pt-6 pb-6 items-center justify-between" id="login-register">
<a href={route('login')} className="hover:underline flex rounded-md text-sm/12 font-semibold text-[#637381]">Login</a>
<div className="hover:underline flex rounded-md text-sm/12 font-semibold text-[#637381]">&middot;</div>
<a href={route('register')} className="hover:underline flex rounded-md text-sm/12 font-semibold text-[#637381]">Register</a>
</div>

)}
</div>
</nav>
</header>
<div className="basis-10/12 min-h-screen flex-col justify-between">
<main className="h-[90%] flex pt-12">{children}</main>
<footer className="h-[10%] flex justify-center gap-x-6 pb-12 flex items-end pr-6">
    <a href={route('privacy-policy')} className="hover:underline flex rounded-md text-sm/12 font-semibold text-[#637381]">Privacy Policy</a>
    <a href={route('terms-of-service')} className="hover:underline flex rounded-md text-sm/12 font-semibold text-[#637381]">Terms of Service</a>
    <a href={route('license')} className="hover:underline flex rounded-md text-sm/12 font-semibold text-[#637381]">License</a>
    <div>|</div>
    <div>&copy; 2025 Datakind</div>
</footer>

</div>
</div>



    );
}




