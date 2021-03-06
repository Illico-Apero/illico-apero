import ApiResponse from "../models/api/ApiResponse";

export default class Http {

    /**
     * 
     * @param {String} url 
     * @param {String} jwt 
     * @param {Function} callback 
     */
    static get(url, jwt, callback)
    {
        fetch(url, 
        {
            method: 'GET',
            headers:{
                Accept: 'application/json',
                'Content-Type' : 'application/json',
                'Authorization': 'Bearer ' + jwt,
            },
        }).then((response) => response.json())
        .then( (data) => 
        {
            callback(data);
        })
        .catch(
            (error) => {
                console.error(error)
                let errorData = JSON.stringify(new ApiResponse(ApiResponse.GET_ERROR(), error));
                callback(errorData);
            });
    }

        /**
         * 
         * @param {String} url 
         * @param {Function} callback 
         */
        static getWithoutJwt(url, callback)
        {
            fetch(url, 
            {
                method: 'GET',
                headers:{
                    'Accept': 'application/json',
                    'Content-Type' : 'application/json',
                },
            }).then((response) => response.json())
            .then( (data) => 
            {
                callback(data);
            })
            .catch(
            (error) => {
                console.error(error)
                let errorData = JSON.stringify(new ApiResponse(ApiResponse.GET_ERROR(), error));
                callback(errorData);
            });
        }


    /**
     * 
     * @param {String} url 
     * @param {String} body 
     * @param {String} jwt
     * @param {Function} callback
     */
    static postWithJwt(url, body, jwt, callback)
    {
        fetch(url, 
        {
            method: 'POST',
            headers:{
                'Accept': 'application/json',
                'Content-Type' : 'application/json',
                'Authorization': 'Bearer ' + jwt,
            },
            body:body
        }).then((response) => response.json())
        .then( (data) => 
        {
            callback(data);
        })
        .catch(
            (error) => {
                console.error(error)
                let errorData = JSON.stringify(new ApiResponse(ApiResponse.GET_ERROR(), error));
                callback(errorData);
            });
    }

    /**
     * 
     * @param {String} url 
     * @param {String} body 
     */
    static postWithoutJwt(url, body, callback)
    {
        fetch(url, 
        {
            method: 'POST',
            headers:{
                'Accept': 'application/json',
                'Content-Type' : "application/json",
            },
            body:body
        }).then((response) => response.text())
        .then( (data) => 
        {
            callback(data);
        })
        .catch(
            (error) => {
                console.error(error)
                let errorData = JSON.stringify(new ApiResponse(ApiResponse.GET_ERROR(), error));
                callback(errorData);
            });
    }
}