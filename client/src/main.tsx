import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { GoogleOAuthProvider } from "@react-oauth/google"

import { NextUIProvider } from "@nextui-org/react"
// import { darkTheme } from "./themes/darktheme"

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  // <NextUIProvider theme={darkTheme}>
     <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
     <App />
     </GoogleOAuthProvider>
//  </NextUIProvider>
)
