import {
  createContext,
  useState,
  useEffect
} from "react";

import api from "../api/axios";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext =
  createContext();

function AuthProvider({
  children
}) {

  const [user, setUser] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    const loadUser =
      async () => {

        const token =
          localStorage.getItem(
            "token"
          );

        if (!token) {

          setLoading(false);
          return;

        }

        try {

          const response =
            await api.get(
              "/users/profile"
            );

          setUser(
            response.data
          );

        }

        catch (error) {

          console.log(
            error
          );

          localStorage.removeItem(
            "token"
          );

          setUser(null);

        }

        finally {

          setLoading(false);

        }

      };

    loadUser();

  }, []);

  return (

    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading
      }}
    >

      {children}

    </AuthContext.Provider>

  );

}

export default AuthProvider;
