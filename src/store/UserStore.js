class UserStore {

    login() {
        //console.log("UserStore login");
        this.authed = true;
    }

    setUserInfo(email, displayName, photoURL, uid) {
       // console.log("UserStore fetchUserInfo");
        this.email = email;
        this.displayName = displayName;
        this.photoURL = photoURL;
        this.uid = uid;
    }

    logout() {
        //console.log("UserStore logout");
        this.authed = false;
        this.email = "";
        this.displayName = "";
        this.photoURL = "";
        this.uid = "";
        this.role = "";
    }
}

const userStore = new UserStore();
export default userStore;
