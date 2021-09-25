export default class ApiResponse {

    /**
     * 
     * @param {String} status is either 'ERROR' or 'SUCCESS'
     * @param {*} response an object 
     */
    constructor(status, response) {
        this.status = status;
        this.response = response;
    }

    static GET_SUCCESS() {
        return 'SUCCESS';
    }
    static GET_ERROR() {
        return 'ERROR';
    }
}