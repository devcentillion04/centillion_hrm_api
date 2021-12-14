import { Types } from 'mongoose';
import { CONSTANTS } from '../../constants';
import { RoleSchema } from '../../models/admin/roleModel.js';
const findAllQuery = async (query) => {
	let { search, _id, limit, page, sortField, sortValue } = query;
	let sort = {};
	let whereClause = {};
	if (sortField) {
		sort = {
			[sortField]: sortValue === 'ASC' ? 1 : -1,
		};
	} else {
		sort = {
			displayName: 1,
		};
	}
	if (search) {
		search = new RegExp(search, 'ig');
		whereClause = {
			$or: [{ displayName: search }, { path: search }],
		};
	}
	if (_id) {
		whereClause = { ...whereClause, _id };
	}
	const data = await RoleSchema
		.find(whereClause)
		.skip(page > 0 ? +limit * (+page - 1) : 0)
		.limit(+limit || 20)
		.sort(sort)
		.populate({
			path: 'permissions',
			model: 'admin_Permissions',
		});
	const totalCount = await RoleSchema.find(whereClause).countDocuments();
	return { data, totalCount };
};

const updateOneQuery = async (filter, update, projection) => {
	let options = { new: true, fields: { ...projection } };

	const data = await RoleSchema.findOneAndUpdate(filter, update, options);
	return data;
};
const deleteOneQuery = async (filter) => {
	const data = await RoleSchema.findByIdAndDelete(filter);
	return data;
};
const roleQuery = async (filter, projection) => {
	let query = { name: filter?.name };
	filter = filter && filter.orQuery ? query : filter;
	const data = await RoleSchema.findOne(filter, projection);
	return data;
};

const updatePermission = async (id) => {
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
};
export default {
	findAllQuery,
	updateOneQuery,
	deleteOneQuery,
	roleQuery,
	updatePermission,
};
