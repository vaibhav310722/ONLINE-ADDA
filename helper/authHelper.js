import bcrypt from 'bcrypt'
export const hashPassword=async(password)=>{
    try{
        //Higher values increase the computational time required to hash the password, making it more secure
        const saltRounds=10;
        const hashedPassword=await bcrypt.hash(password,saltRounds)
        return hashedPassword;
    }
    catch(error){
        console.log(error)
    }
}
//in this we compare password
export const comparePassword=async(password,hashedPassword)=>{
    return bcrypt.compare(password,hashedPassword);
}
