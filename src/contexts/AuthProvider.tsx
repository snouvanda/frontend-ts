import React, {
  createContext,
  useState,
  Dispatch,
  SetStateAction,
  ReactNode,
} from "react"

export type AuthType = {
  email: string
  password: string
  role: string
  accessToken: string
}

export interface AuthContextInterface {
  auth: AuthType
  setAuth: Dispatch<SetStateAction<AuthType>>
}

const defaultState = {
  auth: {
    email: "",
    password: "",
    role: "",
    accessToken: "",
  },
  setAuth: (auth: AuthType) => {},
} as AuthContextInterface

const AuthContext = createContext(defaultState)

type AuthProviderProps = {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [auth, setAuth] = useState<AuthType>({
    email: "",
    password: "",
    role: "",
    accessToken: "",
  })

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
