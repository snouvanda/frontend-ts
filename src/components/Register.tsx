import { useRef, useState, useEffect, FormEvent } from "react"
import {
  faCheck,
  faTimes,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import axios, { axiosError } from "../api/axios"

const EMAIL_REGEX: RegExp = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
// const NAME_REGEX: RegExp = /^[A-z][A-z0-9-_]{3,49}$/
const PHONE_REGEX = /^[0-9-]{9,15}$/
const PWD_REGEX: RegExp =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/
const REGISTER_URL = "/auth/register"

export const Register = () => {
  const emailRef = useRef<HTMLInputElement>(null)
  const errRef = useRef<HTMLParagraphElement>(null)

  const [email, setEmail] = useState("")
  const [validEmail, setValidEmail] = useState(false)
  const [emailFocus, setEmailFocus] = useState(false)

  const [name, setName] = useState("")
  const [validName, setValidName] = useState(false)
  const [nameFocus, setNameFocus] = useState(false)

  const [reqRole, setReqRole] = useState("")
  const [validReqRole, setValidReqRole] = useState(false)
  const [reqRoleFocus, setReqRoleFocus] = useState(false)

  const [phone, setPhone] = useState("")
  const [validPhone, setValidPhone] = useState(false)
  const [phoneFocus, setPhoneFocus] = useState(false)

  const [pwd, setPwd] = useState("")
  const [validPwd, setValidPwd] = useState(false)
  const [pwdFocus, setPwdFocus] = useState(false)

  const [matchPwd, setMatchPwd] = useState("")
  const [validMatch, setValidMatch] = useState(false)
  const [matchFocus, setMatchFocus] = useState(false)

  const [errMsg, setErrMsg] = useState("")
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    emailRef.current?.focus()
  }, [])

  useEffect(() => {
    const result = EMAIL_REGEX.test(email)
    console.log(result)
    console.log(email)
    setValidEmail(result)
  }, [email])

  useEffect(() => {
    const result = () => {
      if (name.length > 2 && name.length <= 50) return true
      return false
    }
    console.log(result)
    console.log(name)
    setValidName(result)
  }, [name])

  useEffect(() => {
    let result: boolean = false
    if (phone) {
      result = PHONE_REGEX.test(phone)
    }
    console.log(result)
    console.log(phone)
    setValidPhone(result)
  }, [phone])

  useEffect(() => {
    const result = () => {
      if (
        reqRole === "admin" ||
        reqRole === "employee" ||
        reqRole === "customer" ||
        reqRole === "shipper" ||
        reqRole === "supplier" ||
        reqRole === "guest"
      ) {
        return true
      }
      return false
    }
    console.log(result)
    console.log(reqRole)
    setValidReqRole(result)
  }, [reqRole])

  useEffect(() => {
    const result = PWD_REGEX.test(pwd)
    console.log(result)
    console.log(pwd)
    setValidPwd(result)
    const match = pwd === matchPwd
    setValidMatch(match)
  }, [pwd, matchPwd])

  useEffect(() => {
    setErrMsg("")
  }, [email, name, reqRole, phone, pwd, matchPwd])

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // if button enabled with JS hack
    const v1 = EMAIL_REGEX.test(email)
    const v2 = PWD_REGEX.test(pwd)
    if (!v1 || !v2) {
      setErrMsg("Invalid Entry")
      return
    }
    try {
      const response = await axios.post(
        REGISTER_URL,
        JSON.stringify({
          email,
          name,
          phone,
          password: pwd,
          requestedRole: reqRole,
        }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        },
      )
      console.log(response.data)
      console.log(JSON.stringify(response))
      setSuccess(true)
      // clear input fields
    } catch (error) {
      if (axiosError(error)) {
        if (!error?.response) {
          setErrMsg("No Server Response")
        } else if (error.response?.status === 409) {
          setErrMsg("Email already registered.")
        } else {
          setErrMsg("Registration failed.")
        }
      }
      errRef.current?.focus()
    }
  }

  return (
    <>
      {success ? (
        <section>
          <h1>Success!</h1>
          <p>
            <a href="#">Sign In</a>
          </p>
        </section>
      ) : (
        <section>
          <p
            ref={errRef}
            className={errMsg ? "errmsg" : "offscreen"}
            aria-live="assertive"
          >
            {errMsg}
          </p>
          <h1>Register</h1>
          <form onSubmit={handleSubmit}>
            {/* Email */}
            <label htmlFor="email">
              Email:
              <span className={validEmail ? "valid" : "hide"}>
                <FontAwesomeIcon icon={faCheck} />
              </span>
              <span className={validEmail || !email ? "hide" : "invalid"}>
                <FontAwesomeIcon icon={faTimes} />
              </span>
            </label>

            <input
              type="text"
              id="email"
              ref={emailRef}
              autoComplete="off"
              onChange={(e) => setEmail(e.target.value)}
              required
              aria-invalid={validEmail ? "false" : "true"}
              aria-describedby="emailnote"
              onFocus={() => setEmailFocus(true)}
              onBlur={() => setEmailFocus(false)}
            />

            <p
              id="emailnote"
              className={
                emailFocus && email && !validEmail
                  ? "instructions"
                  : "offscreen"
              }
            >
              <FontAwesomeIcon icon={faInfoCircle} />
              Example: yourname@domain.com
            </p>

            {/* Name */}
            <label htmlFor="name">
              Name:
              <span className={validName ? "valid" : "hide"}>
                <FontAwesomeIcon icon={faCheck} />
              </span>
              <span className={validName || !name ? "hide" : "invalid"}>
                <FontAwesomeIcon icon={faTimes} />
              </span>
            </label>

            <input
              type="text"
              id="name"
              autoComplete="off"
              onChange={(e) => setName(e.target.value)}
              required
              aria-invalid={validName ? "false" : "true"}
              aria-describedby="namenote"
              onFocus={() => setNameFocus(true)}
              onBlur={() => setNameFocus(false)}
            />

            <p
              id="namenote"
              className={
                nameFocus && name && !validName ? "instructions" : "offscreen"
              }
            >
              <FontAwesomeIcon icon={faInfoCircle} />
              3 to 50 characters. <br />
            </p>

            {/* Phone */}
            <label htmlFor="phone">
              Phone:
              <span className={validPhone ? "valid" : "hide"}>
                <FontAwesomeIcon icon={faCheck} />
              </span>
              <span className={validPhone || !phone ? "hide" : "invalid"}>
                <FontAwesomeIcon icon={faTimes} />
              </span>
            </label>

            <input
              type="text"
              id="name"
              autoComplete="off"
              onChange={(e) => setPhone(e.target.value)}
              required
              aria-invalid={validPhone ? "false" : "true"}
              aria-describedby="phonenote"
              onFocus={() => setPhoneFocus(true)}
              onBlur={() => setPhoneFocus(false)}
            />

            <p
              id="phonenote"
              className={
                phoneFocus && phone && !validPhone
                  ? "instructions"
                  : "offscreen"
              }
            >
              <FontAwesomeIcon icon={faInfoCircle} />9 to 15 digits. Optional
              for guest role.
            </p>

            {/* Requested Role */}
            <label htmlFor="reqrole">
              Request Role:
              <span className={validReqRole ? "valid" : "hide"}>
                <FontAwesomeIcon icon={faCheck} />
              </span>
              <span className={validReqRole || !reqRole ? "hide" : "invalid"}>
                <FontAwesomeIcon icon={faTimes} />
              </span>
            </label>

            <input
              type="text"
              id="reqrole"
              autoComplete="off"
              onChange={(e) => setReqRole(e.target.value)}
              required
              aria-invalid={validReqRole ? "false" : "true"}
              aria-describedby="reqrolenote"
              onFocus={() => setReqRoleFocus(true)}
              onBlur={() => setReqRoleFocus(false)}
            />
            <p
              id="reqrolenote"
              className={
                reqRoleFocus && reqRole && !validReqRole
                  ? "instructions"
                  : "offscreen"
              }
            >
              <FontAwesomeIcon icon={faInfoCircle} />
              admin, employee, customer, supplier, shipper, guest (in
              lowercase). <br />
              Phone is required for all roles except guest.
            </p>

            {/* Password */}
            <label htmlFor="password">
              Password:
              <FontAwesomeIcon
                icon={faCheck}
                className={validPwd ? "valid" : "hide"}
              />
              <FontAwesomeIcon
                icon={faTimes}
                className={validPwd || !pwd ? "hide" : "invalid"}
              />
            </label>

            <input
              type="password"
              id="password"
              onChange={(e) => setPwd(e.target.value)}
              value={pwd}
              required
              aria-invalid={validPwd ? "false" : "true"}
              aria-describedby="pwdnote"
              onFocus={() => setPwdFocus(true)}
              onBlur={() => setPwdFocus(false)}
            />

            <p
              id="pwdnote"
              className={pwdFocus && !validPwd ? "instructions" : "offscreen"}
            >
              <FontAwesomeIcon icon={faInfoCircle} />
              8 to 24 characters.
              <br />
              Must include uppercase and lowercase letters, a number and a
              special character.
              <br />
              Allowed special characters:{" "}
              <span aria-label="exclamation mark">!</span>{" "}
              <span aria-label="at symbol">@</span>{" "}
              <span aria-label="hashtag">#</span>{" "}
              <span aria-label="dollar sign">$</span>{" "}
              <span aria-label="percent">%</span>
            </p>

            {/* Confirm Password */}
            <label htmlFor="confirm_pwd">
              Confirm Password:
              <FontAwesomeIcon
                icon={faCheck}
                className={validMatch && matchPwd ? "valid" : "hide"}
              />
              <FontAwesomeIcon
                icon={faTimes}
                className={validMatch || !matchPwd ? "hide" : "invalid"}
              />
            </label>

            <input
              type="password"
              id="confirm_pwd"
              onChange={(e) => setMatchPwd(e.target.value)}
              value={matchPwd}
              required
              aria-invalid={validMatch ? "false" : "true"}
              aria-describedby="confirmnote"
              onFocus={() => setMatchFocus(true)}
              onBlur={() => setMatchFocus(false)}
            />

            <p
              id="confirmnote"
              className={
                matchFocus && !validMatch ? "instructions" : "offscreen"
              }
            >
              <FontAwesomeIcon icon={faInfoCircle} />
              Must match the first password input field.
            </p>

            {/* Submit Button */}
            <button
              disabled={
                !validEmail ||
                !validName ||
                !validPhone ||
                !validReqRole ||
                !validMatch
                  ? true
                  : false
              }
            >
              Sign Up
            </button>
          </form>
          <p>
            Already registered?
            <br />
            <span className="line">
              {/* put router link here */}
              <a href="#">Sign In</a>
            </span>
          </p>
        </section>
      )}
    </>
  )
}
