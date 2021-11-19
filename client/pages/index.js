import buildClient from '../api/build-client';

const LandingPage = ({ currentUser }) => {
  return currentUser ? (
    <h1>You are signed in</h1>
  ) : (
    <h1>You are NOT signed in</h1>
  );
};

LandingPage.getInitialProps = async context => {
  let data = {};
  console.log('LANDING PAGE!');
  const client = buildClient(context);
  try {
    const currentUser = (await client.get('/api/users/currentuser')).data;
    data = {
      currentUser
    };
  } catch (e) {
  }
  return data;
};

export default LandingPage;
