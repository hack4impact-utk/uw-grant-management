import dynamic from 'next/dynamic';

const Map = dynamic(() => import('../components/map'), { ssr: false });

export default function Home() {
  return (
    <>
      <h1>Home page</h1>
      <Map />
    </>
  );
}
