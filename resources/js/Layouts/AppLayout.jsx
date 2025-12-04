import { router } from '@inertiajs/core';
import { Link, Head, usePage } from '@inertiajs/react';
import classNames from 'classnames';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useTypedPage from '@/Hooks/useTypedPage';
import Dropdown from '@/Components/Fields/Dropdown';
import Footer from '@/Components/Footer';
import FeedbackButton from '@/Components/FeedbackButton';
import AppLogo from '@/Components/Icons/AppLogo';
import '../../css/landing.css';
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/react';
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
import { subtract } from 'lodash';
import { formatModelName } from '@/utils/stringUtils';
import CookieConsent from '@/Components/CookieConsent';

const VisibilityType = Object.freeze({
  PUBLIC_ONLY: 'PUBLIC_ONLY',
  PRIVATE_ONLY: 'PRIVATE_ONLY',
  BOTH: 'BOTH',
  DATAKIND_ONLY: 'DATAKIND_ONLY', // This is a subset of PRIVATE_ONLY
});

var navigationAboveLine = [
  {
    name: 'Home',
    href: route('new-home'),
    icon: HomeIcon,
    visibility_type: VisibilityType.BOTH,
  },

  {
    name: 'Model Results',
    icon: ChartBarIcon,
    href: route('dashboard'),
    visibility_type: VisibilityType.PRIVATE_ONLY,
  },
  {
    name: 'Data & Actions',
    icon: PlusCircleIcon,
    visibility_type: VisibilityType.PRIVATE_ONLY,
    children: [
      {
        name: 'Upload Data',
        href: route('file-upload'),
        visibility_type: VisibilityType.DATAKIND_ONLY,
      },
      { name: 'Start Prediction', href: route('run-inference') },
      {
        name: 'EDA Dashboard',
        href: route('eda'),
        visibility_type: VisibilityType.PRIVATE_ONLY,
      },
      { name: 'Manage Uploads', href: route('manage-uploads') },
    ],
  },
  {
    name: 'Data Dictionary',
    href: route('data-dictionary'),
    icon: BookOpenIcon,
    visibility_type: VisibilityType.BOTH,
  },
  {
    name: 'Admin Actions',
    icon: Cog8ToothIcon,
    visibility_type: VisibilityType.DATAKIND_ONLY,
    children: [
      {
        name: 'Set Institution',
        href: route('set-inst'),
        icon: DocumentDuplicateIcon,
        visibility_type: VisibilityType.DATAKIND_ONLY,
      },
      {
        name: 'Add Datakinders',
        href: route('add-dk'),
        icon: DocumentDuplicateIcon,
        visibility_type: VisibilityType.DATAKIND_ONLY,
      },
      {
        name: 'Create Model',
        href: route('create-model'),
        icon: ChartPieIcon,
        visibility_type: VisibilityType.DATAKIND_ONLY,
      },
      {
        name: 'Create Institution',
        href: route('create-inst'),
        icon: DocumentDuplicateIcon,
        visibility_type: VisibilityType.DATAKIND_ONLY,
      },
      {
        name: 'Edit Institution',
        href: route('edit-inst'),
        icon: ChartPieIcon,
        visibility_type: VisibilityType.DATAKIND_ONLY,
      },
      {
        name: 'Manage Invites',
        href: route('admin.invites'),
        icon: ClipboardDocumentListIcon,
        visibility_type: VisibilityType.DATAKIND_ONLY,
      },
    ],
  },
];

const navigationBelowLine = [
  /*{
    name: 'FAQ',
    href: route('FAQ'),
    icon: DocumentDuplicateIcon,
    visibility_type: VisibilityType.BOTH,
  },*/
  {
    name: 'Settings',
    href: route('profile.edit'),
    icon: Cog8ToothIcon,
    visibility_type: VisibilityType.PRIVATE_ONLY,
  },
  {
    name: 'Logout',
    href: route('logout'),
    icon: ArrowRightStartOnRectangleIcon,
    visibility_type: VisibilityType.PRIVATE_ONLY,
  },
  /*{
    name: 'Contact Us',
    href: '#',
    icon: PhoneIcon,
    visibility_type: VisibilityType.PUBLIC_ONLY,
  },
  {
    name: 'About',
    href: '#',
    icon: InformationCircleIcon,
    visibility_type: VisibilityType.PUBLIC_ONLY,
  },*/
];

