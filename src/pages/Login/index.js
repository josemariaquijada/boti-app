import { useRef, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import useAuth from "../../hooks/useAuth";
import axios from "../../config/axios";

const LOGIN_URL = "/auth";

export default function Login() {
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location?.state?.from?.pathname || "/";
  const userRef = useRef();
  const errRef = useRef();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [username, password]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        LOGIN_URL,
        { username, password },
        { headers: { "Content-Type": "application/json" }, withCredentials: true }
      );
      const accessToken = response?.data?.accessToken;
      const roles = response?.data?.roles;
      setAuth({ username, password, roles, accessToken });
      navigate(from, { replace: true });
    } catch (err) {
      if (err?.response) {
        setErrMsg("No Server Response");
      } else if (err.response.status === 400) {
        setErrMsg("Missing Username or Password");
      } else if (err.response.status === 401) {
        setErrMsg("Unauthorized");
      } else {
        setErrMsg("Login Failed");
      }
      errRef.current.focus();
    }
  };

  return (
    <section className="flex min-h-screen  flex-col items-center justify-center">
      <form
        className="flex min-w-[20rem] max-w-[20rem] flex-col gap-1 rounded bg-neutral-100 p-5 shadow-md"
        onSubmit={handleSubmit}
      >
        <p
          ref={errRef}
          className={
            errMsg ? "rounded border border-red-700 bg-red-200 px-2 py-1 text-red-800" : ""
          }
          aria-live="assertive"
        >
          {errMsg}
        </p>
        <h1 className="mb-5 text-xl font-semibold text-neutral-800">Sign In</h1>

        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          className="rounded border border-neutral-300 py-1 px-2 shadow-sm"
          ref={userRef}
          autoComplete="off"
          value={username}
          onChange={({ target }) => setUsername(target.value)}
          required
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          className="rounded border border-neutral-300 py-1 px-2 shadow-sm"
          ref={userRef}
          value={password}
          onChange={({ target }) => setPassword(target.value)}
          required
        />
        <button className="mt-2 rounded bg-green-500 p-1">Sign In</button>
      </form>
    </section>
  );
}
