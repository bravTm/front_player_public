import './global.css';
import { ViewStyle } from 'react-native';
import Navigation from 'app/navigate/Navigation';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import LangProvider from 'app/provider/LangProvider';
import { Provider } from 'react-redux';
import { store } from 'app/store/store';
import AudioProvider from 'app/provider/AudioProvider/AudioProvider';

export default function App() {
  return (
      <LangProvider>
        <Provider store={store}>
          <AudioProvider>
            <SafeAreaProvider>
              <Navigation />
            </SafeAreaProvider>
          </AudioProvider>
        </Provider>
      </LangProvider>
  );
}
export interface ILayout {
    className?: string
    style?: ViewStyle
    isHasPadding?: boolean
}
