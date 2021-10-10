beforeAll(async function () {
  // NOTE: nearlib and nearConfig are made available by near-cli/test_environment
  const near = await nearlib.connect(nearConfig)
  window.accountId = nearConfig.contractName
  window.contract = await near.loadContract(nearConfig.contractName, {
    viewMethods: ['getAttendance'],
    changeMethods: [],
    sender: window.accountId
  })
})

test('getAttendance', async () => {
  const message = await window.contract.getAttendance({ accountId: window.accountId })
  expect(message).toEqual('Hello')
})
