import AppProviders from '~/app/providers';
import { RootStack } from '~/navigation/root';

export default function App() {
  return (
    <AppProviders>
      <RootStack />
    </AppProviders>
  )
}