class User{
	
	toMap(){
		return {
			id: this.id,
            first_name: this.first_name,
            last_name: this.last_name,
            email: this.email,
            is_admin: this.is_admin,
            is_superuser: this.is_superuser,
		};
	}
	
	toJson(){
		return this.toMap();
	}

    static map(obj){
        var instance = new User();
        instance.id = obj.id;
		instance.first_name = obj.first_name;
		instance.last_name = obj.last_name;
		instance.email = obj.email;
		instance.is_admin = obj.is_admin;
		instance.is_superuser = obj.is_superuser;
		return instance;
	}
	
	static mapArray(list){
		var objects = [];
		try {
			list.forEach((m) => {
				objects.push(User.map(m));
			});
		}catch(e){
			console.log('Exception while mapping array.');
			console.log(e);
		}
		return objects;
	}

	// model methods
	toString() {
		return this.email
	}

}

export default User;