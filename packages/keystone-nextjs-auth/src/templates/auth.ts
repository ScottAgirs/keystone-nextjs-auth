import ejs from 'ejs';
import { AuthGqlNames } from '../types';

const template = `
import getNextAuthPage from '@opensaas/keystone-nextjs-auth/pages/NextAuthPage';
import { query } from '.keystone/api';
import keystoneConfig from '../../../../../keystone';

export default getNextAuthPage({
        identityField: '<%= identityField %>',
        sessionData: '<%= sessionData %>',
        listKey: '<%= listKey %>',
        userMap: <%- JSON.stringify(userMap) %>,
        accountMap: <%- JSON.stringify(accountMap) %>,
        profileMap: <%- JSON.stringify(profileMap) %>,
        autoCreate: <%= autoCreate %>,
        sessionSecret: '<%= sessionSecret %>',
        providers: keystoneConfig.providers,
        query,
    });
  `;

export const authTemplate = ({
  gqlNames,
  identityField,
  sessionData,
  listKey,
  autoCreate,
  userMap,
  accountMap,
  profileMap,
  sessionSecret,
}: {
  gqlNames: AuthGqlNames;
  identityField: string;
  sessionData: any;
  listKey: string;
  autoCreate: boolean;
  userMap: any;
  accountMap: any;
  profileMap: any;
  sessionSecret: string;
}) => {
  const authOut = ejs.render(template, {
    gqlNames,
    identityField,
    sessionData,
    listKey,
    autoCreate,
    userMap,
    accountMap,
    profileMap,
    sessionSecret,
  });
  return authOut;
};
