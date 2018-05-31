class UserStore {
    users = {};

    callbacks = [];

    login() {
        //console.log("UserStore login");
        this.authed = true;
    }

    setUserInfo(email, displayName, photoURL, uid, taskNum) {
       // console.log("UserStore fetchUserInfo");
        this.email = email;
        this.displayName = displayName;
        this.photoURL = photoURL;
        this.uid = uid;
        this.taskNum = taskNum;
    }

    registerCallback(callback){
      this.callbacks.push(callback);
    }

    setUsers(usersObj){
        this.users = usersObj;
        console.log(usersObj);
        this.callbacks.map(cb=>{ cb(); });
    }

    logout() {
        //console.log("UserStore logout");
        this.authed = false;
        this.email = "";
        this.displayName = "";
        this.photoURL = "";
        this.uid = "";
        this.role = "";
        this.callbacks.map(cb=>{ cb(); });
    }
}

const userStore = new UserStore();
export default userStore;
