import { useState } from "react";
import useLoginGuard from "../../hooks/useLoginGuard";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { getRequest, postRequest } from "../../utilities/requests";
import { useDispatch } from "react-redux";
import { login as authLogin } from "../../features/authSlice";

const SignUp = () => {
  document.title = "Sign Up — Fanfiction-Project";
  useLoginGuard({ loggedIn: true, path: "/" });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [login, setLogin] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passRepeat, setPassRepeat] = useState("");
  const [mainHelpShow, setMainHelpShow] = useState(false);
  const [mainHelpText, setMainHelpText] = useState("");
  const [loginHelpShow, setLoginHelpShow] = useState(false);
  const [loginHelpText, setLoginHelpText] = useState("");
  const [emailHelpShow, setEmailHelpShow] = useState(false);
  const [emailHelpText, setEmailHelpText] = useState("");
  const [passHelpShow, setPassHelpShow] = useState(false);
  const [passHelpText, setPassHelpText] = useState("");

  const handleSignUp = async (e) => {
    var loginValid = true;
    var emailValid = true;
    var passwordMatch = true;
    e.preventDefault();
    if (!login.match(/^(?=.*[A-Za-z0-9]$)[A-Za-z][A-Za-z\d.\-_]{7,}$/)) {
      setLoginHelpShow(true);
      setLoginHelpText(
        "Your login must contain at least 8 symbols, start with a letter, end with a letter or number, contain letters, numbers, hyphen or underscore, and must not contain spaces, special characters, or emoji."
      );
      loginValid = false;
    } else if (!login) {
      setLoginHelpShow(true);
      setLoginHelpText(
        "You must provide login, so we can be able to recognize you later."
      );
      loginValid = false;
    } else {
      setLoginHelpShow(false);
      loginValid = true;
    }
    if (
      !email.match(
        /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
      )
    ) {
      setEmailHelpShow(true);
      setEmailHelpText("Please provide proper email address.");
      emailValid = false;
    } else {
      setEmailHelpShow(false);
      emailValid = true;
    }
    if (
      password.length < 8 ||
      !password.match(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&\-_])[A-Za-z\d@$!%*?&\-_]{8,}$/
      )
    ) {
      setPassHelpShow(true);
      setPassHelpText(
        "The password must contain at least 8 symbols, have at least one number, one uppercase letter, one lowercase letter and one special symbol."
      );
      passwordMatch = false;
    } else if (!(password === passRepeat)) {
      setPassRepeat("");
      setPassHelpShow(true);
      setPassHelpText("Passwords do not match.");
      passwordMatch = false;
    } else {
      setPassHelpShow(false);
      passwordMatch = true;
    }
    if (!loginValid || !emailValid || !passwordMatch) {
      console.log(loginValid, "|", emailValid, "|", passwordMatch);
      return;
    }
    const response = await postRequest("users/signup", {
      login,
      email,
      password,
    });
    if (!response.success) {
      setMainHelpShow(true);
      setMainHelpText(response.message + ".");
      setLogin("");
      setEmail("");
      setPassword("");
      setPassRepeat("");
      return;
    } else {
      localStorage.setItem("token", response.token);
      const res = await getRequest(
        `users/myself?tz=${Intl.DateTimeFormat().resolvedOptions().timeZone}`
      );
      dispatch(
        authLogin({
          user: res.user,
          token: localStorage.getItem("token"),
        })
      );
      const codeResponse = getRequest("users/email/confirm/request");
      if (!codeResponse.success) {
        // alert(codeResponse.message, "^");
      }
      navigate("/confirm-email");
    }
  };

  return (
    <Container className="py-3">
      <Row className="justify-content-center">
        <Col sm={12} md={6}>
          <Form>
            <Form.Text
              id="mainHelpBlock"
              muted
              style={{ display: mainHelpShow ? "initial" : "none" }}
            >
              {mainHelpText}
            </Form.Text>
            <Form.Group className="mb-4">
              <Form.Label>Login</Form.Label>
              <Form.Control
                required
                placeholder="Login"
                value={login}
                pattern="^(?=.*[A-Za-z0-9]$)[A-Za-z][A-Za-z\d.-_]{7,19}$"
                onChange={(e) => setLogin(e.target.value)}
              />
              <Form.Text
                id="loginHelpBlock"
                muted
                style={{ display: loginHelpShow ? "initial" : "none" }}
              >
                {loginHelpText}
              </Form.Text>
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label>E-mail</Form.Label>
              <Form.Control
                required
                autoComplete="on"
                type="email"
                placeholder="example@example.example"
                value={email}
                pattern="[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?"
                onChange={(e) => setEmail(e.target.value)}
              />
              <Form.Text
                id="emailHelpBlock"
                muted
                style={{
                  display: emailHelpShow ? "initial" : "none",
                }}
              >
                {emailHelpText}
              </Form.Text>
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label>Password</Form.Label>
              <Form.Control
                required
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label>Repeat password</Form.Label>
              <Form.Control
                required
                type="password"
                placeholder="Repeat Password"
                value={passRepeat}
                onChange={(e) => setPassRepeat(e.target.value)}
              />
              <Form.Text
                id="passwordHelpBlock"
                muted
                style={{
                  display: passHelpShow ? "initial" : "none",
                }}
              >
                {passHelpText}
              </Form.Text>
            </Form.Group>
            <Button type="submit" onClick={handleSignUp}>
              Sign Up
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default SignUp;
