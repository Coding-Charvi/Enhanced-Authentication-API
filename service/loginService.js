const bcrypt  = require("bcrypt");
const pool =require("../db");
// const RegistractionResponse=require("../responseModel/registrationResponse");
const LoginResponse=require("../responseModel/loginResponse");
module.exports.loginUser=  function loginUser(loginRequest){
   const email=loginRequest.email;
   const password=loginRequest.password;
   
    if (!email || !password) {
        throw new Error('email, and password are required');
    }
    
    return new Promise( async (resolve,reject)=>{
        try {  
            let query="select * from user_details where email=? ";
            await pool.query(query,[email],async (error,result,feilds)=>{
                if (error) {
                    reject(error);
                } else {
                    if(result.length==0){
                       resolve('Invalid Log In!!');
                    }
                    else{
                      
                     if(result.length!=1){
                        let loginResponse=new LoginResponse('Invalid EmailId or Password!!'); 
                        resolve(loginResponse); 
                     }   
                    const isValidUser= await bcrypt.compare(password,result[0].password);
                     
                    if(!isValidUser){
                        let loginResponse=new LoginResponse('Invalid EmailId or Password!!'); 
                        resolve(loginResponse); 
                    }
                     let loginResponse=new LoginResponse('User logged in Successfully',result[0].id,result[0].name,result[0].bio,result[0].image,result[0].phone_number,result[0].email); 
                    resolve(loginResponse); 
                    }
                }
            }) 
        } catch (error) {
            reject(error);
        }
    })

}

