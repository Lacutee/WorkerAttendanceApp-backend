const crypto = require('crypto')

const password = "4XfpSPQoj+nzw1+OqSEHzX3QZx16xkulh6TxUHNTbqE="

// password = crypto.createCipheriv('aes-128-ccm').update(password).digest('hex')
password = crypto.createHash('sha256').update(password).digest('hex');


console.log(password)