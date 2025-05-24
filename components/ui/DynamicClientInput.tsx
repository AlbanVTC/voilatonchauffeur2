import dynamic from 'next/dynamic';

const ClientOnlyMapboxInput = dynamic(() => import('./ClientOnlyMapboxInput'), {
  ssr: false,
});

export default ClientOnlyMapboxInput;
