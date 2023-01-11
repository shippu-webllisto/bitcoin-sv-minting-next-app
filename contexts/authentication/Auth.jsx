// import { createContext, useContext } from 'react';
// import PropTypes from 'prop-types';
// import { useDispatch } from 'react-redux';
// import { AuthenticatedUser, ResetAuthentication } from '@/store/features/authentication/index';

// const AuthContext = createContext(null);

// export const AuthProvider = ({ children }) => {
//   const dispatch = useDispatch();

//   const Login = (password) => {
//     dispatch(AuthenticatedUser({ password, auth: true }));
//   };

//   const SignUp = (password) => {
//     dispatch(AuthenticatedUser({ password, auth: true }));
//   };

//   const Logout = () => {
//     dispatch(ResetAuthentication());
//   };

//   return <AuthContext.Provider value={{ Login, SignUp, Logout }}>{children}</AuthContext.Provider>;
// };

// AuthProvider.propTypes = {
//   children: PropTypes.node.isRequired,
// };

// export const useAuth = () => useContext(AuthContext);
