import { getRole, createRole } from "../Models/role"
const roleControllers = {
  async getRoleById(req: any, res: any) {
    const { id } = req.params;
    const role = await getRole(id);
    res.json(role);
  },
  async createRole(req: any, res: any) {
    const { name } = req.body;
    const newRole = await createRole(name);
    res.status(201).json(newRole);
  },
}
export default roleControllers;