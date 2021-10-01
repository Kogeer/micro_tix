import 'bootstrap/dist/css/bootstrap.css';
import buildClient from "../api/build-client";
import Header from "../components/header";

const App = ({ Component, pageProps, currentUser}) => {
    return (
        <>
            <Header currentUser={currentUser} />
            <div className="container">
                <Component currentUser={currentUser} {...pageProps}/>
            </div>
        </>
    )
};

// getServerSideProps data fetching NOT working in custom App component!
App.getInitialProps = async (appContext) => {
    const client = buildClient(appContext.ctx);
    const {data} = await client.get('/api/users/currentuser');
    let pageProps = {};

    if (appContext.Component.getInitialProps) {
        // Here call child component getInitialProps and provide the client
        pageProps = await appContext.Component.getInitialProps(appContext.ctx, client, data.currentUser);
    }

    return {
        pageProps,
        ...data
    };
}

export default App;
