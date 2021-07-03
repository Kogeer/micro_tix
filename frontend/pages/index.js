import buildClient from "../api/build-client";

const Index = ({ data }) => {
    return data.currentUser ? <h1>You are signed in</h1> : <h1>You are not signed in</h1> ;
};

export async function getServerSideProps(context) {
    const {data} = await buildClient(context).get('/api/users/currentuser');

    return {props: {data}};
}

export default Index;
