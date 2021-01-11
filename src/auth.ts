// : at the beginning because the username isn't needed for authentification
//TODO: hide secret
const myPATToken=':3bm3hcokqz5ackq4fadsn3eqf22gjjjsrspfytk5xk7zetrr447q';
export const AUTH_HEADER = {
    'Authorization': 'Basic '+btoa(myPATToken) 
};
