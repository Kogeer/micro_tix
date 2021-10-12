import {useEffect, useState} from "react";
import Router from "next/router";
import StripeCheckout from "react-stripe-checkout";
import useRequest from "../../hooks/use-request";

const OrderShow = ({order, currentUser}) => {
    const [timeLeft, setTimeLeft] = useState(0);
    const [timerId, setTimerId] = useState(0);
    const {doRequest, errors} = useRequest({
        url: '/api/payments',
        method: 'post',
        body: {
            orderId: order.id
        },
        onSuccess: () => Router.push('/orders')
    });

    useEffect(() => {
        const findTimeLeft = () => {
            console.log('in find time left');
            const msLeft = new Date(order.expiresAt) - new Date();
            setTimeLeft(Math.round(msLeft / 1000));
        }

        findTimeLeft();
        const timerId = setInterval(findTimeLeft, 1000);
        setTimerId(timerId);

        return () => {
            clearInterval(timerId);
        }
    }, []);

    if (timeLeft < 0) {
        clearInterval(timerId);
        return <div>Order is expired!</div>;
    }

    return (
        <div>
            Time left to pay: {timeLeft} seconds
            <StripeCheckout
                token={({id}) => doRequest({token: id})}
                stripeKey="pk_test_51JfpUHAhsWQfTBV1MqJ4eTgTYwuQPr4oXBSebmwaPr1sAmDySY2JX1KQCJ24iZuUn20JkpKYBUvoxQU1ZGe4PzWg00RhJeBQs9"
                // You can keep it in helper, env, kube secret...
                amount={order.ticket.price * 100}
                email={currentUser.email}
            />
            {errors}
        </div>
    );
};

OrderShow.getInitialProps = async (context, client) => {
    const {orderId} = context.query;
    const {data} = await client.get(`/api/orders/${orderId}`);

    return {order: data};
};

export default OrderShow;
