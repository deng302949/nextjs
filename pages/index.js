import React from 'react';
import Router, { withRouter } from 'next/router';

import Layout from '@layouts/Layout';
import { Button } from '@1msoft/kant-ui';
import Icon from '@components/Icon';

const Home = (props) => {
  return (
    <div>
      <Button>Home</Button>
    </div>
  );
};

Home.getInitialProps = async (context) => {
  console.log(process.env);
  console.log(process.env.NEXT_SERVER_URL);
  return {};
};

Home.Layout = Layout;

export default Home;
