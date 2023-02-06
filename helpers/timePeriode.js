import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { AuthenticatedUser } from '@/store/features/authentication/index';
import { endpoints } from '@/routes/endpoints';

export const useTimePeriode = (seconds) => {
  const { password } = useSelector((state) => state.authentication);
  const dispatch = useDispatch();
  const router = useRouter();

  setTimeout(() => {
    dispatch(AuthenticatedUser({ password: password, auth: false }));
    router.replace(endpoints.login);
  }, seconds * 1000);
};