// The title set in the page needs to match the name in the navigation map so that the highlighting works correctly.
export default function AppLayout({ title, renderHeader, children }) {
  const { auth, jetstream } = useTypedPage().props;
  const { inst_id } = usePage().props;
  const user = auth.user;
  const userIsDatakinder =
    auth.user != null ? auth.user.access_type == 'DATAKINDER' : false;
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [navAboveLine, setNavAboveLine] = useState(navigationAboveLine);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const pathname = window.location.pathname;

  function dashboardNavHelper(item, modelData) {
    if (
      item.name == 'Model Results' &&
      modelData != null &&
      modelData.length != 0
    ) {
      // Create a newItem to drop the href that's there by default.
      item = {
        name: 'Model Results',
        icon: ChartBarIcon,
        visibility_type: VisibilityType.PRIVATE_ONLY,
        children: [],
      };
      // Filter modelData to only include models where valid is true
      const validModels = modelData.filter(elem => elem.valid === true);

      // Sort validModels alphabetically by name
      const sortedValidModels = validModels.sort((a, b) =>
        a.name.localeCompare(b.name),
      );

      sortedValidModels.forEach(elem => {
        let transformedElem = {};
        transformedElem.name = elem.name;
        transformedElem.href = route('dashboard_modelname', elem.name);
        transformedElem.visibility_type = VisibilityType.PRIVATE_ONLY;
        item.children.push(transformedElem);
      });
    }
    return item;
  }

  useEffect(() => {
    // Reset navigation to initial state when institution changes
    setNavAboveLine(navigationAboveLine);

    const fetchModels = async () => {
      if (!inst_id) return; // Don't fetch if no institution is set

      try {
        const response = await axios.get('/models-api');
        let newNav = navigationAboveLine.map(item =>
          dashboardNavHelper(item, response.data),
        );
        setNavAboveLine(newNav);
      } catch (err) {
        //console.log(JSON.stringify(err));
        console.log('error during fetchModels');
      }
    };
    fetchModels();
  }, [inst_id]);

  const renderNav = navMap =>
    navMap.map(item =>
      (!user && item.visibility_type == VisibilityType.PRIVATE_ONLY) ||
        (user && item.visibility_type == VisibilityType.PUBLIC_ONLY) ||
        (!userIsDatakinder &&
          item.visibility_type == VisibilityType.DATAKIND_ONLY) ? (
        <></>
      ) : (
        <li key={item.name}>
          {!item.children ? (
            // Logout gets treated as a button as it requires a post request
            // TODO: does this have auto-protection against csrf via the Laravel middleware stack?
            item.name == 'Logout' ? (
              <Link
                href={item.href}
                method="post"
                as="button"
                className="text-sm/12 group -mx-6 flex w-[calc(100%+3rem)] items-center gap-x-3 px-6 py-2 text-left font-semibold text-[#637381] hover:text-black"
              >
                <item.icon aria-hidden="true" className="size-6 shrink-0" /> Log
                out
              </Link>
            ) : (
              <div className="relative">
                <a
                  href={item.href}
                  className={classNames(
                    item.name == title
                      ? 'border-r-2 border-[#f79222] bg-[#EEF2F6] text-black'
                      : 'text-[#637381] hover:text-black',
                    'text-sm/12 group -mx-6 flex w-[calc(100%+3rem)] items-center gap-x-3 px-6 py-2 text-left font-semibold',
                  )}
                >
                  <item.icon aria-hidden="true" className="size-6 shrink-0" />{' '}
                  {item.name}
                </a>
              </div>
            )
          ) : item.children.some(e => e.name === title) ||
            (item.name === 'Model Results' && title === 'Dashboard') ? (
            <Disclosure defaultOpen as="div">
              <DisclosureButton
                className={classNames(
                  'border-r-2 border-[#f79222] bg-[#EEF2F6] text-black',
                  'text-sm/12 group -mx-6 flex w-[calc(100%+3rem)] items-center gap-x-3 px-6 py-2 text-left font-semibold',
                )}
              >
                <item.icon aria-hidden="true" className="size-6 shrink-0" />
                {item.name}
                <ChevronRightIcon
                  aria-hidden="true"
                  className="size-5 shrink-0 text-gray-400 group-data-[open]:rotate-90 group-data-[open]:text-gray-500"
                />
              </DisclosureButton>
              <DisclosurePanel as="ul" className="mt-1">
                {item.children
                  .filter(
                    subItem =>
                      !subItem.visibility_type ||
                      (subItem.visibility_type ===
                        VisibilityType.DATAKIND_ONLY &&
                        userIsDatakinder) ||
                      (subItem.visibility_type ===
                        VisibilityType.PRIVATE_ONLY &&
                        user) ||
                      subItem.visibility_type === VisibilityType.BOTH,
                  )
                  .map(subItem => (
                    <li key={subItem.name}>
                      <DisclosureButton
                        as="a"
                        href={subItem.href}
                        className={classNames(
                          subItem.name == title
                            ? 'text-black'
                            : 'text-[#637381] hover:text-black',
                          'text-sm/12 relative block rounded-md py-2 pl-9 pr-2 font-semibold',
                        )}
                      >
                        {subItem.name == title && (
                          <span className="absolute left-4 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-[#f79222]"></span>
                        )}
                        {item.name === 'Model Results'
                          ? formatModelName(subItem.name)
                          : subItem.name}
                      </DisclosureButton>
                    </li>
                  ))}
              </DisclosurePanel>
            </Disclosure>
          ) : (
            <Disclosure as="div">
              <DisclosureButton
                className={classNames(
                  'text-[#637381] hover:text-black',
                  'text-sm/12 group -mx-6 flex w-[calc(100%+2rem)] items-center gap-x-3 px-6 py-2 text-left font-semibold',
                )}
              >
                <item.icon aria-hidden="true" className="size-6 shrink-0" />
                {item.name}
                <ChevronRightIcon
                  aria-hidden="true"
                  className="size-5 shrink-0 text-gray-400 group-data-[open]:rotate-90 group-data-[open]:text-black"
                />
              </DisclosureButton>
              <DisclosurePanel as="ul" className="mt-1">
                {item.children
                  .filter(
                    subItem =>
                      !subItem.visibility_type ||
                      (subItem.visibility_type ===
                        VisibilityType.DATAKIND_ONLY &&
                        userIsDatakinder) ||
                      (subItem.visibility_type ===
                        VisibilityType.PRIVATE_ONLY &&
                        user) ||
                      subItem.visibility_type === VisibilityType.BOTH,
                  )
                  .map(subItem => (
                    <li key={subItem.name}>
                      <DisclosureButton
                        as="a"
                        href={subItem.href}
                        className={classNames(
                          subItem.name == title
                            ? 'text-black'
                            : 'text-[#637381] hover:text-black',
                          'text-sm/12 relative block rounded-md py-2 pl-9 pr-2 font-semibold',
                        )}
                      >
                        {subItem.name == title && (
                          <span className="absolute left-4 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-[#f79222]"></span>
                        )}
                        {item.name === 'Model Results'
                          ? formatModelName(subItem.name)
                          : subItem.name}
                      </DisclosureButton>
                    </li>
                  ))}
              </DisclosurePanel>
            </Disclosure>
          )}
        </li>
      ),
    );

  if (isMobile) {
    return (
      <div className="flex min-h-screen flex-col">
        <header className="flex items-center justify-between p-4 text-secondary-dark">
          <img
            className="w-full pb-12"
            src="https://storage.googleapis.com/staging-sst-01-staging-static/edvise-logo.svg"
            alt="Edvise Logo"
          />
        </header>
        <main className="flex min-h-screen flex-col items-center bg-[#637381] p-6">
          <p className="text-center text-xl text-white">
            This application is not optimized for mobile devices at this time.
            Please visit the site on desktop.
          </p>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-row bg-[#EEF2F6]">
      <header>
        <nav className="auto w-1/8 bg-blue flex min-h-full flex-1 basis-2/12 flex-row gap-y-6 overflow-y-auto border-r border-gray-200 bg-white px-6 shadow-md">
          <div className="flex flex-col justify-between">
            <ul role="list" className="flex flex-1 flex-col gap-y-12">
              <li
                className="flex h-16 shrink-0 flex-col items-center pt-12"
                key="logo"
              >
                <a href={route('home')}>
                  <img
                    className="w-full pb-12"
                    src="https://storage.googleapis.com/staging-sst-01-staging-static/edvise-logo.svg"
                    alt="Edvise Logo"
                  />
                </a>
              </li>
              <li key="navigation">
                <ul>
                  {renderNav(navAboveLine)}
                  <li key="divider" aria-hidden="true">
                    <hr className="my-8 h-1 border-0 bg-[#dfe4ea]"></hr>
                  </li>
                  {renderNav(navigationBelowLine)}
                  {user ? (
                    <li key="profile" className="flex hidden items-end">
                      <div
                        className="flex w-full items-end gap-x-4 px-6 py-3 pb-48 text-sm/6 font-semibold text-[#637381] hover:bg-gray-50"
                      >
                        <span className="sr-only">Your profile</span>
                        <Dropdown>
                          <Dropdown.Trigger>
                            <button className="flex items-center gap-2 text-[#637381]">
                              <UsersIcon
                                aria-hidden="true"
                                className="size-6 shrink-0"
                              />
                              {user.name}
                              <ChevronDownIcon className="h-4 w-4" />
                            </button>
                          </Dropdown.Trigger>
                          <Dropdown.Content>
                            {/* <Dropdown.Link
                              href={route('#', user.current_team)}
                            >
                              Team Settings
                            </Dropdown.Link> */}
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
                                    {user.all_teams.map(team => (
                                      <form
                                        key={team.id}
                                        onSubmit={e => {
                                          e.preventDefault();
                                          switchToTeam(team);
                                        }}
                                      >
                                        <Dropdown.Link as="button">
                                          <div className="flex items-center">
                                            {team.id === user.current_team_id && (
                                              <svg
                                                className="me-2 h-5 w-5 text-green-400"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth="1.5"
                                                stroke="currentColor"
                                              >
                                                <path
                                                  strokeLinecap="round"
                                                  strokeLinejoin="round"
                                                  d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                />
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
                    </li>
                  ) : null}
                </ul>
              </li>
            </ul>
            {user ? (
              <div></div>
            ) : (
              <div
                className="flex items-center justify-between pb-6 pl-6 pr-6 pt-6"
                id="login-register"
              >
                <a
                  href={route('login')}
                  className="text-sm/12 flex rounded-md font-semibold text-[#637381] hover:underline"
                >
                  Login
                </a>
                <div className="text-sm/12 flex rounded-md font-semibold text-[#637381] hover:underline">
                  &middot;
                </div>
                <a
                  href={route('register')}
                  className="text-sm/12 flex rounded-md font-semibold text-[#637381] hover:underline"
                >
                  Register
                </a>
              </div>
            )}
          </div>
        </nav>
      </header>
      <div className="flex min-h-screen basis-full flex-col justify-between">
        <main className="flex w-full flex-1 pt-12">{children}</main>
        <Footer />
        <FeedbackButton />
        <CookieConsent />
      </div>
    </div>
  );
}
