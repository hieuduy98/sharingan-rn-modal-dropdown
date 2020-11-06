import * as React from 'react';
import { StyleSheet, View, StatusBar } from 'react-native';

import { Colors, Appbar, Provider } from 'react-native-paper';
// import Example from './Example';
import FormikExample from './FormikExample';

const App = () => {
  return (
    <Provider>
      <View>
        <StatusBar
          translucent
          backgroundColor={Colors.indigoA700}
          barStyle="light-content"
        />
        <Appbar style={styles.appBar}>
          <Appbar.Content
            title="Dropdown Example"
            titleStyle={styles.appbarTitle}
            style={styles.appBarContent}
          />
        </Appbar>
        <View>
          <FormikExample />
        </View>
      </View>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    marginLeft: 20,
    marginRight: 20,
  },
  appBar: { height: 80, backgroundColor: Colors.indigoA700 },
  appBarContent: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
  },
  appbarTitle: { paddingTop: 25 },
});

export default App;
