import React from 'react';
import { useRouter } from 'next/router';
import { useMyTripsQuery } from '@space-explorer/graphql/react';

import { Layout, UserHeader } from '../components/layout';
import { Loader } from '../components/common';
import { LaunchCard } from '../components/launch';

export const Profile = () => {
  const { data, loading } = useMyTripsQuery();
  const router = useRouter();
  if (!loading && !data.me) {
    process.browser && router.push('/login');
  }
  return (
    <Layout title="My trips">
      {!loading && data?.me ? (
        <>
          <UserHeader email={data.me?.email}>My Trips</UserHeader>
          {Boolean(data?.me.trips) &&
            data.me.trips.map((l) => <LaunchCard key={l.id} {...l} />)}
        </>
      ) : (
        <Loader />
      )}
    </Layout>
  );
};

export default Profile;
