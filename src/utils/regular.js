const phoneRegular = {
  reg: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/,
  msg: '手机号输入有误',
};

const idCardRegular = {
  reg: /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/,
  msg: '身份证号输入有误',
};
const emailRegular = {
  reg: /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/,
  msg: '邮箱号输入有误',
};
const postalCodeRegular={
  reg:/^[1-9][0-9]{5}$/,
  msg:'邮政编码输入有误',
} ;

const delectBeforeAndBehindBlackRegular={
  reg:/(^\s*)|(\s*$)/g,
  msg:'replace之后去除前后空格',
} ;

const fixedTelephoneRegular = {
  reg:/^\d{3}-\d{5,10}|\d{4}-\d{5,10}$/,
  msg:'固定电话有误',
};

const editPwd={
  reg:/^\d{6}$/,
  msg:"密码修改有误",
}

const chinese={
  reg: /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/,
  msg:"请输入非符号！"
}
const justChinese={
  reg:/^[\u4e00-\u9fa5]+$/,
  msg:"请输入中文"
}

const number={
  reg:/^[0-9]+$/g,
  msg:"请输入数字！"
}
module.exports = {
  delectBeforeAndBehindBlackRegular,
  phoneRegular,
  idCardRegular,
  emailRegular,
  postalCodeRegular,
  fixedTelephoneRegular,
  editPwd,
  chinese,
  justChinese,
  number
};
