import React from 'react';
import { GoogleLogin } from 'react-google-login';

const clientId = '514411299427-5bnrl4nug8sea3rdaare8ot4f3j36gge.apps.googleusercontent.com';

function Login() {
  const onSuccess = (res: any) => {
    console.log('[Login Success] currentUser:', res.profileObj);
  };

  const onFailure = (res: any) => {
    console.log('[Login Failed] res:', res);
  }

  return (
  <div>
    <GoogleLogin
      clientId={clientId}
      buttonText="Login"
      onSuccess={onSuccess}
      onFailure={onFailure}
      cookiePolicy={'single_host_origin'}
      style={{marginTop: '100px'}}
      isSignedIn={true}
    />
  </div>
  );
}

export default Login;