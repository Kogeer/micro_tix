import Header from "./header";

const BaseLayout = ({children, data}) => {
    return (
        <>
            <Header currentUser={data.currentUser} />
            {children}
        </>
    );
};

export default BaseLayout;
