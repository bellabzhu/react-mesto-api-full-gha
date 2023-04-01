import { Link } from 'react-router-dom';

function Header (props) {

  return (
    <header className="header">
      <Link to='/'>
        <div className="header__logo" aria-label="Logo"></div>
      </Link>
      {props?.onLogout
        ? <div className="header__userdata">
            <p className="header__email">{props.userEmail}</p>
            <button className="button header__link" onClick={props.onLogout}>Выйти</button>
          </div>
        : <Link to={props.headerLink} className="header__link">{props.headerText}</Link>
      }
    </header>
  )
}

export default Header;