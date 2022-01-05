// let moment = require("moment");
// // var a = moment([2007, 0, 29]);
// // var b = moment([2007, 0, 28]);
// // a.diff(b, "days"); // =1
// let data = {
//   leaveTypes: "Paid-Leave",
//   leaveFrom: "2022-01-11T18:30:00.000Z",
//   leaveTo: "2022-01-13T18:30:00.000Z",
//   reason: "trrt",
// };
// let leaveTo = [moment(data.leaveTo).format("YYYY, MM, DD")].diff([
//   moment(data.leaveFrom).format("YYYY, MM, DD"),
// ]);
// // let leaveFrom = [moment(data.leaveFrom).format("YYYY, MM, DD")];
// console.log(leaveTo);
// let result = leaveFrom.diff(leaveTo, "days");
// console.log(result);
const moment = require("moment");

// var dateOne = moment([2019, 03, 17]);
// var dateTwo = moment([2001, 10, 28]);
let data = {
  leaveTypes: "Paid-Leave",
  leaveFrom: "2022-01-11T18:30:00.000Z",
  leaveTo: "2022-01-13T18:30:00.000Z",
  reason: "trrt",
};
let leaveTo = [moment(data.leaveTo).format("YYYY, MM, DD")].diff([
  moment(data.leaveFrom).format("YYYY, MM, DD"),
]);
// Function call
// var result = dateOne.diff(dateTwo, "days");

console.log("No of Days:", leaveTo);
