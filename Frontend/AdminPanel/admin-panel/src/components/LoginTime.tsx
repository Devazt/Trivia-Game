// src/components/LoginTime.tsx
import React, { useState, useEffect } from "react"

interface LoginTimeProps {
  username: string
}

const LoginTime: React.FC<LoginTimeProps> = ({}) => {
  const [loginTime, setLoginTime] = useState(new Date())

  useEffect(() => {
    setLoginTime(new Date())

    return () => {}
  }, [])

  const formattedTime = loginTime.toLocaleTimeString()

  return (
    <div>
      <p>Login Time: {formattedTime} WIB</p>
    </div>
  )
}

export default LoginTime
