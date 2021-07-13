First create a port forwarding on NATS-streaming server.  
Example:
`kubectl port-forward nats-depl-5bfbb6cfb5-mxwh8 4222:4222`  
After that, you can access to NATS Streaming Server.  

To run the publisher and listener, you can with package.json scripts.  
With `rs` command you can restart the publisher or listen.  

NATS-streaming server monitoring:
`kubectl port-forward NATS-DEPL-POD-NAME 8222:8222`  
You can see on localhost:8222