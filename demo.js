const jimp = require("jimp")
const buffer = Buffer.from(img.replace(/^data:image\/png;base64,/,""),"base64");

async function name() {
    const a= await jimp.read(img)
    console.log(a)
    
}
name()
// console.log(buffer)