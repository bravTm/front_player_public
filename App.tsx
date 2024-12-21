import './global.css';
import './reanimatedConfig';
import { ViewStyle } from 'react-native';
import Navigation from 'app/navigate/Navigation';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import LangProvider from 'app/provider/LangProvider';
import AudioProvider from 'app/provider/AudioProvider/AudioProvider';
import SongsAndPlaySettingsProvider from 'app/provider/SongsAndPlaySettingsProvider';
import PlaybackAndAudioPlayProvider from 'app/provider/PlaybackAndAudioPlayProvider';
import PlaylistsProvider from 'app/provider/PlaylistsProvider';

export default function App() {
  return (
      <LangProvider>
        <SongsAndPlaySettingsProvider>
          <PlaybackAndAudioPlayProvider>
            <PlaylistsProvider>

              <AudioProvider>
                <SafeAreaProvider>
                  <Navigation />
                </SafeAreaProvider>
              </AudioProvider>

            </PlaylistsProvider>
          </PlaybackAndAudioPlayProvider>
        </SongsAndPlaySettingsProvider>
      </LangProvider>
  );
}
export interface ILayout {
    className?: string
    style?: ViewStyle
    isHasPadding?: boolean
}
