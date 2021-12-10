const permissionsModel = require("../../../models/admin/permissionModel.js");
import { CONSTANTS } from "../../../constants/constants.js";

const {
  RESPONSE_MESSAGE: { PERMISSIONS, FAILEDRESPONSE },
  STATUS_CODE: { SUCCESS, FAILED },
} = CONSTANTS;
class PermissionController {
  async roleQuery(filter, projection) {
    let query = { name: filter?.name };
    filter = filter && filter.orQuery ? query : filter;
    const data = await roleModel.findOne(filter, projection);
    return data;
  }

  async updatePermission(id) {
    const {
      ROLE: { SUPER_USER, DEVELOPER },
    } = CONSTANTS;
    let result;
    const roleUpdateList = [SUPER_USER, DEVELOPER];
    for (let i = 0; i < roleUpdateList.length; i++) {
      let checkExistingRole = await roleQuery({
        name: roleUpdateList[i],
      });
      if (checkExistingRole) {
        checkExistingRole.permissions.push(Types.ObjectId(id));
        let filter = { _id: checkExistingRole._id };
        result = await updateOneQuery(filter, checkExistingRole);
      }
    }
    return result;
  }

  async createPermission(req, res) {
    try {
      const {
        currentUser: { _id },
      } = req;

      const insertObj = {
        ...req.body,
        createdBy: _id,
      };
      const savePermission = new permissionsModel(insertObj);
      const saveResponse = await savePermission.save();
      if (saveResponse) {
        const updateRole = await updatePermission(saveResponse._id);
        if (updateRole) {
          res.status(SUCCESS).send({
            success: true,
            msg: PERMISSIONS.CREATESUCCESS,
            data: [],
          });
        } else {
          throw new Error(PERMISSIONS.CREATEFAILED);
        }
      } else {
        throw new Error(PERMISSIONS.CREATEFAILED);
      }
    } catch (error) {
      if (error.code === 11000) {
        error.message = PERMISSIONS.ALREADYAVALIABLE;
      }
      console.log(error);
      res.status(FAILED).json({
        success: false,
        error: error.message || FAILEDRESPONSE,
      });
    }
  }
}
export default PermissionController;
