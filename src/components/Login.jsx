

import { useState, useRef } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { ref, push, set } from "firebase/database";
import { rtdb } from "../../firebaseConfig";
import Logo from "../assets/logo.png";
import BackgroundImage from "../assets/login-bg.png"; // 👈 add your background image here
import { MdVisibility, MdVisibilityOff } from "react-icons/md";

function Login({ auth,}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const passwordInputRef = useRef(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // IP
      let ipAddress = "";
      try {
        const ipRes = await fetch("https://api.ipify.org?format=json");
        const ipData = await ipRes.json();
        ipAddress = ipData.ip;
      } catch {
        ipAddress = "Unavailable";
      }

      // Device Type
      const userAgent = navigator.userAgent;
      let deviceType = "Desktop";
      if (/Mobi|Android/i.test(userAgent)) deviceType = "Mobile";
      else if (/Tablet|iPad/i.test(userAgent)) deviceType = "Tablet";

      // IST
      const now = new Date();
      const istOffset = 5.5 * 60 * 60 * 1000;
      const istTime = new Date(now.getTime() + istOffset);

      // Save Log
      const logRef = ref(rtdb, `loginLogs/${user.uid}`);
      const newLogRef = push(logRef);
      await set(newLogRef, {
        email: user.email,
        loginAt: istTime.toISOString(),
        ip: ipAddress,
        deviceType: deviceType,
        userAgent: userAgent,
      });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: `url(${BackgroundImage})` }}
    >
      {/* Optional dark overlay for better contrast */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Login Card */}
      <div className="relative bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md z-10" style={ {boxShadow: 'rgba(0, 0, 0, 0.01) -1px 0px 25px 0px inset, rgb(90, 200, 250) -1px -1px 4px, rgb(234, 155, 147) 1px 2px 8px, rgb(240, 246, 251) 0px 2px 16px'}}>
        <div className="flex flex-col items-center gap-2">
          <img src={Logo} alt="Logo" className="h-14 w-auto" style={ {width: '150px', height: 'auto'}} />
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 text-center">
            All-in-One Marketing Hub
          </h2>
          <p className="text-sm text-gray-500 text-center">Sign in to continue</p>
        </div>

        <form onSubmit={handleLogin} className="mt-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 text-start">Email</label>
            <input
              type="email"
              placeholder="Enter your mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 text-start">Password</label>
            <input
              ref={passwordInputRef}
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
            <button
              type="button"
              className="absolute right-3 top-9 text-gray-500"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <MdVisibility /> : <MdVisibilityOff />}
            </button>
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            className="w-full bg-[#ef5226] hover:bg-[#d4491f] text-white py-2 rounded-lg font-semibold transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
