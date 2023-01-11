
const Nav = ({ authToken, minimal, setShowModal, showModal, setIsSignUp }) => {
  const handleClick = () => {
    setShowModal(true);
    setIsSignUp(false);
  };

  return (
    <nav>
      {!authToken && !minimal && (
        <button
        type="button" 
        className="btn-setup"
          onClick={handleClick}
          disabled={showModal}
        >
          <div>Log in</div>
        </button>
      )}
    </nav>
  );
};
export default Nav;
