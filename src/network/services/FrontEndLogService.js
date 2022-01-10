import ApiResponse from "../../models/api/ApiResponse";
import Http from '../Http';
import configuration from '../../config/configuration.json';

export default class FrontEndLogService {

    saveLog(idOfConcernedUserIfApplicable, errorMessage) {
        let body = {
            idOfConcernedUserIfApplicable: idOfConcernedUserIfApplicable,
            errorMessage: errorMessage
        };
        Http.postWithoutJwt(configuration.server.baseUrl + configuration.endpoints.saveLog, JSON.stringify(body), 
        (data) => {
            /** @type ApiResponse */
            if(data.status === ApiResponse.GET_ERROR()) {
                console.log("error occured while saving another error log to server.")
                console.error(data.response);
            }
            else {
                console.warn("error log saved to server");
            }
        });
    }
}