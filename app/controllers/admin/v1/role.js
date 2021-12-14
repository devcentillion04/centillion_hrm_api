import { RoleSchema } from '../../models';
import {
	adminUserService,
	permissionService,
	roleService,
} from '../../mongoServices';
import { CONSTANTS } from '../../constants';
import { errorLogger } from '../../utils';
import { isValidObjectId } from 'mongoose';
const {
	RESPONSE_MESSAGE: { ROLE, FAILEDRESPONSE, INVALIDOBJECTID },
	STATUS_CODE: { SUCCESS, FAILED },
} = CONSTANTS;
const createRole = async (req, res) => {
	try {
		const {
			currentUser: { _id },
		} = req;
		const insertObj = {
			...req.body,
			createdBy: _id,
		};
		const findPermissions = await permissionService.findByIdQuery(
			req.body?.permissions,
		);
		if (findPermissions === false) {
			throw new Error('some permission is not avalible');
		}

		const saveRole = new RoleSchema(insertObj);
		const saveResponse = await saveRole.save();

		if (saveResponse) {
			res.status(SUCCESS).send({
				success: true,
				msg: ROLE.CREATESUCCESS,
				data: [],
			});
		} else {
			throw new Error(ROLE.CREATEFAILED);
		}
	} catch (error) {
		errorLogger(error.message, req.originalUrl, req.ip);
		res.status(FAILED).json({
			success: false,
			error: error.message || FAILEDRESPONSE,
		});
	}
};
const getRole = async (req, res) => {
	try {
		const { data, totalCount } = await roleService.findAllQuery(req.query);
		if (data) {
			res.status(SUCCESS).send({
				success: true,
				msg: ROLE.GETSUCCESS,
				total: totalCount,
				data,
			});
		} else {
			throw new Error(ROLE.GETFAILED);
		}
	} catch (error) {
		errorLogger(error.message, req.originalUrl, req.ip);
		res.status(FAILED).json({
			success: false,
			error: error.message || FAILEDRESPONSE,
		});
	}
};
const updateRole = async (req, res) => {
	try {
		const {
			params: { id },
		} = req;
		if (!isValidObjectId(id)) {
			throw new Error(INVALIDOBJECTID);
		}
		const findPermissions = await permissionService.findByIdQuery(
			req.body?.permissions,
		);
		if (findPermissions === false) {
			throw new Error('some permission is not avalible');
		}

		let filter = { _id: id };
		const { data } = await roleService.findAllQuery(filter);
		if (data.length === 1) {
			let update = { ...req.body };
			const data = await roleService.updateOneQuery(filter, update);
			if (data) {
				res.status(SUCCESS).send({
					success: true,
					msg: ROLE.UPDATESUCCESS,
					data,
				});
			} else {
				throw new Error(ROLE.UPDATEFAILED);
			}
		} else {
			throw new Error(ROLE.NOTROLE);
		}
	} catch (error) {
		errorLogger(error.message, req.originalUrl, req.ip);
		res.status(FAILED).json({
			success: false,
			error: error.message || FAILEDRESPONSE,
		});
	}
};
const deleteRole = async (req, res) => {
	try {
		const {
			params: { id },
		} = req;
		if (!isValidObjectId(id)) {
			throw new Error(INVALIDOBJECTID);
		}
		const checkExistingUser = await adminUserService.userQuery({
			role: id,
		});
		if (checkExistingUser) {
			throw new Error(ROLE.USERAVAILABLE);
		}
		const data = await roleService.deleteOneQuery(id);
		if (data) {
			res.status(SUCCESS).send({
				success: true,
				msg: ROLE.DELETESUCCESS,
				data: [],
			});
		} else {
			throw new Error(ROLE.DELETEFAILED);
		}
	} catch (error) {
		errorLogger(error.message, req.originalUrl, req.ip);
		res.status(FAILED).json({
			success: false,
			error: error.message || FAILEDRESPONSE,
		});
	}
};

export default { createRole, updateRole, deleteRole, getRole };
