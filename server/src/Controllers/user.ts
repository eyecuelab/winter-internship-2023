import { getOneUser, createUser } from '../Models/user'

const userControllers = {
  async getUserById(req: any, res: any) {
		const { id } = req.params;
    const user = await getOneUser(id);
    res.json(user);
  },

  async createUser(req: any, res: any) {
		const { email, name } = req.body;
		const newUser = await createUser(email, name);
		res.status(201).json(newUser);
	},
}

export default userControllers;