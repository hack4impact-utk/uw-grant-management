import { Provider } from '../SessionProvider';
import { Session, getServerSession } from 'next-auth';
import authOptions from '../../app/api/auth/[...nextauth]/config';

type Props = {
  children?: React.ReactNode;
};

const AuthProvider = async ({ children }: Props) => {
  const session: Session | null | undefined =
    await getServerSession(authOptions);

  return <Provider session={session}>{children}</Provider>;
};

export default AuthProvider;
