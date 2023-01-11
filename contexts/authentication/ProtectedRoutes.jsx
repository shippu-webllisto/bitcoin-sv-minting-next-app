// import { useRouter } from 'next/router';
// import PropTypes from 'prop-types';
// import { toast } from 'react-toastify';
// import { checkEmptyValue } from '@/utils/checkEmptyValue';

// export const ProtectedRoutes = ({ children }) => {
//   const { password } = useSelector((state) => state.authentication);
//   const router = useRouter();

//   if (checkEmptyValue(password)) {
//     toast.info("you don't have an account, please create!");
//     return router.replace(endpoints.login);
//   }

//   return children;
// };

// ProtectedRoutes.propTypes = {
//   children: PropTypes.node.isRequired,
// };
