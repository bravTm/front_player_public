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
import TopSongsProvider from 'app/provider/TopSongsProvider';
import SocketProvider from 'app/provider/SocketProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';


const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false
		}
	}
})




export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
        <SocketProvider>
          <LangProvider>
            <SongsAndPlaySettingsProvider>
              <PlaybackAndAudioPlayProvider>
                <PlaylistsProvider>
                  <TopSongsProvider>

                  <AudioProvider>
                    <SafeAreaProvider> 
                        <Navigation />
                    </SafeAreaProvider>
                  </AudioProvider>

                  </TopSongsProvider>
                </PlaylistsProvider>
              </PlaybackAndAudioPlayProvider>
            </SongsAndPlaySettingsProvider>
          </LangProvider>
        </SocketProvider>
    </QueryClientProvider>
  );
}
export interface ILayout {
    className?: string
    style?: ViewStyle
    isHasPadding?: boolean
}
