import React, { Component } from 'react';

import store from './redux/store';

import Navigation from './components/nav';
import Dumper from './containers/dumper';
import Modeler from './containers/model';
import Modal from './components/url_modal';

import { getJson, fetchRequestedUrl, validUrl } from './parser/demo';

class App extends Component {

  state = {
    errorMessage: '',
    urlModalRequest: false,
    urlErrorMessage: ''
  };

  collapseAll = () => {
    this.setState(prev => (
      { tree: prev.cache }
    ));
  };

  loadDemo = () => {
    getJson().then((json) => {
      this.setState(
        { json: JSON.stringify(json, null, this.state.tabSize) });
      this.setTree();
    });
  };

  cleanSlate = () => {
    this.setState({
      json: '',
      isError: false,
      errorMessage: '',
      tree: [],
      cache: []
    });
  };

  tabSizeChange = (val) => {
    if (val >= 1 && val <= 5) {
      this.setState({ tabSize: parseInt(val) }); // eslint-disable-line
    }
  };

  loadUrl = (url) => {
    if (validUrl(url)) {
      fetchRequestedUrl(url).then((json) => {
        this.setState({
          json: JSON.stringify(json, null, this.state.tabSize),
          urlModalRequest: false,
          urlErrorMessage: ''
        });
        this.setTree();
      }).catch(err => this.setState({ urlErrorMessage: err.message }));
    }
  };
  modalControll = (state) => {
    this.setState({ urlModalRequest: state });
  };

  loadLocalStorage = () => {
    const json = localStorage.getItem('store') || JSON.stringify([]);
    this.setState({ json }, this.setTree);
  };

  render() {
    return (
      <div className="container">
        <Modal
          loadUrl={this.loadUrl}
          modalIsRequested={this.state.urlModalRequest}
          urlErrorMessage={this.state.urlErrorMessage}
          closeModal={this.modalControll}
        />
        <Navigation
          tabSize={this.state.tabSize}
          loadDemo={this.loadDemo}
          cleanSlate={this.cleanSlate}
          tabSizeChange={this.tabSizeChange}
          json={this.state.json}
          openModal={this.modalControll}
          loadLocalStorage={this.loadLocalStorage}
        />
        <div className="app">
          <Dumper />
          <Modeler collapseAll={this.collapseAll} />
        </div>
      </div>
    );
  }
}


export default App;

