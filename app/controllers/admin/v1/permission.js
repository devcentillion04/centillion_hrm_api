import { PermissionSchema } from '../../../models/admin/permissionModel.js';
import { permissionService, roleService } from '../../../services';
import { CONSTANTS } from '../../../constants';
import { errorLogger } from '../../utils';
import { isValidObjectId } from 'mongoose';
const {
	RESPONSE_MESSAGE: { PERMISSIONS, FAILEDRESPONSE, INVALIDOBJECTID },
	STATUS_CODE: { SUCCESS, FAILED },
} = CONSTANTS;

const createPermission = async (req, res) => {
	try {
		const {
			currentUser: { _id },
		} = req;

		const insertObj = {
			...req.body,
			createdBy: _id,
		};
		const savePermission = new PermissionSchema(insertObj);
		const saveResponse = await savePermission.save();
		if (saveResponse) {
			const updateRole = await roleService.updatePermission(saveResponse._id);
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
		errorLogger(error.message, req.originalUrl, req.ip);
		res.status(FAILED).json({
			success: false,
			error: error.message || FAILEDRESPONSE,
		});
	}
};

const getPermission = async (req, res) => {
	try {
		const { data, totalCount } = await permissionService.findAllQuery(
			req.query,
		);
		if (data) {
			res.status(SUCCESS).send({
				success: true,
				msg: PERMISSIONS.GETSUCCESS,
				total: totalCount,
				data,
			});
		} else {
			throw new Error(PERMISSIONS.GETFAILED);
		}
	} catch (error) {
		errorLogger(error.message, req.originalUrl, req.ip);
		res.status(FAILED).json({
			success: false,
			error: error.message || FAILEDRESPONSE,
		});
	}
};
const updatePermission = async (req, res) => {
	try {
		const {
			params: { id },
		} = req;
		if (!isValidObjectId(id)) {
			throw new Error(INVALIDOBJECTID);
		}
		let filter = { _id: id };
		const { data } = await permissionService.findAllQuery(filter);
		if (data.length === 1) {
			let update = { ...req.body };
			const data = await permissionService.updateOneQuery(filter, update);
			res.status(SUCCESS).send({
				success: true,
				msg: PERMISSIONS.UPDATESUCCESS,
				data,
			});
		} else {
			throw new Error(PERMISSIONS.UPDATEFAILED);
		}
	} catch (error) {
		errorLogger(error.message, req.originalUrl, req.ip);
		res.status(FAILED).json({
			success: false,
			error: error.message || FAILEDRESPONSE,
		});
	}
};
const deletePermission = async (req, res) => {
	try {
		const {
			params: { id },
		} = req;
		if (!isValidObjectId(id)) {
			throw new Error(INVALIDOBJECTID);
		}
		const data = await permissionService.deleteOneQuery(id);
		if (data) {
			res.status(SUCCESS).send({
				success: true,
				msg: PERMISSIONS.DELETESUCCESS,
				data: [],
			});
		} else {
			throw new Error(PERMISSIONS.DELETEFAILED);
		}
	} catch (error) {
		errorLogger(error.message, req.originalUrl, req.ip);
		res.status(FAILED).json({
			success: false,
			error: error.message || FAILEDRESPONSE,
		});
	}
};
export default {
	createPermission,
	getPermission,
	updatePermission,
	deletePermission,
};
