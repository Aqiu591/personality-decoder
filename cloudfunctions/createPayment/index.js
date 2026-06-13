/**
 * 微信支付云函数
 *
 * 前置条件（上线前完成）：
 * 1. 微信支付商户号（pay.weixin.qq.com）
 * 2. 云开发控制台 → 设置 → 微信支付 → 绑定商户号
 * 3. 在 project.config.json 中配置云函数根目录
 * 4. 右键云函数 → 上传并部署
 *
 * 未满足条件时，云函数返回错误码，前端展示"支付暂不可用"
 */
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

exports.main = async (event) => {
  const { amount, description } = event

  if (!amount || amount < 100) {
    return { code: -1, msg: '金额无效' }
  }

  try {
    // 调用云开发统一支付
    const result = await cloud.cloudPay.unifiedOrder({
      body: description || '解锁完整性格报告',
      outTradeNo: 'report_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8),
      spbillCreateIp: '127.0.0.1',
      subMchId: '', // 子商户号（服务商模式填写）
      totalFee: amount, // 单位：分
      envId: cloud.DYNAMIC_CURRENT_ENV,
      functionName: 'createPayment' // 当前云函数名，用于接收支付回调
    })

    // 返回前端调用 wx.requestPayment 所需的参数
    return {
      code: 0,
      timeStamp: result.timeStamp,
      nonceStr: result.nonceStr,
      package: result.package,
      paySign: result.paySign
    }
  } catch (err) {
    console.error('支付下单失败:', err)
    return {
      code: -1,
      msg: err.errMsg || '支付服务暂不可用'
    }
  }
}
