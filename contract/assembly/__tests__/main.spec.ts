import { setAttendance } from '..'
import { storage, Context } from 'near-sdk-as'

describe('Greeting ', () => {
  it('should be set and read', () => {
    setAttendance('hello world')
    storage.get<string>(Context.sender)
  })
})
