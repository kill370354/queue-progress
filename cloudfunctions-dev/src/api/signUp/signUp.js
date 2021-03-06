const crypto = require('crypto')
const jwt = require('jwt-simple')
const {
  tokenExp
} = require('../../utils/constants.js')
const {
  encryptPassword
} = require('../../utils/encryptPassword.js')

const db = uniCloud.database()

async function signUp(event) {
  const {
    userId,
    password
  } = event
  const rawPassword = password
  let userInfo = {
    userId
  }

  const userInDB = await db.collection('user').where(userInfo).get()

  let tokenSecret = crypto.randomBytes(16).toString('hex'),
    token = jwt.encode(userInfo, tokenSecret)
  let userUpdateResult
  let avatar =
    "data:image/jpg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAAyADIDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDeZm3Hmm7m9aG+8aSvoj58Xc3rRub1rqfCeg22oQyXt4nmIr7EjJ4yOpP51q674ZsX06ae0gWCeJC42cBgOSCK5pYqEZ8jOmOGnKHOjgdzetG5vWkorpOYnycdT+dFA6UVBRC33jSUrfeNamh6HLrVw6rIIoowC74yeegA9acpKK5pbBGLk7I6LwXqqyQNpkgVWjBeM/3gTyPqK2df1VdJ0xpQFaVzsjQnqf8AACub1zw1FpdjBdWBmMkcgEjF/mOeARjpz/OpF0L+0PFFxBc+e1rBEp+eYscsOMH65/KvNlGlOXtb6f1+Z6EZVYR9nbU4+iuk17wqdMt2u7aYyW6kblf7y54znvXN16NOpGouaJwTpyg7SJx0ooHSigRC33jXZeA/uX/1T+tca33jT4p5oCTDNJGT1KMVz+VTWp+0g4lUans5qR63dW8d3ay28oykilT+NVNIs57S1ZrtxJdytulcd8cD9AK8z+33v/P5c/8Af1v8aPt97/z+XP8A39b/ABrj+pSty8x2fXI35uU9E8U/8i3efRf/AEIV5nU0l3czJsluZpF/uvISKhrqw9F0o8rZzV6qqyukTjpRQOlFaGQrAbjxSYHpRRTEGB6UYHpRRQAYHpRgelFFAE21cdB+VFFFIo//2Q=="

  if (userInDB.data && userInDB.data.length === 0) {
    userUpdateResult = await db.collection('user').add({
      ...userInfo,
      name: userId,
      avatar,

      password: encryptPassword(password),
      tokenSecret,
      exp: Date.now() + tokenExp
    })
  } else {
    return {
      status: -1,
      msg: '此用户ID已存在'
    }
  }

  if (userUpdateResult.id || userUpdateResult.affectedDocs === 1) {
    return {
      status: 0,
      token,
      user: {
        name: userId,
        avatar,
        userId,
        password: rawPassword,
        token
      },
      msg: '注册成功'
    }
  }

  return {
    status: -1,
    msg: '注册失败'
  }
}

exports.main = signUp
