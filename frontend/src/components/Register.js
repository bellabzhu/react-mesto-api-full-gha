import Header from './Header';
import { Link } from 'react-router-dom';
import { useState, useEffect} from 'react';

function Register (props) {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    setEmail('');
    setPassword('');
  }, [])

  const handleEmailChange = (e) => {
    setEmail(e.target.value)
  }

  const handlePassChange = (e) => {
    setPassword(e.target.value)
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    props.onRegister(email, password);
  }

  return (
    <>
      <Header 
        headerText={props.headerText} 
        headerLink={props.headerLink}
      />
      <section className="login">
        <h2 className="login__title">Регистрация</h2>
        <form className="login__form" onSubmit={handleSubmit}>
        <input className="login__input login__input_value_email" onChange={handleEmailChange} type="email" placeholder="Email" name="email" required minLength="4" maxLength="40" value={email} />
        <input className="login__input login__input_value_pass" onChange={handlePassChange} type="password" placeholder="Password" name="password" required minLength="4" maxLength="40" value={password} />
          <button className="button button-enter" type="submit">Зарегистрироваться</button>
          <Link to="/signin" className="login__substring">Уже зарегистрированы? Войти</Link>
        </form>
      </section>
    </>
  )
}

export default Register;