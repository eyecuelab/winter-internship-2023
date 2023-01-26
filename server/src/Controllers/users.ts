import { getOneUser } from '../Models/users'

const usersControllers = {
  async getUserById(req: any, res: any) {
		const { id } = req.params;
    const user = await getOneUser(id);
    res.json(user);
  }
}

export default usersControllers;