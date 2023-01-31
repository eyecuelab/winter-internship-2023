import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { google_client_id } from './../GoogleClient'
import { GoogleOAuthProvider } from "@react-oauth/google"
import { NextUIProvider } from "@nextui-org/react"
// import { darkTheme } from "./themes/darktheme"

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  // <NextUIProvider theme={darkTheme}>
     <GoogleOAuthProvider clientId={google_client_id}>
     <App />
     </GoogleOAuthProvider>
//  </NextUIProvider>
)
