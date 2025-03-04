import AppLayout from '@/Layouts/AppLayout';
import HeaderLabel from '@/Components/HeaderLabel';
import { PlusCircleIcon } from '@heroicons/react/24/outline';

export default function ManageUploads() {
  return (
    <AppLayout
      title="Manage Uploads"
      renderHeader={() => (
        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
          Manage Uploads
        </h2>
      )}
    >
      <div className="w-full flex flex-col" id="main_area">
        <HeaderLabel
          className="pl-12"
          iconObj={
            <PlusCircleIcon aria-hidden="true" className="size-6 shrink-0" />
          }
          majorTitle="Actions"
          minorTitle="Manage Uploads"
        ></HeaderLabel>
        To Do: Coming soon!
      </div>
    </AppLayout>
  );
}
