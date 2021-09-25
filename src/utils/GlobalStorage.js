import UserEntity from "../models/UserEntity";

// purpose of this item is just to remember what I store in local storage. 
// do not use it... unless you want to use an useless object.
let GlobalStorage = 
{
    /** @type Boolean */
    isUserLoggedIn:false,
    /** @type UserEntity*/
    userEntity:null
};
export default GlobalStorage;