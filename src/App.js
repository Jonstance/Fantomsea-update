import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./styles/app.sass";
import Page from "./components/Page";
import Home from "./screens/Home";
import UploadVariants from "./screens/UploadVariants";
import UploadDetails from "./screens/UploadDetails";
import UploadMultipleDetails from "./screens/UploadMultipleDetails";
import ConnectWallet from "./screens/ConnectWallet";
import Faq from "./screens/Faq";
import Activity from "./screens/Activity";
import Search01 from "./screens/Search01";
import Search02 from "./screens/Search02";
import Profile from "./screens/Profile";
import ProfileEdit from "./screens/ProfileEdit";
import Item from "./screens/Item";
import PageList from "./screens/PageList";
import UserProfile from "./screens/OtherProfile";
import IndividualCollection from "./screens/Collections";
import AllCollections from "./screens/AllCollections";

import {ethers} from 'ethers';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { nftaddress, nftmarketaddress } from "./config";
import NFT from "./ABIs/contracts/NFT.sol/NFT.json";
import Market from "./ABIs/contracts/NFTMarket.sol/NFTMarket.json";
import AppProvider  from "./context/context";



 

function App() {


  const [nfts, setNfts] =  useState('')

  return (
    <AppProvider>
    <Router>
      <Switch>
        <Route
          exact
          path="/"
          render={() => (
            <Page>
              <Home />
            </Page>
          )}
        />
        <Route
          exact
          path="/upload-variants"
          render={() => (
            <Page>
              <UploadVariants />
            </Page>
          )}
        />
        <Route
          exact
          path="/upload-details"
          render={() => (
            <Page>
              <UploadDetails />
            </Page>
          )}
        />
        {/* <Route
          exact
          path="/upload-multiple-details"
          render={() => (
            <Page>
              <UploadMultipleDetails />
            </Page>
          )}
        /> */}
        <Route
          exact
          path="/connect-wallet"
          render={() => (
            <Page>
              <ConnectWallet />
            </Page>
          )}
        />
        {/* <Route
          exact
          path="/faq"
          render={() => (
            <Page>
              <Faq />
            </Page>
          )}
        /> */}
        <Route
          exact
          path="/activity"
          render={() => (
            <Page>
              <Activity />
            </Page>
          )}
        />
        <Route
          exact
          path="/discover"
          render={() => (
            <Page>
              <Search01 />
            </Page>
          )}
        />
        <Route
          exact
          path="/search02"
          render={() => (
            <Page>
              <Search02 />
            </Page>
          )}
        />
        <Route
          exact
          path="/profile"
          render={() => (
            <Page>
              <Profile />
            </Page>
          )}
        />
        <Route
          path="/profile/:address"
          render={() => (
            <Page>
              <UserProfile/>
            </Page>
          )}
        />
        <Route
          path="/collection/:collectionId"
          render={() => (
            <Page>
              <IndividualCollection/>
            </Page>
          )}
        />
        <Route
          path="/all-collections"
          render={() => (
            <Page>
              <AllCollections/>
            </Page>
          )}
        />
        <Route
          exact
          path="/profile-edit"
          render={() => (
            <Page>
              <ProfileEdit />
            </Page>
          )}
        />
        <Route
          exact
          path="/nft/:id/"
          render={() => (
            <Page>
              <Item />
            </Page>
          )}
        />
        <Route
          exact
          path="/pagelist"
          render={() => (
            <Page>
              <PageList />
            </Page>
          )}
        />

      </Switch>
    </Router>
    </AppProvider>
  );
}

export default App;
