import App, { Container } from 'next/app'
import React from 'react'
import { InjectStoreContext, initializeData } from '../stores'
import Layout from '../components/Layout';
import '../assets/styles/system-style.less';

class MyMobxApp extends App {
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {}
    const initialStoreData = initializeData()

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps({ ctx, initialStoreData })
    }

    return {
      pageProps,
      initialStoreData
    }
  }

  render() {
    const { Component, pageProps, initialStoreData } = this.props
    return (
      <Container>
        <InjectStoreContext initialData={initialStoreData}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </InjectStoreContext>
      </Container>
    )
  }
}

export default MyMobxApp
