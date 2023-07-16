export default class AuthHelper{
    static setLogin(data) {
        localStorage.setItem('data', JSON.stringify(data));
    }
    static isLogin() {
        let auth = localStorage.getItem('data');
        if(auth){
            return true;
        } else {
            return false;
        }
    }
    static getAuth(){
        let auth = localStorage.getItem('data');
        
        return JSON.parse(auth);
    }
    static setLogout() {
        localStorage.clear();
    }
}