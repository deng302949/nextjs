import React from 'react';

import Link from 'next/link';

const Home = (props) => {
  return (
    <Link href="/example">
      <a>example</a>
    </Link>
  );
};

Home.getInitialProps = async ({ ctx }) => {
  return {};
};

export default Home;
