import buildClient from "../api/build-client";

const Index = ({ currentUser }) => {
    return (
        <>
            {currentUser ? (
                <h1>You are signed in</h1>
            ) : (
                <h1>You are not signed in</h1>
            )}
        </>
    );
};

// Here we can access the client and current user from _app.js
Index.getInitialProps = async (context, client, currentUser) => {
    return {};
}

export default Index;
