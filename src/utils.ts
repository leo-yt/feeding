// 将时间戳转为 小时:分
const getTimes = (ts?: string | number) => {
  const x = ts ?? new Date().getTime();
  const date = new Date(x);
  const hour = date.getHours();
  const minutes = date.getMinutes();
  const h = hour >= 10 ? hour : `0${hour}`;
  const min = minutes >= 10 ? minutes : `0${minutes}`;
  return `${h}:${min}`;
}
// 获取今日日期
const today = () => {
  const date = new Date();
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  return `${y}/${m}/${d}`;
}
// 时间戳转为日期加时间
const tsToDate = (ts?: number) => {
  const x = ts ?? new Date().getTime();
  const date = new Date(x);
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const h = date.getHours();
  const ms = date.getMinutes();
  const hh = h >= 10 ? h : `0${h}`;
  const mms = ms >= 10 ? ms : `0${ms}`;
  return `${y}/${m}/${d} ${hh}:${mms}`;
}
// 日期转为时间戳
const dateToTs = (value: string) => {
  const date = new Date();
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const [h,ms] = value.split(':');
  const ds = `${y}/${m}/${d} ${h}:${+ms >= 10 ? ms : `0${ms}`}`;
  return new Date(ds).getTime()
}
// 获取时间差
const getDiffTime = (time: number) => {
  const now = new Date().getTime();
  const diff = now - time;
  const bh = diff/(60*60*1000)
  const dh = parseInt(`${bh}`);
  const dm = (bh-dh)*60;
  const minutes = parseInt(`${dm}`);
  return `${dh}小时${minutes}分前`;
}
// uid
const uid = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
export {
  getTimes,
  today,
  tsToDate,
  dateToTs,
  getDiffTime,
  uid
}