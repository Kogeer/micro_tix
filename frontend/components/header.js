const Header = ({ currentUser }) => {
    return <h1>Logged in user: {currentUser.email}!</h1>
};

export default Header;
