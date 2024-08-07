//creating Token and svae it in cookie

export const sendToken=(user,statuscose,res)=>{
    const token=user.getJWTToken()

    const options={
        expires:new Date(
            Date.now() +process.env.COOKIE_EXPIRE *24*60*60*1000
        ),
        httpOnly:true,
    };

    res.status(statuscose).cookie("token",token,options).json({
        success:true,
        user,
        token
    })

}