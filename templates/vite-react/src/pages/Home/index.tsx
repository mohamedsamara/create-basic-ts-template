import { useAuth } from 'lib/hooks';
import Layout from 'layouts/default';

export const HOME_TEST_ID = 'home';

const Home = () => {
  const { authenticated } = useAuth();

  return (
    <Layout>
      <div
        data-testid={HOME_TEST_ID}
        className="container max-w-sm min-h-full px-4 py-12 mx-auto"
      >
        <div className="flex flex-col items-center content-center justify-end h-full">
          <h4 className="mb-6 text-3xl">Vite React</h4>
          <p className="mt-4 text-gray-400">
            {authenticated ? 'Authenticated' : 'Not Authenticated'}
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
