import axios from "axios";

const buildClient = ({ req }) => {
    // The baseURL is the SERVICENAME.NAMESPACE.svc.cluster.local
    // for reach the ingress-nginx from frontend service
    return axios.create({
        baseURL: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
        headers: req.headers
    });
};

export default buildClient;
