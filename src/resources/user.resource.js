class UserResource {
  static transform(user) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    };
  }

  static collection(users) {
    return users.map(user => this.transform(user));
  }
}

export default UserResource;