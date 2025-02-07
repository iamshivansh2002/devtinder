const adminAuth=(req,res,next)=>{
    console.log('admin auth checking..');

    const token='xyz';
    const isAdminAuthorized=token==="xyz";
    if(!isAdminAuthorized){
        res.status(401).send("unauthorized request");
    }else{
        next();
    }
    };

    module.exports={adminAuth};