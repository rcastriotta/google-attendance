import React from 'react'
import { useGoogleLogin } from 'react-use-googlelogin'

const GoogleAuthContext = React.createContext()

export const GoogleAuthProvider = ({ children }) => {
    const googleAuth = useGoogleLogin({
        clientId: "778190995266-knmp3uuhepkci2icmtfasoevob43827f.apps.googleusercontent.com",
        scope: "https://www.googleapis.com/auth/classroom.courses https://www.googleapis.com/auth/classroom.coursework.students https://www.googleapis.com/auth/classroom.rosters.readonly"
    })

    return (
        <GoogleAuthContext.Provider value={googleAuth}>
            {children}
        </GoogleAuthContext.Provider>
    )
}

export const useGoogleAuth = () => React.useContext(GoogleAuthContext)