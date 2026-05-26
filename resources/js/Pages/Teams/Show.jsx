import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import DeleteTeamForm from '@/Pages/Teams/Partials/DeleteTeamForm';
import SectionBorder from '@/Components/Fields/SectionBorder';
import TeamMemberManager from '@/Pages/Teams/Partials/TeamMemberManager';
import UpdateTeamNameForm from '@/Pages/Teams/Partials/UpdateTeamNameForm';

const Show = ({ team, availableRoles, permissions }) => {
  return (
    <AppLayout
      title="Team Settings"
      renderHeader={() => (
        <h2 className="text-xl leading-tight font-semibold text-gray-800">
          Team Settings
        </h2>
      )}
    >
      <div className="mx-auto max-w-7xl py-10 sm:px-6 lg:px-8">
        <div>
          <UpdateTeamNameForm team={team} permissions={permissions} />

          <SectionBorder />
        </div>

        <div className="mt-10 sm:mt-0">
          <TeamMemberManager
            team={team}
            availableRoles={availableRoles}
            userPermissions={permissions}
          />
        </div>

        {permissions.canDeleteTeam && !team.personal_team && (
          <>
            <SectionBorder />
            <div className="mt-10 sm:mt-0">
              <DeleteTeamForm team={team} />
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
};

export default Show;
