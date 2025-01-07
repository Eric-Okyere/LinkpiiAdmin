const initialState={
    login:false,
    signup:false,
    user:'',
    error:{},
    userData:{name:"",email:''}
}


export default (state=initialState, action)=>{
    switch(action.type){
        case "LOGGED_IN":
            return { login:true, user:action.payload}
        case "SIGN_IN":
            return { signup:true, user:action.payload}
            case "LOGGED_OUT":
                return { login:false, user:''}
                break
                case "REGISTER_ERROR":
                    return{...state, error:{register:action.payload}}
       break
                    case "LOGIN_ERROR":
                        return{...state, error:{login:action.payload}}
           break;
                    case "SET_USERDATA":
                        return{...state, userData:action.payload}
           
                    default:
            return state;
    }
}
