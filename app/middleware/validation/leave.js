const yup = require("yup");

const applyLeave = yup.object().shape({
  reason: yup.string().required("Leave Reason field required"),
  leaveType: yup.string().required("Leave type required"),
  type: yup.string().required("Leave type required"),
  leaveFrom: yup.string().required("leaveFrom field required"),
  leaveTo: yup.string().required("leaveTo field required"),
});

const approveLeave = yup.object().shape({
  approvedBy: yup.string().required("approvedBy field required"),
});

const rejectLeave = yup.object().shape({
  approvedBy: yup.string().required("rejectedBy field required"),
});
module.exports = {
  applyLeave,
  approveLeave,
  rejectLeave,
};
