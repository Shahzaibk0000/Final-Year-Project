import { createContext, useState, useContext, useEffect, useMemo } from "react";
import PropTypes from "prop-types";

const UserContext = createContext();

const defaultUser = {
  id: null,
  firstName: "",
  lastName: "",
  usertype: "",
  contact: "",
  cnic: "",
  email: "",
  password: "",
  province: null,
  division: null,
  district: null,
  tehsil: null,
  hospital: null,
  createdOn: null,
  profilePicture: null,
};

const getUserFromLocalStorage = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : defaultUser;
};

// eslint-disable-next-line react/prop-types
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(getUserFromLocalStorage);

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  const updateUser = (newUser) => {
    setUser((prevUser) => ({ ...prevUser, ...newUser }));
  };

  const contextValue = useMemo(() => ({ user, updateUser }), [user]);

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useUser = () => useContext(UserContext);
