import { SafeAreaView, StatusBar, StyleSheet, View } from 'react-native';
import Home from './src';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <Home />
      <StatusBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
});
