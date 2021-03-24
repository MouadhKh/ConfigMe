import axios from "axios";
import {getAuthHeader} from "../auth";

export async function authenticate(username: string, password: string) {
    const url = `https://auth.docker.io/token?service=registry-2.docker.io`;
    // const url = `https://hub.docker.com/v2/users/login/`;
    const authHeader = getAuthHeader("ntnwpbowghpwuevdzcn4gort4iwmmvoytlsqz2h4rwuwsodw7t7a");
    // const authHeader=getAuthHeader(azureToken)
    const body = {
        username: username, password: password
    }
    return await axios.get(url, {
        auth: {
            username: username,
            password: password
        }
    }).then((response: any) => response.status == 200)
}