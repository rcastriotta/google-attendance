import React from 'react';
import { useGoogleAuth } from '../../googleAuth';
import googleIcon from '../../assets/googleIcon.png';

// STYLES
import styles from './Login.module.css'

const Login = () => {
    const { signIn } = useGoogleAuth();


    return (
        <React.Fragment>
            <div className={styles.Login}>
                <h3>Let's get started</h3>
                <span style={{ color: 'gray' }}>Log in to view attendance records for your Google Classroom</span>
                <div className={styles.Button} onClick={signIn} >
                    <div className={styles.GoogleImgContainer} >
                        <img className={styles.GoogleImg} src={googleIcon} alt="googleLogo" />
                    </div>
                    <span>Login with Google</span>
                </div>
            </div>
            <span className={styles.Tag}>Built by Ryan Castriotta</span>
        </React.Fragment>

    )
}

export default Login;