import { NextPage } from 'next';
import Head from 'next/head';
import React from 'react';

import { GetServerSideProps } from 'next';

import Banner from 'components/homepage/Banner';
import { AllRecipesFeed } from 'components/homepage/RecipeFeed';
import { getCookieFromCookies } from 'helpers/methods';
import UserContext from 'helpers/UserContext';

type Props = {}

const Home: NextPage<Props> = ({}) => (
	<React.Fragment>
		<Head>
			<script key="data-layer" dangerouslySetInnerHTML={{
				__html: `
					dataLayer = [{
						'ecomm_pagetype' : 'home'
					}]      
				`}}
			/>
		</Head>
    <Banner />
		<AllRecipesFeed />
	</React.Fragment>
);

export default Home;