import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { AuthenticatedUser } from '@/store/features/authentication/index';

export const useTimePeriode = (seconds) => {
  const { password } = useSelector((state) => state.authentication);
  const dispatch = useDispatch();
  const router = useRouter();

  setTimeout(() => {
    dispatch(AuthenticatedUser({ password: password, auth: false }));
    router.replace(endpoints.login);
  }, 1000 * seconds);
};
