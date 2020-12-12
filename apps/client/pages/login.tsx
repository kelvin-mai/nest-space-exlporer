import React from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import {
  useLoginMutation,
  useMyTripsQuery,
} from '@space-explorer/graphql/react';
import cookie from 'js-cookie';

import { Loader, EmailForm } from '../components/common';
import { Layout } from '../components/layout';

export interface LoginProps {}

export const Login: NextPage<LoginProps> = () => {
  const [login, { loading }] = useLoginMutation({
    notifyOnNetworkStatusChange: true,
  });
  const { data, refetch } = useMyTripsQuery();
  const router = useRouter();
  const handleSubmit = async (value: string) => {
    const result = await login({ variables: { email: value } });
    if (!result.errors) {
      cookie.set('token', result.data.login);
      await refetch();
    }
  };

  if (data?.me) {
    router.push('/profile');
  }

  return (
    <Layout title="Login">
      {loading ? <Loader /> : <EmailForm onSubmit={handleSubmit} />}
    </Layout>
  );
};

export default Login;
