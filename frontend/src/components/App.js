import { useEffect, useState } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import '../index.css';
import { api } from '../utils/Api';
import { auth } from '../utils/auth'
import ProtectedRoute from "./ProtectedRoute";
import Login from './Login';
import Register from './Register';
import Main from './Main';
import Footer from './Footer';
import ImagePopup from './ImagePopup';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import { isButtonLoadingContext } from '../contexts/isButtonLoadingContext';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import ConfirmationPopup from './ConfirmationPopup';
import InfoToolTip from './InfoTooltip';

function App() {

  const history = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isImagePopupOpen, setIsImagePopupOpen] = useState(false)
  const [isConfirmationPopupOpen, setIsConfirmationPopupOpen] = useState(false);
  const [isInfoToolOpen, setisInfoToolOpen] = useState(false);
  const [isInfoToolSuccess, setIsInfoToolSuccess] = useState(false);
  const isOpen = isEditProfilePopupOpen || isAddPlacePopupOpen || isEditAvatarPopupOpen || isImagePopupOpen || isConfirmationPopupOpen || isInfoToolOpen;
  const [selectedCard, setSelectedCard] = useState(null);
  const [currentUser, setCurrentUser] = useState({name: '', about: '', avatar: '', cohort: '', _id: ''})
  const [userEmail, setUserEmail] = useState('');
  const [cards, setCards] = useState([]);
  const [isButtonLoading, setIsButtonLoading] = useState(false);

  useEffect(() => {
    tokenCheck();
    Promise.all([api.getUserInfo(), api.getInitialCards()])
      .then( ([user, cards]) => {
        setCards(cards);
        setCurrentUser(user);
      })
      .catch((err) => console.log(err))
  }, []);

  // Close any popup by Escape
  useEffect(() => {
    function closePopupByEsc(e) {
      if (e.key === 'Escape') {
        closeAllPopups();
      }
    }
    if (isOpen) {
        document.addEventListener('keydown', closePopupByEsc)
    }
    return () => {
      document.removeEventListener('keydown', closePopupByEsc)
    }
  }, [isOpen]);

  useEffect(() => {
    if (!loggedIn) return;
    history('/');
  }, [loggedIn]);

  function handleLogin (email, password) {
    auth.login(email, password)
      .then((data) => {
        localStorage.setItem('token', data.token);
        setUserEmail(email)
        setLoggedIn(true);
        history('/');
      })
      .catch(() => {
        setIsInfoToolSuccess(false)
        setisInfoToolOpen(true);
        setTimeout(() => {
          setisInfoToolOpen(false);
        }, 2500)
      })
  };

  function handleRegister (email, password) {
    auth.register(email, password)
      .then(() => {
        setIsInfoToolSuccess(true);
        setisInfoToolOpen(true);
        setTimeout(() => {
          history('/');
          setisInfoToolOpen(false)
        }, 2500)
      })
      .catch(() => {
        setIsInfoToolSuccess(false);
        setisInfoToolOpen(true)
        setTimeout(() => {
          setisInfoToolOpen(false);
        }, 2500)
      });
  };

  function handleLogout () {
    localStorage.removeItem('token');
    setLoggedIn(false);
    history('/signin');
  };

  function tokenCheck () {
    const jwt = localStorage.getItem('token');
    if (!jwt) { return }
      auth.checkToken(jwt)
        .then(() => {
          setLoggedIn(true)
          history('/')
        })
        .catch((err) => console.log(err));
  };

  function handleCardLike(card) {
    const isLiked = card.likes.some(i => i._id === currentUser._id);
    api.changeLikeCardStatus(card._id, isLiked, currentUser)
      .then((newCard) => {
        setCards((state) => state.map((c) => c._id === card._id ? newCard : c))
      })
      .catch((err) => console.log(err));
  };

  function handleCardDelete (card) {
    setIsButtonLoading(true);
    api.delCard(card._id)
      .then(() => setCards(cards.filter((item) => item._id !== card._id)))
      .then(() => closeAllPopups())
      .catch((err) => console.log(err))
      .finally(() => setIsButtonLoading(false))
  };

  function handleUpdateUser (userInfo) {
    setIsButtonLoading(true);
    api.setUserInfo(userInfo)
      .then((user) => setCurrentUser(user))
      .then(() => closeAllPopups())
      .catch((err) => console.log(err))
      .finally(() => setIsButtonLoading(false))
  };

  function handleUpdateAvatar (userAvatar) {
    setIsButtonLoading(true);
    api.setUserAvatar(userAvatar)
      .then((user) => setCurrentUser(user))
      .then(() => closeAllPopups())
      .catch((err) => console.log(err))
      .finally(() => setIsButtonLoading(false))
  };

  function handleAddPlace (card) {
    setIsButtonLoading(true);
    api.addCard(card)
      .then((cardData) => setCards([cardData, ...cards]))
      .then(() => closeAllPopups())
      .catch((err) => console.log(err))
      .finally(() => setIsButtonLoading(false))
  };

  function handleEditProfileClick () {
    setIsEditProfilePopupOpen(true);
  };

  function handleEditAvatarClick () {
    setIsEditAvatarPopupOpen(true);
  };

  function handleAddPlaceClick () {
    setIsAddPlacePopupOpen(true);
  };

  function handleCardClick (card) {
    setIsImagePopupOpen(true);
    setSelectedCard(card)
  };

  function handleCallConfirmationPopup (card) {
    setIsConfirmationPopupOpen(true);
    setSelectedCard(card)
  };

  function closeAllPopups () {
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsImagePopupOpen(false);
    setIsConfirmationPopupOpen(false);
    setisInfoToolOpen(false);
  };

  return (
    <div className="page-container">
      <CurrentUserContext.Provider value={currentUser}>
      <isButtonLoadingContext.Provider value={isButtonLoading}>

      <Routes>
        <Route path="/signup" element={
          <Register 
            onRegister={handleRegister} 
            headerText="Войти"
            headerLink="/signin"
            loggedIn={loggedIn}
            isInfoToolOpen={isInfoToolOpen}
            onClose={closeAllPopups}
          />
        }/>

        <Route path="/signin" element={
          <Login 
            onLogin={handleLogin}
            headerLink="/signup"
            headerText="Регистрация"
            isInfoToolOpen={isInfoToolOpen}
            onClose={closeAllPopups}
          />} 
        />

          <Route element={<ProtectedRoute loggedIn={loggedIn}/>}>   
            <Route exact path="/" element={
                  <Main
                    loggedIn={loggedIn}
                    onEditProfile={handleEditProfileClick}
                    onAddPlace={handleAddPlaceClick}
                    onEditAvatar={handleEditAvatarClick}
                    onCardClick={handleCardClick}
                    cards={cards}
                    onCardLike={handleCardLike}
                    onDeleteClick={handleCallConfirmationPopup}
                    onLogout={handleLogout}
                    userEmail={userEmail}
                  />
                }
            />
          </Route>

        <Route path="*"
          element={
            loggedIn ? <Navigate to="/" /> : <Navigate to="/signin" />
          } 
        />
        
      </Routes>

      <Footer />

      <InfoToolTip
        isOpen={isInfoToolOpen}
        onClose={closeAllPopups}
        success={isInfoToolSuccess}
      />

      <EditProfilePopup
        isOpen={isEditProfilePopupOpen} 
        onClose={closeAllPopups}
        onUpdateUser={handleUpdateUser}
      />

      <EditAvatarPopup 
        isOpen={isEditAvatarPopupOpen} 
        onClose={closeAllPopups}
        onUpdateAvatar={handleUpdateAvatar}
      />

      <AddPlacePopup
        isOpen={isAddPlacePopupOpen} 
        onClose={closeAllPopups}
        onAddPlace={handleAddPlace}
      />      

      <ConfirmationPopup 
        isOpen={isConfirmationPopupOpen} 
        onClose={closeAllPopups}
        onCardDelete={handleCardDelete}
        selectedCard={selectedCard}
      />

      <ImagePopup
        isOpen={isImagePopupOpen}
        card={selectedCard}
        onClose={closeAllPopups}
      />

    </isButtonLoadingContext.Provider>
    </CurrentUserContext.Provider>
    </div>
  );
};

export default App;