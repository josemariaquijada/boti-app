import { useRef, useState, useEffect } from "react";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import axios from "../../config/axios";

const USER_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const REGISTER_ULR = "/register";

export default function Register() {
  const userRef = useRef();
  const errRef = useRef();

  const [username, setUsername] = useState("");
  const [validName, setValidName] = useState(false);
  const [userFocus, setUserFocus] = useState(false);

  const [password, setPassword] = useState("");
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [matchPwd, setMatchPwd] = useState("");
  const [validMatch, setMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    const result = USER_REGEX.test(username);
    setValidName(result);
  }, [username]);

  useEffect(() => {
    const result = PWD_REGEX.test(password);
    setValidPwd(result);
    const match = password === matchPwd;
    setMatch(match);
  }, [password, matchPwd]);

  useEffect(() => {
    setErrMsg("");
  }, [username, password, matchPwd]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validation1 = USER_REGEX.test(username);
    const validation2 = PWD_REGEX.test(password);
    if (!validation1 || !validation2) {
      setErrMsg("Invalid Entry");
      return;
    }
    try {
      const response = await axios.post(REGISTER_ULR, JSON.stringify({ username, password }), {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      console.log(response.data);
      console.log(response.accessToken);
      setSuccess(true);
    } catch (err) {
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else if (err.response?.status === 409) {
        setErrMsg("Username Taken");
      } else {
        setErrMsg("Registration Failed");
      }
      errRef.current.focus();
    }
  };

  return (
    <section className="flex min-h-screen  flex-col items-center justify-center">
      {success ? (
        <div className="flex min-h-[10rem] min-w-[20rem] max-w-[20rem] flex-col gap-1 rounded bg-neutral-100 p-5 shadow-md">
          <h1>Success!</h1>
        </div>
      ) : (
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
          <h1 className="mb-5 text-xl font-semibold text-neutral-800">Register</h1>

          <label htmlFor="username">
            Username
            <span className={validName ? "ml-1 text-green-500" : "hidden"}>
              <FontAwesomeIcon icon={faCheck} />
            </span>
            <span className={validName || !username ? "hidden" : "ml-1 text-red-500"}>
              <FontAwesomeIcon icon={faTimes} />
            </span>
          </label>
          <input
            id="username"
            type="text"
            className=" rounded border border-neutral-300 py-1 px-2  text-sm shadow-sm"
            ref={userRef}
            onChange={({ target }) => setUsername(target.value)}
            autoComplete="off"
            aria-invalid={validName ? "false" : "true"}
            aria-describedby="uidnote"
            onFocus={() => setUserFocus(true)}
            onBlur={() => setUserFocus(false)}
          />
          <p
            id="uidnote"
            className={
              userFocus && username && !validName
                ? "rounded bg-neutral-700 py-1 px-2 text-sm text-neutral-50"
                : "absolute -left-[1000px]"
            }
          >
            <FontAwesomeIcon icon={faInfoCircle} />
            <br />
            4 to 24 characters.
            <br />
            Must begin with a letter. <br />
            Letters, numbers allowed.
          </p>

          <label htmlFor="password">
            Password
            <span className={validPwd ? "ml-1 text-green-500" : "hidden"}>
              <FontAwesomeIcon icon={faCheck} />
            </span>
            <span className={validPwd || !password ? "hidden" : "ml-1 text-red-500"}>
              <FontAwesomeIcon icon={faTimes} />
            </span>
          </label>
          <input
            id="password"
            type="password"
            className="rounded border border-neutral-300 py-1 px-2 shadow-sm"
            onChange={({ target }) => setPassword(target.value)}
            required
            aria-invalid={validPwd ? "false" : "true"}
            aria-describedby="pwdnote"
            onFocus={() => setPwdFocus(true)}
            onBlur={() => setPwdFocus(false)}
          />
          <p
            id="pwdnote"
            className={
              pwdFocus && password && !validPwd
                ? "rounded bg-neutral-700 py-1 px-2 text-sm text-neutral-50"
                : "absolute -left-[1000px]"
            }
          >
            <FontAwesomeIcon icon={faInfoCircle} />
            <br />
            8 to 24 characters.
            <br />
            Must include uppercase and lowercase letters, a number and a special character. <br />
            Letters, numbers allowed.
            <br />
            Allowed special characters: <span aria-label="exclamation mark">!</span>{" "}
            <span aria-label="at symbol">@</span> <span aria-label="hashtag">#</span>{" "}
            <span aria-label="dollar sign">$</span> <span aria-label="percent">%</span>{" "}
          </p>

          <label htmlFor="confirm">
            Confirm Password
            <span className={validMatch && password ? "ml-1 text-green-500" : "hidden"}>
              <FontAwesomeIcon icon={faCheck} />
            </span>
            <span className={validMatch || !matchPwd ? "hidden" : "ml-1 text-red-500"}>
              <FontAwesomeIcon icon={faTimes} />
            </span>
          </label>
          <input
            id="confirm"
            type="password"
            required
            className="rounded border border-neutral-300 py-1 px-2 shadow-sm"
            onChange={({ target }) => setMatchPwd(target.value)}
            aria-invalid={validMatch ? "false" : "true"}
            aria-describedby="confirmnote"
            onFocus={() => setMatchFocus(true)}
            onBlur={() => setMatchFocus(false)}
          />
          <p
            id="pwdnote"
            className={
              matchFocus && !validMatch
                ? "rounded bg-neutral-700 py-1 px-2 text-sm text-neutral-50"
                : "absolute -left-[1000px]"
            }
          >
            <FontAwesomeIcon icon={faInfoCircle} />
            <br />
            Must match the first password input field
          </p>

          <button
            className="mt-2 rounded bg-green-500 p-1"
            disabled={!validName || !validPwd || !validMatch ? true : false}
          >
            Sign Up
          </button>
        </form>
      )}
    </section>
  );
}
