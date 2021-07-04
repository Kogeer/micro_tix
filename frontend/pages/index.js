import buildClient from "../api/build-client";
import BaseLayout from "../components/base-layout";

const Index = ({ data }) => {
    return (
        <BaseLayout data={data}>
            {data.currentUser ? (
                <h1>You are signed in</h1>
            ) : (
                <h1>You are not signed in</h1>
            )}
        </BaseLayout>
    );
};

export async function getServerSideProps(context) {
    const {data} = await buildClient(context).get('/api/users/currentuser');

    return {props: {data}};
}

export default Index;
