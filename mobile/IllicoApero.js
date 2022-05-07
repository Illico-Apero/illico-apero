import React from 'react';
import { ActivityIndicator, BackHandler, View, Text } from 'react-native';
import { WebView } from 'react-native-webview';

export default class IllicoApero extends React.Component {

  constructor(props) {
    super(props);
    this.state = { 
      visible: true,
    };
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.WEBVIEW_REF = React.createRef();
  }

  hideSpinner() {
    this.setState({ visible: false });
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  handleBackButtonClick() {
    this.WEBVIEW_REF.current.goBack();
    return true;
  }



  render() {
    return (
      <View style={{ flex: 1 }}>
        <WebView
          onLoad={() => this.hideSpinner()}
          style={{ flex: 1 }}
          ref={ this.WEBVIEW_REF }
          source={{ uri: 'https://illicoapero.fr' }}
        />
        {this.state.visible && (
          <ActivityIndicator
            color='#e94d1a'
            size="large"
            style= {{ position: "absolute", alignSelf:'center', justifyContent: 'center', alignItems: 'center', top: 300 }}
          />
        )}
      </View>
    );
  }
}