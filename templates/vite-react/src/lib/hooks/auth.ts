import { useAtom } from 'jotai';
import { authenticatedAtom } from 'lib/stores';

export const useAuth = () => {
  const [authenticated, setAuthenticated] = useAtom(authenticatedAtom);
  return { authenticated, setAuthenticated };
};
