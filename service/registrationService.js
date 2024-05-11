const bcrypt = require("bcrypt");
const pool =require("../db");
const RegistractionResponse=require("../responseModel/registrationResponse");


function base64ToImageUrl(base64String, imagePath) {
    try{
    // To Create a buffer from the base64 string
    const base64Data = base64String.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    // To Generate a unique file name
    const fileName = `${Date.now()}_${Math.floor(Math.random() * 10000)}.png`;

    // Construct the file path
    const filePath = path.join(imagePath, fileName);
     
    // Write the buffer to a file
    fs.writeFileSync(filePath, buffer);

    // Construct and return the image URL
    const imageUrl = filePath;
     
    return imageUrl;
    }
    catch (error) {
        throw new Error('Error handling direct photo upload: ' + error.message);
    }
};
module.exports.createUser=async function createUser(registractionRequest){
   try{ 
   const name=registractionRequest.name;
   const imageBase64=registractionRequest.imageBase64;
   const bio=registractionRequest.bio;
   const imageUrl=registractionRequest.imageUrl;
   const phoneNumber=registractionRequest.phoneNumber;
   const email=registractionRequest.email;
   const password=registractionRequest.password;
   
   const profileType=registractionRequest.profileType;
   const role=registractionRequest.role;

    if (!name || !email || !password) {
        throw new Error('Username, email, and password are required');
    }
    const encryptedPassword=await bcrypt.hash(password,10);
    //phoneNumber should be of 10 digits..
    const phoneNumberRegex = /^\d{10}$/;
    if (phoneNumber && !phoneNumberRegex.test(phoneNumber)) {
     throw new Error('Invalid phone number. Phone number must be exactly 10 digits.');
    }

    return new Promise( async (resolve,reject)=>{
        try {
            let imageUrlToStore;
            if (imageUrl) {
                imageUrlToStore = imageUrl; // Use provided image URL directly
            } else if (imageBase64) {
                const imagePath='/Users/charvizala/Desktop/Voosh_Backend_Task/images';
                imageUrlToStore = base64ToImageUrl(imageBase64,imagePath);
            }
            let checkquery="select * from user_details where email=?";
            await pool.query(checkquery,[email],(error,result,feilds)=>{
                if (error) {
                    reject(error);
                } else {
                    if(result.length>0){
                    let registractionResponse=new RegistractionResponse('User already Exist!!');
                    resolve(registractionResponse);
                    }
                }
            }) 

            let query="insert into user_details (name,image,bio,phone_number,email,password,profile_type,role) values (?,?,?,?,?,?,?,?)";
            await pool.query(query,[name,imageUrlToStore,bio,phoneNumber,email,encryptedPassword,profileType,role],(error,result,feilds)=>{
                if (error) {
                    reject(error);
                } else {
                    let registractionResponse=new RegistractionResponse('User created successfully',result.insertId);
                    resolve(registractionResponse); // Resolve the Promise with the response
                }
            }) 
        } catch (error) {
            reject(error);
        }
    })
  } catch(error){
     
  }

}

