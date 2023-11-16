import dynamic from 'next/dynamic';
import { getServerSession } from 'next-auth';

const Map = dynamic(() => import('../components/map'), { ssr: false });

export default async function Home() {
  const session = await getServerSession();

  return (
    <>
      <h1>Home page</h1>
      {session?.user?.name ? (
        <div>
          {session?.user?.name}
          <div>{session?.user?.email}</div>
        </div>
      ) : (
        <div>Not logged in</div>
      )}
      <Map />
    </>
  );
}
